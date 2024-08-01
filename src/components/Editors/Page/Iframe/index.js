import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

import {
  Button,
  Card,
  Popconfirm,
  Popover,
  Menu,
  Tree,
  message,
  theme,
} from "antd";

import ThemeServices from "../../../..//lib/services/theme";

import SettingServices from "../../../../lib/services/setting";
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import ContentEditor from "../Element/ContentEditor";
import { MdElectricalServices } from "react-icons/md";
import AddElement from "../Element/AddElemet";
import Setting from "../Element/Setting";
import { BsArrowsMove } from "react-icons/bs";

// InnerComponent is responsible for loading CSS styles and calling the onLoad function
const InnerComponent = ({ children, document, onLoad, _id, type }) => {
  // Function to load a single font
  const loadFont = async (font) => {
    const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;
    if (isGoogleFont && src) {
      const linkElement = document.createElement("div");
      linkElement.id = "google-font-" + _uid;
      linkElement.innerHTML = src;
      document.head.appendChild(linkElement);
    } else if (Array.isArray(fontSrc)) {
      try {
        const styleElement = document.createElement("style");
        styleElement.textContent = "";
        for (const src of fontSrc) {
          if (src.src)
            styleElement.textContent += `
              @font-face {
                font-family: "${fontFamily}";
                src: url("${src.src}");
              }
            `;
        }
        document.head.appendChild(styleElement);
      } catch (error) {
        message.error(`Failed to load ${fontFamily} font: ${error}`);
      }
    }
  };

  // Function to append custom styles to document head
  const appendCustomStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
  
      @keyframes ac-001-pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Function to load CSS styles
  const loadCSSStyles = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Fetch settings and append scripts to document head
        let res = await SettingServices.get();

        if (res?.setting) {
          document.head.insertAdjacentHTML(
            "beforeend",
            res.setting.scripts?.head || ""
          );
          document.body.insertAdjacentHTML(
            "beforeend",
            res.setting.scripts?.footer || ""
          );
        }

        //Fetch fonts and append to document head
        res = await ThemeServices.getFonts();
        if (res.fonts) res.fonts.data.forEach(loadFont);

        // Set font styles to root
        const root = document.documentElement;
        if (res.fonts)
          for await (let font of res.fonts.data) {
            root.style.setProperty(font.variable, font.fontFamily);
          }

        // Fetch colors and set to root
        res = await ThemeServices.getColors();
        if (res.colors)
          for await (let color of res.colors.data) {
            root.style.setProperty(color.variable, color.color);
          }

        // Fetch variables and set to root
        res = await ThemeServices.getVariables();
        if (res.variables)
          for await (let variable of res.variables.data) {
            root.style.setProperty(variable.variable, variable.value);
          }

        // Append custom styles to document head
        appendCustomStyles();

        // Fetch custom CSS and append to document head
        res = await ThemeServices.getCss();
        if (res.css) {
          const style = document.createElement("style");
          style.textContent = res.css;
          document.head.appendChild(style);
        }

        resolve(true);
      } catch (e) {
        reject(e?.message);
      }
    });
  };

  // useEffect hook to load CSS styles and call onLoad function when _id changes
  useEffect(() => {
    if (_id)
      loadCSSStyles()
        .then((status) => {
          onLoad({ _id }, type, document);
        })
        .catch((e) => {
          message.error(e?.message || "Something went wrong!");
        });
    else onLoad(null, "", document);
  }, [_id]);

  return children;
};

// ShadowRootComponent is a wrapper component that provides a shadow root for its children
const ShadowRootComponent = ({ children }) => {
  // const rootRef = useRef();

  // useEffect(() => {
  //   if (rootRef.current) {
  //     if (!rootRef.current.shadowRoot) {
  //       const shadowRoot = rootRef.current.attachShadow({ mode: 'open' });
  //       ReactDOM.render(children, shadowRoot);
  //     } else {
  //       ReactDOM.render(children, rootRef.current.shadowRoot);
  //     }
  //   }
  // }, [children]);

  return children; //<div style={{height: '100%', width: '100%'}} ref={rootRef} />;
};

export default function IFrame({
  _id,
  pageType,
  state,
  children,
  onUpdate,
  onLoad,
  onChange,
  previewMode,
  onClickElement,
  onAdd,
  onDelete,
  onCopy,
  onMove,
}) {
  // Refs for various elements
  const iframeRef = useRef();
  const overlayRef = useRef();
  const overlayRef2 = useRef();
  const tooltipRef = useRef();

  // Theme tokens
  const {
    token: { colorPrimary, colorPrimaryBg, colorText },
  } = theme.useToken();

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuElements, setContextMenuElements] = useState([]);
  const [currentElement, setCurrentElement] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [container, setContainer] = useState(null);
  const [gapBarPos, setGapBarPos] = useState(null);

  // Function to create context menu
  const createContextMenu = useCallback((elements, mousePosition) => {
    const elementsWithUid = elements
      .filter((element) => element.dataset.id)
      .map((element) => ({
        uid: element.dataset.id,
        name: element.dataset.name || element.tagName,
        layout: element.dataset.name || element.tagName,
        pos: element.dataset.pos,
      }));

    setContextMenuVisible(true);
    setContextMenuPosition({
      x: mousePosition.x,
      y: mousePosition.y,
    });
    setContextMenuElements(elementsWithUid);
  }, []);

  // Effect to adjust context menu position
  useEffect(() => {
    if (
      !tooltipRef?.current ||
      !contextMenuVisible ||
      contextMenuPosition?.visible
    )
      return;

    if (!container?.window) return;

    const toolTypeStyle = window.getComputedStyle(tooltipRef?.current);
    const tooltipWidth = parseInt(toolTypeStyle.width, 10); // Width of the tooltip
    const tooltipHeight = parseInt(toolTypeStyle.height, 10); // Height of the tooltip

    const adjustedX =
      contextMenuPosition.x + tooltipWidth > container.window.innerWidth
        ? contextMenuPosition.x - tooltipWidth
        : contextMenuPosition.x;
    const adjustedY =
      contextMenuPosition.y + tooltipHeight > container.window.innerHeight
        ? contextMenuPosition.y - tooltipHeight
        : contextMenuPosition.y;

    setContextMenuPosition({
      x: adjustedX,
      y: adjustedY,
      visible: true,
    });
  }, [contextMenuVisible, contextMenuPosition, container, tooltipRef]);

  // Function to handle menu item click
  const handleMenuItemClick = useCallback(
    (key) => {
      if (!key || state.node?._uid === key) {
        return;
      }

      onClickElement(container?.document, key);
      ContentEditor.destroy();
    },
    [state.node, container]
  );

  // Effect to set container
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;
    const iframeWindow = iframe.contentWindow;

    setContainer({
      window: iframeWindow,
      mountTarget: iframeDocument.body,
      document: iframeDocument,
    });
  }, [iframeRef.current]);

  const getValidElement = (target) => {
    if (!target.dataset.id) return target.parentNode;

    return target;
  };

  const isSameElement = (id) => {
    if (state.node?.node) state.node.node.style.outline = "#2fc1ff dotted 3px";
    return id === state.node?._uid;
  };

  const handleTagAction = (tag, id, isTop, pos, iframeDocument) => {
    if (tag.copy)
      onCopy(
        {
          dataset: {
            pageId: tag.pageId,
            targetId: id,
            id: tag._uid,
            pos,
            addToAbove: isTop,
            copy: true,
          },
        },
        false
      );
    else if (tag.move)
      onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument);
    else onAdd(tag, id, isTop, pos, iframeDocument);
  };

  const adjustOverlayPosition = (iframeWindow) => {
    const scrollTop = iframeWindow.pageYOffset;
    const scrollLeft = iframeWindow.pageXOffset;

    overlayRef.current.style.top = 0 - scrollTop + "px";
    overlayRef.current.style.left = 0 - scrollLeft + "px";

    const top = scrollTop + 44 + "px";
    const left = scrollLeft + "px";

    overlayRef2.current.style.top = top;
    overlayRef2.current.style.left = left;
  };

  // Effect to handle events
  useEffect(() => {
    if (!container) return;
    const iframe = iframeRef.current;
    const iframeDocument = container.document;
    const iframeWindow = container.window;

    let isTop = false;

    adjustOverlayPosition(iframeWindow);

    // Function to handle drag over event
    const onDragOverHandle = (event) => {
      event.preventDefault();
      try {
        if (event.ctrlKey) {
          const elements = Array.from(
            iframeDocument.elementsFromPoint(event.clientX, event.clientY)
          );
          createContextMenu(elements, {
            x: event.clientX + 10,
            y: event.clientY + 10,
          });
        }

        let currentElement = event.target;

        if (!currentElement.dataset.id)
          currentElement = currentElement.parentNode;

        const id = currentElement.dataset.id || currentElement.dataset.rootid;

        if (currentElement === iframeDocument.body || !id) {
          return;
        }

        const name = currentElement.dataset.name || currentElement.tagName;
        const rect = currentElement.getBoundingClientRect();

        const hoverMiddleY = 10;

        const hoverClientY = event.clientY - rect.top;

        if (hoverClientY < hoverMiddleY) {
          setGapBarPos({
            value: name,
            left: rect.left,
            width: rect.width,
            top: rect.top - 5,
            height: 5,
            background: colorPrimaryBg,
            borderBottom: `2px solid ${colorPrimary}`,
            display: "initial",
          });

          isTop = true;
        } else {
          setGapBarPos({
            value: name,
            border: `2px solid ${colorPrimary}`,
            display: "initial",
            left: rect.left - 2,
            width: rect.width,
            top: rect.top - 2,
            height: rect.height,
          });
          isTop = false;
        }
      } catch (e) {
        setGapBarPos(null);
      }
    };

    // Function to handle drag leave event
    const onDragLeaveHandle = (event) => {
      event.preventDefault();
      try {
        if (editing) return;
        if (event.target === iframeDocument.body) return;
        isTop = false;
      } catch (e) {
      } finally {
        setGapBarPos(null);
      }
    };

    // Function to handle drop event
    const onDropHandle = (event) => {
      event.preventDefault();
      try {
        if (editing) {
          message.warning("please escape to save!");
          return;
        }
        let currentElement = getValidElement(event.target);
        if (!currentElement) return;

        if (!currentElement.dataset.id && !currentElement.dataset.rootid)
          currentElement = currentElement.closest("[data-id]");

        const id = currentElement.dataset.id || currentElement.dataset.rootid;
        if (currentElement === iframeDocument.body || !id) {
          throw new Error("id not found");
        }

        const pos = currentElement.dataset.pos || "";
        const tag = JSON.parse(event.dataTransfer.getData("text/plain"));
        handleTagAction(tag, id, isTop, pos, iframeDocument);
      } catch (e) {
        message.error(e?.message, "Something Wrong");
      } finally {
        setGapBarPos(null);
      }
    };

    // Function to handle click event
    const onClickHandle = async (event) => {
      try {
        adjustOverlayPosition(iframeWindow);
        const currentElement = getValidElement(event.target);

        if (!currentElement) return;
        const id = currentElement.dataset.id || currentElement.dataset.rootid;
        if (isSameElement(id) || !id) {
          return;
        }
        if (editing) {
          message.warning("please escape to save!");
          return;
        }
        onClickElement(iframeDocument, id);
        ContentEditor.destroy();
      } catch (e) {
        setGapBarPos(null);
      }
    };

    // Function to handle double click event
    const onDbClickHandle = (event) => {
      try {
        if (editing) return;
        const currentElement = getValidElement(event.target);
        if (!currentElement) return;
        const id = currentElement.dataset.id || currentElement.dataset.rootid;

        if (!id) return;
        const existingChildren = currentElement.querySelector(
          `[data-child="child-${id}"]`
        );

        if (existingChildren) {
          existingChildren.focus();
          ContentEditor.start(existingChildren, overlayRef2.current, "editor");
          setEditing(true);
        }
      } catch (e) {
        setGapBarPos(null);
      }
    };

    // Function to handle key press event
    const onKeyPress = async (event) => {
      if (!editing || event.keyCode !== 27) return;
      try {
        ContentEditor.destroy();
        state.node.updateHTML = true;
        await onUpdate(state.node);
        onChange();
      } catch (e) {
      } finally {
        setGapBarPos(null);
        setEditing(false);
      }
    };

    // Function to handle scroll event
    const onScrollHandle = (event) => {
      event.preventDefault();
      adjustOverlayPosition(iframeWindow);
    };

    // Function to handle context menu event
    const onContextMenu = (event) => {
      event.preventDefault();
      if (editing) {
        message.warning("please escape to save!");
        return;
      }
      const elements = Array.from(
        iframeDocument.elementsFromPoint(event.clientX, event.clientY)
      );
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
        visible: false,
      };
      createContextMenu(elements, mousePosition);
    };

    iframeDocument.body.addEventListener("dragover", onDragOverHandle);
    iframeDocument.body.addEventListener("dragleave", onDragLeaveHandle);
    iframeDocument.body.addEventListener("drop", onDropHandle);
    iframeDocument.body.addEventListener("click", onClickHandle);
    iframeDocument.body.addEventListener("dblclick", onDbClickHandle);
    iframeDocument.body.addEventListener("keydown", onKeyPress);
    iframeDocument.addEventListener("contextmenu", onContextMenu);
    iframeRef.current.contentWindow.addEventListener("scroll", onScrollHandle);

    return () => {
      if (!iframeRef.current) return;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) return;

      iframeRef.current.contentWindow.removeEventListener(
        "scroll",
        onScrollHandle
      );
      iframeDocument.body.removeEventListener("dragover", onDragOverHandle);
      iframeDocument.body.removeEventListener("drop", onDropHandle);
      iframeDocument.body.removeEventListener("dragleave", onDragLeaveHandle);
      iframeDocument.body.removeEventListener("click", onClickHandle);
      iframeDocument.body.removeEventListener("dblclick", onDbClickHandle);
      iframeDocument.body.removeEventListener("keydown", onKeyPress);
      iframeDocument.removeEventListener("contextmenu", onContextMenu);
      setGapBarPos(null);
    };
  }, [state.page, state.node, editing, container]);

  // Reset editing state when page is updated
  useEffect(() => {
    setEditing(false);
  }, [state.pageUpdated]);

  // Initialize ContentEditor when container is updated
  useEffect(() => {
    if (!container) return;

    ContentEditor.init(container.mountTarget);

    return () => {
      ContentEditor.destroy(null);
    };
  }, [container]);

  // Function to handle mouse leave event on context menu
  const handleContextMenuMouseLeave = () => {
    if (!isPopupOpen) {
      setContextMenuVisible(false);
      setGapBarPos(null);
    }
  };

  // Function to handle mouse enter event on menu item
  const handleMenuItemMouseEnter = (uid, isTop) => {
    if (!container?.document) return;

    const iframeDocument = container.document;
    const element = iframeDocument.querySelector(`[data-id="${uid}"]`);

    if (!element) return;

    const name = element.dataset?.name || element.tagName;
    const rect = element.getBoundingClientRect();

    if (isTop)
      setGapBarPos({
        value: name,
        left: rect.left,
        width: rect.width,
        top: rect.top - 5,
        height: 5,
        background: colorPrimaryBg,
        borderBottom: `2px solid ${colorPrimary}`,
        display: "initial",
      });
    else
      setGapBarPos({
        value: name,
        border: `2px solid ${colorPrimary}`,
        display: "initial",
        left: rect.left - 2,
        width: rect.width,
        top: rect.top - 2,
        height: rect.height,
      });
  };

  // Function to handle mouse leave event on menu item
  const handleMenuItemMouseLeave = () => {};

  // Function to handle drag over event on menu item
  const handleMenuItemDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Function to handle drop event on menu item
  const handleMenuItemDrop = useCallback(
    (event, isTop) => {
      event.preventDefault();

      if (!container?.document) return;

      const iframeDocument = container.document;
      const currentElement = event.target;
      const id =
        currentElement.dataset?.uid || currentElement.parentNode.dataset?.uid;
      const pos =
        currentElement.dataset?.pos || currentElement.parentNode.dataset?.pos;

      if (!id) return;

      try {
        const tag = JSON.parse(event.dataTransfer.getData("text/plain"));
        tag.move
          ? onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument)
          : onAdd(tag, id, isTop, pos, iframeDocument);
      } catch (e) {
        console.error(e);
      }

      currentElement.style.backgroundColor = "transparent";
    },
    [container, onMove, onAdd]
  );

  // Function to handle addition of element
  const onAddElement = useCallback(
    async (tag, addToAbove, currentElement, elements = []) => {
      if (!currentElement) return;

      const id = currentElement.dataset.id;
      const pos = currentElement.dataset.pos;

      await onAdd(tag, id, addToAbove, pos, null, elements);
    },
    [onAdd]
  );

  // Function to handle content change
  useEffect(() => {
    setEditing(false);
  }, [state.pageUpdated]);

  // Function to render the overlay
  const renderOverlay = () => {
    return (
      <div
        ref={overlayRef}
        style={{
          width: "100%",
          height: "0",
          top: "0px",
          left: "0px",
          position: "absolute",
        }}
      >
        <div
          ref={overlayRef2}
          style={{
            width: "100%",
            height: "0",
            top: "0px",
            left: "0px",
            position: "absolute",
          }}
        >
          {!editing && !previewMode && gapBarPos && (
            <div
              style={{
                display: "none",
                ...gapBarPos,
                position: "absolute",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                zIndex: 1000,
                alignItems: "end",
              }}
            >
              <Button
                type="dashed"
                icon=<PlusOutlined
                  style={{
                    color: "white",
                    padding: 5,
                    background: colorPrimaryBg,
                  }}
                />
              >
                {gapBarPos.value}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to render the iframe
  const renderIframe = () => {
    return (
      <iframe
        frameBorder={0}
        id="ac-editor-iframe-doc"
        width="100%"
        height="95%"
        ref={iframeRef}
      >
        {container?.mountTarget &&
          ReactDOM.createPortal(
            <InnerComponent
              _id={_id}
              type={pageType}
              onLoad={onLoad}
              document={container.document}
            >
              {loading ? (
                <p>Loading...</p>
              ) : previewMode ? (
                children
              ) : state.page ? (
                renderRoot()
              ) : (
                <p>Loading...</p>
              )}
            </InnerComponent>,
            container.mountTarget
          )}
      </iframe>
    );
  };

  // Function to render the root
  const renderRoot = () => {
    return (
      <div
        data-rootId="0"
        style={{ "-webkit-user-drag": "none" }}
        data-pos=""
        data-name="Root"
        draggable="false"
      >
        {children}
        <div
          style={{
            userSelect: "none",
            color: "#cccccc",
            fontSize: 48,
            padding: 0,
            textAlign: "center",
          }}
          data-name="Root"
          data-rootId="0"
          data-pos=""
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          +
        </div>
      </div>
    );
  };

  // Function to handle mouse enter event
  const handleMouseEnter = (e) => {
    e.preventDefault();
    e.target.style.color = colorPrimary;
  };

  // Function to handle mouse leave event
  const handleMouseLeave = (e) => {
    e.preventDefault();
    e.target.style.color = "#cccccc";
  };

  // Function to handle click event
  const handleClick = () => {
    if (!editing)
      setCurrentElement({
        dataset: { id: "0", pos: "" },
        layout: "div",
      });
  };

  // Define the MenuItemActions component
  const MenuItemActions = ({
    item,
    setPopupOpen,
    onDelete,
    setContextMenuVisible,
    setGapBarPos,
    onCopy,
    setCurrentElement,
  }) => {
    // Function to handle drag start event
    const handleDragStart = (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          _uid: item.uid,
          name: item.name,
          dragPos: item.pos,
          move: true,
        })
      );
    };

    // Function to handle delete confirmation
    const handleDeleteConfirm = () => {
      onDelete({ dataset: { id: item.uid, pos: item.pos } });
      setContextMenuVisible(false);
      setGapBarPos(null);
    };

    // Function to handle copy confirmation
    const handleCopyConfirm = () => {
      onCopy(
        { dataset: { targetId: item.uid, id: item.uid, pos: item.pos } },
        false
      );
    };

    // Function to handle copy cancellation
    const handleCopyCancel = () => {
      onCopy(
        { dataset: { targetId: item.uid, id: item.uid, pos: item.pos } },
        true
      );
    };

    // Function to handle add item click
    const handleAddItemClick = () => {
      setCurrentElement({
        dataset: { id: item.uid, pos: item.pos },
        layout: item.layout,
      });
    };

    return (
      <>
        {/* Button for dragging the item */}
        <Button
          draggable={true}
          onDragStart={handleDragStart}
          style={{ float: "right", marginLeft: 3 }}
          size="small"
          icon=<BsArrowsMove size="1rem" />
          disabled={!item.name} // Disable button if no input change
        />

        {/* Popconfirm for deleting the item */}
        <Popconfirm
          onOpenChange={setPopupOpen}
          placement="topRight"
          title={"Are you sure to delete this element?"}
          onConfirm={handleDeleteConfirm}
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            type="text"
            style={{ float: "right", marginLeft: 3 }}
            size="small"
            icon=<DeleteOutlined size="1rem" />
          />
        </Popconfirm>

        {/* Popconfirm for copying the item */}
        <Popconfirm
          onOpenChange={setPopupOpen}
          placement="topRight"
          title={"Please select?"}
          onConfirm={handleCopyConfirm}
          onCancel={handleCopyCancel}
          okText="Copy Selector"
          cancelText="Create Selector"
        >
          <Button
            style={{ float: "right", marginLeft: 3 }}
            size="small"
            icon=<CopyOutlined size="1rem" />
            disabled={!item.name} // Disable button if no input change
          />
        </Popconfirm>

        {/* Button for adding a new item */}
        <Button
          type="dashed"
          onClick={handleAddItemClick}
          style={{ float: "right" }}
          size="small"
          icon=<PlusOutlined size="1rem" />
          disabled={!item.name} // Disable button if no input change
        />
      </>
    );
  };

  // Function to render the context menu
  const renderContextMenu = () => {
    // If the context menu is not visible, return null
    if (!contextMenuVisible) return null;

    // Function to handle drag enter event on menu item
    const handleDragEnter = (e, item, isTop) => {
      e.target.style.backgroundColor = colorPrimaryBg;
      handleMenuItemMouseEnter(item.uid, isTop);
      e.preventDefault();
    };

    // Function to handle drag leave event on menu item
    const handleDragLeave = (e) => {
      e.target.style.backgroundColor = "transparent";
      handleMenuItemMouseLeave();
      e.preventDefault();
    };

    // Function to handle mouse enter event on menu item
    const handleMouseEnter = (e, item, isTop) => {
      e.preventDefault();
      if (state?.node?._uid !== item.uid)
        e.target.style.backgroundColor = colorPrimaryBg;
      handleMenuItemMouseEnter(item.uid, isTop);
    };

    // Function to handle mouse leave event on menu item
    const handleMouseLeave = (e, item) => {
      e.preventDefault();
      if (state?.node?._uid !== item.uid)
        e.target.style.backgroundColor = "transparent";
      handleMenuItemMouseLeave(item.uid);
    };

    // Function to render menu item actions
    const renderMenuItemActions = (item) => {
      // Check if the item uid is not '0'
      if (item.uid !== "0") {
        return (
          <MenuItemActions
            item={item}
            handleMenuItemMouseEnter={handleMenuItemMouseEnter}
            handleMenuItemMouseLeave={handleMenuItemMouseLeave}
            setPopupOpen={setPopupOpen}
            onDelete={onDelete}
            setContextMenuVisible={setContextMenuVisible}
            setGapBarPos={setGapBarPos}
            onCopy={onCopy}
            setCurrentElement={setCurrentElement}
          />
        );
      }
      return null;
    };

    return (
      <Card
        ref={tooltipRef}
        style={{
          zIndex: 1,
          maxHeight: 500,
          overflow: "auto",
          position: "absolute",
          visibility: contextMenuPosition.visible ? "visible" : "hidden",
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
          zIndex: 1000,
        }}
        title={
          <>
            Elements{" "}
            <Button
              size="small"
              style={{ marginLeft: 10, float: "right" }}
              onDragLeave={handleContextMenuMouseLeave}
              onClick={() => {
                setContextMenuVisible(false);
                setGapBarPos(null);
              }}
              icon=<CloseOutlined size="1rem" />
            ></Button>
          </>
        }
        bordered={false}
        onMouseLeave={handleContextMenuMouseLeave}
      >
        <ul
          style={{
            listStyle: "none",
            paddingInlineStart: 0,
            color: colorText,
          }}
        >
          {contextMenuElements.map((item, index) => (
            <span key={item.uid + index}>
              <li
                onDragOver={handleMenuItemDragOver}
                onDragEnter={(e) => handleDragEnter(e, item, true)}
                onDragLeave={handleDragLeave}
                style={{
                  borderRadius: "5px",
                  height: 10,
                }}
                onDrop={(e) => handleMenuItemDrop(e, true, true)}
                data-uid={item.uid}
                data-pos={item.pos}
              ></li>
              <li>
                <div
                  onDrop={handleMenuItemDrop}
                  onDragOver={handleMenuItemDragOver}
                  onDragEnter={(e) => handleDragEnter(e, item)}
                  onDragLeave={handleDragLeave}
                  key={item.uid}
                  onClick={() => handleMenuItemClick(item.uid)}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={(e) => handleMouseLeave(e, item)}
                  data-uid={item.uid}
                  data-pos={item.pos}
                  style={{
                    color: colorText,
                    display: "inline-block",
                    cursor: "pointer",
                    borderRadius: "10px",
                    padding: "0 5px",
                    marginRight: 5,
                    backgroundColor:
                      state?.node?._uid === item.uid
                        ? colorPrimaryBg
                        : "transparent",
                  }}
                >
                  {item.name}{" "}
                </div>
                {state?.node?._uid === item.uid && (
                  <Popover
                    onOpenChange={(open) => {
                      setPopupOpen(open);
                    }}
                    content={
                      <Setting
                        onChange={onChange}
                        setPopupOpen={setPopupOpen}
                        node={state.node}
                        onUpdate={onUpdate}
                      />
                    }
                    title="Setting"
                    trigger="click"
                  >
                    <EditOutlined />
                  </Popover>
                )}
                {renderMenuItemActions(item)}
              </li>
            </span>
          ))}
        </ul>
      </Card>
    );
  };

  return (
    <>
      {!previewMode && renderOverlay()}
      {!previewMode && renderContextMenu()}
      <ShadowRootComponent>{renderIframe()}</ShadowRootComponent>
      {!previewMode && (
        <AddElement
          onAddElement={onAddElement}
          currentElement={currentElement}
          setCurrentElement={setCurrentElement}
        />
      )}
    </>
  );
}
