

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { Button, Card, Popconfirm, Popover, Menu, Tree, message, theme } from 'antd';

import ThemeServices from '../../../..//lib/services/theme';

import SettingServices from '../../../../lib/services/setting';
import { CloseOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';


import ContentEditor from '../Element/ContentEditor';
import { MdElectricalServices } from 'react-icons/md';
import AddElement from '../Element/AddElemet';
import Setting from '../Element/Setting';
import { BsArrowsMove } from 'react-icons/bs';

const InnerComponent = ({ children, document, onLoad, _id, type }) => {


  useEffect(() => {


    if (_id)
      loadCSSStyles().then((status) => {
        onLoad({ _id }, type, document);
      }).catch((e) => {
        message.error(e?.message || 'Something went wrong!');

      });
    else
      onLoad(null, '', document);




  }, []);

  const loadCSSStyles = async () => {
    return new Promise(async (resolve, reject) => {

      try {

        let res = await SettingServices.get();
        if (res?.setting)
          document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);



        res = await ThemeServices.getFonts();

        if (res.fonts)
          res.fonts.data.forEach(async (font) => {
            const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;

            if (isGoogleFont && src) {
              const linkElement = document.createElement('div');
              linkElement.id = 'google-font-' + _uid;
              linkElement.innerHTML = src;
              document.head.appendChild(linkElement);
            }
            else
              if (Array.isArray(fontSrc)) {
                try {

                  const styleElement = document.createElement('style');
                  styleElement.textContent = '';

                  for (const src of fontSrc) {
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
          });

        const root = document.documentElement;

        if (res.fonts)
          for await (let font of res.fonts.data) {
            root.style.setProperty(font.variable, font.fontFamily);
          }
        res = await ThemeServices.getColors()

        if (res.colors)
          for await (let color of res.colors.data) {
            root.style.setProperty(color.variable, color.color);
          }

        res = await ThemeServices.getVariables()

        if (res.variables)
          for await (let variable of res.variables.data) {
            root.style.setProperty(variable.variable, variable.value);
          }



        let style = document.createElement('style');


        style.textContent = `
        
       
        .cke_editable.ae-editable, .cke_editable.ae-editable *{
          background: #fff !important;
        }

       

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
        
        `

        document.head.appendChild(style);

        res = await ThemeServices.getCss();

        if (res.css) {
          style = document.createElement('style');
          style.textContent = res.css;
          document.head.appendChild(style);
        }




        resolve(true);

      } catch (e) {
        reject(e?.message);
      }
    })
  }

  return children;

};


const ShadowRootComponent = ({ children }) => {
  const rootRef = useRef();

  return children;
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
  onCopy, onMove }) {

  const iframeRef = useRef();
  const overlayRef = useRef();
  const overlayRef2 = useRef();
  const tooltipRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, colorText },
  } = theme.useToken();




  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuElements, setContextMenuElements] = useState([]);

  const [currentElement, setCurrentElement] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editing, setEditing] = useState(false);


  function createContextMenu(elements, mousePosition) {



    const elementsWithUid = elements.filter(element => element.dataset.id).map(element => ({
      uid: element.dataset.id,
      name: element.dataset.name || element.tagName,
      layout: element.dataset.name || element.tagName,
      pos: element.dataset.pos
    }));


    setContextMenuVisible(true);
    setContextMenuPosition({
      x: mousePosition.x,
      y: mousePosition.y,
    });
    setContextMenuElements(elementsWithUid);
  }

  useEffect(() => {

    if (!tooltipRef?.current || !contextMenuVisible || contextMenuPosition?.visible)
      return;

    if (!container?.window)
      return;



    const toolTypeStyle = window.getComputedStyle(tooltipRef?.current)

    const tooltipWidth = parseInt(toolTypeStyle.width, 10); // Width of the tooltip
    const tooltipHeight = parseInt(toolTypeStyle.height, 10); // Height of the tooltip

    if (contextMenuPosition.x + tooltipWidth > container.window.innerWidth) {
      contextMenuPosition.x -= tooltipWidth;
    }

    const adjustedX = contextMenuPosition.x;

    if (contextMenuPosition.y + tooltipHeight > container.window.innerHeight) {
      contextMenuPosition.y -= tooltipHeight;
    }
    const adjustedY = contextMenuPosition.y;

    setContextMenuPosition({
      x: adjustedX,
      y: adjustedY,
      visible: true
    });
  }, [contextMenuVisible, contextMenuPosition])


  const [container, setConainer] = useState(null);
  const [gapBarPos, setGapBprPos] = useState(null);

  const handleMenuItemClick = (key) => {

    const oldNode = state.node;
    if (oldNode?._uid === key || !key) {
      return;
    }

    onClickElement(container?.document, key);
    ContentEditor.destroy();
  };



  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const iframeWindow = iframe.contentWindow;

    setConainer({ window: iframeWindow, mountTarget: iframeDocument.body, document: iframeDocument });
  }, [iframeRef.current])

  useEffect(() => {


    if (!iframeRef.current)
      return;



    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    let isTop = false;


    const onDragOverHandle = (event) => {

      event.preventDefault();
      // event.stopPropagation();

      try {
        if (event.ctrlKey) {
          const elements = Array.from(iframeDocument.elementsFromPoint(event.clientX, event.clientY));
          createContextMenu(elements, { x: event.clientX + 10, y: event.clientY + 10 });
        }

        let currentElement = event.target;

        if (!currentElement.dataset.id)
          currentElement = currentElement.parentNode;

        const id = currentElement.dataset.id || currentElement.dataset.rootid;

        if (currentElement === iframeDocument.body || !id) {
          return;
        }
        //const pos = currentElement.dataset.pos;
        const name = currentElement.dataset.name || currentElement.tagName;

        const rect = currentElement.getBoundingClientRect();

        const hoverMiddleY = 10;

        const hoverClientY = event.clientY - rect.top;

        if (hoverClientY < hoverMiddleY) {

          setGapBprPos({
            value: name,
            left: rect.left,
            width: rect.width,
            top: rect.top - 5, height: 5,
            background: colorPrimaryBg,
            borderBottom: `2px solid ${colorPrimary}`,
            display: 'initial'
          });

          isTop = true;

        }
        else {
          setGapBprPos({
            value: name,

            border: `2px solid ${colorPrimary}`, display: 'initial',
            left: rect.left - 2, width: rect.width, top: rect.top - 2, height: rect.height
          });
          isTop = false;


        }
      } catch (e) {
        setGapBprPos(null)

      }

    }

    iframeDocument.body.addEventListener("dragover", onDragOverHandle);

    const onDragLeaveHandle = (event) => {
      event.preventDefault();

      try {
        if (editing) {
          return;
        }

        var currentElement = event.target;

        if (currentElement === iframeDocument.body) {
          return;
        }
        isTop = false;

        setGapBprPos(null);

      } catch (e) {
        setGapBprPos(null)

      }

    }

    iframeDocument.body.addEventListener("dragleave", onDragLeaveHandle);

    const onDropHandle = (event) => {
      event.preventDefault();

      try {
        if (editing) {
          message.warning("please escape to save!")
          return;
        }


        var currentElement = event.target;

        if (currentElement === iframeDocument.body) {
          return;
        }



        if (!currentElement.dataset.id && !currentElement.dataset.rootid)
          currentElement = currentElement.closest('[data-id]');

        if (!currentElement)
          return;

        const id = currentElement.dataset?.id || currentElement.dataset?.rootid;
        const pos = currentElement.dataset.pos || '';

        if (!id) {
          return;
        }

        const tag = JSON.parse(event.dataTransfer.getData('text/plain'));


        if (tag.copy)
          onCopy({
            dataset: {
              pageId: tag.pageId,
              targetId: id,
              id: tag._uid,
              pos,
              addToAbove: isTop,
              copy: true
            }
          }, false);
        else
          if (tag.move)
            onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument);
          else
            onAdd(tag, id, isTop, pos, iframeDocument);

        setGapBprPos(null);

        isTop = false;
      } catch (e) {
        console.log(e?.message, "Something Wrong")
        setGapBprPos(null)
      }
    }


    iframeDocument.body.addEventListener("drop", onDropHandle);



    const onClickHandle = async (event) => {




      try {


        const scrollTop = iframeRef.current.contentWindow.pageYOffset;
        const scrollLeft = iframeRef.current.contentWindow.pageXOffset;
        const top = (scrollTop + 44) + 'px';
        const left = (scrollLeft) + 'px';

        overlayRef2.current.style.top = top;
        overlayRef2.current.style.left = left;


        let currentElement = event.target;

        if (currentElement.tagName.toLowerCase() === 'a' ||
          currentElement.parentNode.tagName.toLowerCase() === 'a') {
          // Prevent the default behavior for anchor links
          event.preventDefault();
        }

        if (!currentElement.dataset.id && !currentElement.dataset.rootid)
          currentElement = currentElement.closest('[data-id]');

        if (!currentElement)
          return;


        const id = currentElement.dataset.id || currentElement.dataset.rootid;

        const oldNode = state.node;
        if (oldNode?._uid === id || !id) {
          return;
        }

        if (editing) {
          message.warning("please escape to save!")
          return;
        }


        onClickElement(iframeDocument, id);
        ContentEditor.destroy();
      } catch (e) {
        setGapBprPos(null)


      }

    }

    const onDbClickHandle = (event) => {

      try {
        if (editing) {
          return;
        }
        // event.preventDefault();

        let currentElement = event.target;

        if (!currentElement.dataset.id && !currentElement.dataset.rootid)
          currentElement = currentElement.closest('[data-id]');

        if (!currentElement)
          return;


        const id = currentElement.dataset.id || currentElement.dataset.rootid;

        const oldNode = state.node;
        if (oldNode?._uid !== id || !id) {
          return;
        }


        let existingChildren = currentElement.querySelector(`[data-child="child-${id}"]`);


        ContentEditor.destroy();

        if (existingChildren) {
          existingChildren.focus();

          ContentEditor.start(existingChildren, overlayRef2.current, 'editor');
          setEditing(true)

        }
      } catch (e) {
        setGapBprPos(null)

      }


    }

    const onKeyPress = async (event) => {


      if (!editing)
        return;
      if (event.keyCode === 27) {

        try {
          ContentEditor.destroy();
          state.node.updateHTML = true;
          await onUpdate(state.node);
          onChange();

        } catch (e) {

        } finally {
          setGapBprPos(null)

          setEditing(false)
        }
      }

    }

    iframeDocument.body.addEventListener('click', onClickHandle);
    iframeDocument.body.addEventListener('dblclick', onDbClickHandle);
    iframeDocument.body.addEventListener('keydown', onKeyPress);


    const onScrollHandle = (event) => {

      event.preventDefault();
      const scrollTop = iframeRef.current.contentWindow.pageYOffset;
      const scrollLeft = iframeRef.current.contentWindow.pageXOffset;

      overlayRef.current.style.top = (0 - scrollTop) + 'px';
      overlayRef.current.style.left = (0 - scrollLeft) + 'px';

      const top = (scrollTop + 44) + 'px';
      const left = (scrollLeft) + 'px';

      overlayRef2.current.style.top = top;
      overlayRef2.current.style.left = left;


    }
    iframeRef.current.contentWindow.addEventListener("scroll", onScrollHandle);



    const scrollTop = iframeRef.current.contentWindow.pageYOffset;
    const scrollLeft = iframeRef.current.contentWindow.pageXOffset;
    overlayRef2.current.style.top = (scrollTop + 44) + 'px';
    overlayRef2.current.style.left = (scrollLeft) + 'px';



    const mutationHandler = (mutationsList) => {

      if (editing)
        return;

      let isCanvas = false;

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.classList?.contains('html2canvas-container')) {
              isCanvas = true;
              break;
            }
          }

          for (const removedNode of mutation.removedNodes) {
            if (removedNode.classList?.contains('html2canvas-container')) {
              isCanvas = true;
              break;
            }
          }
        }
      }

      if (mutationsList.length > 0 && !isCanvas)
        onClickElement(iframeDocument, null, true);
    };

    //  const observer = new MutationObserver(mutationHandler);
    //observer.observe(iframeDocument.body, { childList: true, subtree: true });

    const onContextMenu = (event) => {
      event.preventDefault();

      if (editing) {
        message.warning("please escape to save!")
        return;
      }

      const elements = Array.from(iframeDocument.elementsFromPoint(event.clientX, event.clientY));
      const mousePosition = { x: event.clientX, y: event.clientY, visible: false };


      createContextMenu(elements, mousePosition);
    }


    iframeDocument.addEventListener('contextmenu', onContextMenu);



    return () => {

      if (!iframeRef.current) return;
      // observer.disconnect();
      iframeRef.current.contentWindow.removeEventListener('scroll', onScrollHandle);
      iframeDocument.body.removeEventListener("dragover", onDragOverHandle);
      iframeDocument.body.removeEventListener("drop", onDropHandle);
      iframeDocument.body.removeEventListener("dragleave", onDragLeaveHandle);
      iframeDocument.body.removeEventListener('click', onClickHandle);
      iframeDocument.body.removeEventListener('dblclick', onDbClickHandle);
      iframeDocument.body.removeEventListener('keydown', onKeyPress);

      iframeDocument.removeEventListener('contextmenu', onContextMenu);

      setGapBprPos(null)
    }

  }, [state.page, state.node, editing]);

  useEffect(() => {
    setEditing(false)


  }, [state.pageUpdated])

  useEffect(() => {

    if (!container)
      return;

    ContentEditor.init(container.mountTarget);

    return () => {
      ContentEditor.destroy(null);
    }
  }, [container]);



  const handleContextMenuMouseLeave = () => {
    if (!isPopupOpen) {
      setContextMenuVisible(false);
      setGapBprPos(null);
    }
  }

  const handleMenuItemMouseEnter = (uid, isTop) => {

    if (!container?.document)
      return;

    const iframeDocument = container.document;

    const element = iframeDocument.querySelector(`[data-id="${uid}"]`);

    if (!element)
      return;

    const name = element.dataset?.name || element.tagName;

    const rect = element.getBoundingClientRect();


    if (isTop)
      setGapBprPos({
        value: name,
        left: rect.left,
        width: rect.width,
        top: rect.top - 5, height: 5,
        background: colorPrimaryBg,
        borderBottom: `2px solid ${colorPrimary}`,
        display: 'initial'
      });
    else
      setGapBprPos({
        value: name,
        border: `2px solid ${colorPrimary}`, display: 'initial',
        left: rect.left - 2, width: rect.width, top: rect.top - 2, height: rect.height
      });
  };

  const handleMenuItemMouseLeave = () => {

  };

  const handleMenuItemDragOver = (e) => {
    e.preventDefault();

  };




  const handleMenuItemDrop = (event, isTop) => {

    event.preventDefault();

    if (!container?.document)
      return;

    const iframeDocument = container.document;

    var currentElement = event.target;

    if (currentElement === iframeDocument.body) {
      return;
    }

    const id = currentElement.dataset?.uid || currentElement.parentNode.dataset?.uid;

    const pos = currentElement.dataset?.pos || currentElement.parentNode.dataset?.pos;

    if (!id)
      return;

    try {
      const tag = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (tag.move)
        onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument);
      else
        onAdd(tag, id, isTop, pos, iframeDocument);
    } catch (e) {

    }

    currentElement.style.backgroundColor = 'transparent';


  };


  const onAddElement = async (tag, addToAbove, currentElement) => {


    if (!currentElement)
      return;


    const id = currentElement.dataset.id;
    const pos = currentElement.dataset.pos;

    await onAdd(tag, id, addToAbove, pos, null);
  }

  const handleOnChangeContent = (status) => {

    setEditing(true)
    onChange();

  };


  return <ShadowRootComponent>

    <div ref={overlayRef} style={{ width: '100%', height: '0', top: '0px', left: '0px', position: 'absolute' }}>

      <div ref={overlayRef2} style={{ width: '100%', height: '0', top: '0px', left: '0px', position: 'absolute' }}>
        {!editing && !previewMode && <>
          {gapBarPos && <div style={{
            display: 'none', ...gapBarPos, position: 'absolute', pointerEvents: 'none', display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
            alignItems: 'end'
          }}>

            <Button type="dashed" icon=<PlusOutlined style={{ color: "white", padding: 5, background: colorPrimaryBg }} />>
              {gapBarPos.value}</Button>
          </div>}
          {contextMenuVisible && (

            <Card
              ref={tooltipRef}
              style={{
                zIndex: 1, maxHeight: 500, overflow: 'auto', position: 'absolute',
                visibility: contextMenuPosition.visible ? 'visible' : 'hidden',
                top: contextMenuPosition.y,
                left: contextMenuPosition.x,
                zIndex: 1000
              }}
              title={<>Elements {" "}<Button
                size='small'
                style={{ marginLeft: 10, float: 'right' }}
                onDragLeave={handleContextMenuMouseLeave}
                onClick={() => {
                  setContextMenuVisible(false);
                  setGapBprPos(null);
                }}
                icon=<CloseOutlined size="1rem" />></Button></>}
              bordered={false}
              onMouseLeave={handleContextMenuMouseLeave}

            >

              <ul style={{
                listStyle: 'none', paddingInlineStart: 0,
                color: colorText
              }}>




                {contextMenuElements.map((item, index) => (<>
                  <li

                    key={item.uid + index}
                    onDragOver={handleMenuItemDragOver}

                    onDragEnter={(e) => {
                      e.target.style.backgroundColor = colorPrimaryBg;
                      handleMenuItemMouseEnter(item.uid, true)
                      e.preventDefault();

                    }}
                    onDragLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      handleMenuItemMouseLeave()

                      e.preventDefault();

                    }}
                    style={{
                      borderRadius: '5px',
                      height: 10,
                    }}
                    onDrop={(e) => handleMenuItemDrop(e, true)}
                    data-uid={item.uid}
                    data-pos={item.pos}
                  >

                  </li>
                  <li
                  >
                    <div
                      onDrop={handleMenuItemDrop}
                      onDragOver={handleMenuItemDragOver}
                      onDragEnter={(e) => {

                        if (state?.node?._uid !== item.uid)
                          e.target.style.backgroundColor = colorPrimaryBg;
                        handleMenuItemMouseEnter(item.uid, false)

                        e.preventDefault();

                      }}
                      onDragLeave={(e) => {
                        if (state?.node?._uid !== item.uid)
                          e.target.style.backgroundColor = 'transparent';
                        handleMenuItemMouseLeave()

                        e.preventDefault();

                      }}
                      key={item.uid}
                      onClick={() => handleMenuItemClick(item.uid)}
                      onMouseEnter={(e) => {
                        e.preventDefault();

                        if (state?.node?._uid !== item.uid)
                          e.target.style.backgroundColor = colorPrimaryBg;
                        handleMenuItemMouseEnter(item.uid)
                      }
                      }
                      onMouseLeave={(e) => {
                        e.preventDefault();

                        if (state?.node?._uid !== item.uid)
                          e.target.style.backgroundColor = 'transparent';
                        handleMenuItemMouseLeave(item.uid)
                      }

                      }

                      data-uid={item.uid}
                      data-pos={item.pos}
                      style={{
                        color: colorText,
                        display: "inline-block",
                        cursor: 'pointer',
                        borderRadius: '10px',
                        padding: '0 5px',
                        marginRight: 5,
                        backgroundColor: state?.node?._uid === item.uid ? colorPrimaryBg : 'transparent',
                      }}>
                      {item.name} {" "} {state?.node?._uid === item.uid && <Popover

                        onOpenChange={(open) => {
                          setPopupOpen(open);
                        }}

                        content={<Setting
                          onChange={onChange}
                          setPopupOpen={setPopupOpen}
                          node={state.node} onUpdate={onUpdate} />} title="Setting" trigger="click">
                        <EditOutlined />
                      </Popover>}
                    </div>
                    {(item.uid !== '0') && <>
                      <Button

                        onMouseEnter={(e) => {
                          e.preventDefault();
                          handleMenuItemMouseEnter(item.uid)
                        }
                        }
                        onMouseLeave={(e) => {
                          e.preventDefault();
                          handleMenuItemMouseLeave()
                        }

                        }
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify({
                            _uid: item.uid,
                            name: item.name,
                            dragPos: item.pos,
                            move: true
                          }));
                        }}


                        style={{ float: 'right', marginLeft: 3 }} size="small" icon=<BsArrowsMove size="1rem" /> />


                      <Popconfirm
                        onOpenChange={(open) => {
                          setPopupOpen(open);
                        }}

                        placement="topRight"
                        title={"Are you sure to delete this element?"}
                        onConfirm={() => {
                          onDelete({ dataset: { id: item.uid, pos: item.pos } })
                          setContextMenuVisible(false);
                          setGapBprPos(null);
                        }
                        }
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          danger
                          type='text'
                          style={{ float: 'right', marginLeft: 3 }} size="small" icon=<DeleteOutlined size="1rem" /> />
                      </Popconfirm>
                      {" "}
                      <Popconfirm
                        onOpenChange={(open) => {
                          setPopupOpen(open);
                        }}

                        placement="topRight"
                        title={"Please select?"}
                        onConfirm={() => {
                          onCopy({ dataset: { targetId: item.uid, id: item.uid, pos: item.pos } }, false);

                        }}
                        onCancel={() => {
                          onCopy({ dataset: { targetId: item.uid, id: item.uid, pos: item.pos } }, true);

                        }}
                        okText="Copy Selector"
                        cancelText="Create Selector"
                      >
                        <Button

                          onMouseEnter={(e) => {
                            e.preventDefault();
                            handleMenuItemMouseEnter(item.uid)
                          }
                          }
                          onMouseLeave={(e) => {
                            e.preventDefault();
                            handleMenuItemMouseLeave()
                          }

                          }


                          style={{ float: 'right', marginLeft: 3 }} size="small" icon=<CopyOutlined size="1rem" /> />

                      </Popconfirm>
                      {" "}
                      <Button

                        type='dashed'
                        onMouseEnter={(e) => {
                          e.preventDefault();
                          handleMenuItemMouseEnter(item.uid)
                        }
                        }
                        onMouseLeave={(e) => {
                          e.preventDefault();
                          handleMenuItemMouseLeave()
                        }

                        }

                        onClick={() => {
                          setCurrentElement({
                            dataset: { id: item.uid, pos: item.pos },
                            layout: item.layout
                          })
                        }}


                        style={{ float: 'right', }} size="small" icon=<PlusOutlined size="1rem" /> />

                    </>}

                  </li></>
                ))}

              </ul>

            </Card>
          )}
        </>}
      </div>

    </div>


    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>




      {container && ReactDOM.createPortal(<InnerComponent

        _id={_id} type={pageType}

        onLoad={onLoad}

        document={container.document}>
        {state.page ? !previewMode ? <div data-rootId="0"

          style={{ "-webkit-user-drag": 'none' }}

          data-pos="" data-name="Root" draggable="false">{children}
          <div style={{
            userSelect: 'none', color: "#cccccc", fontSize: 48,
            padding: 0, textAlign: 'center',
          }}
            data-name="Root"
            data-rootId="0" data-pos=""
            onMouseEnter={(e) => {
              e.preventDefault();
              e.target.style.color = colorPrimary;

            }}

            onMouseLeave={(e) => {
              e.preventDefault();
              e.target.style.color = "#cccccc";

            }}

            onClick={() => {
              if (!editing)
                setCurrentElement({
                  dataset: { id: "0", pos: "" },
                  layout: "div"
                })
            }}
          >  + </div>



        </div> : children : <p>Laoding...</p>}
      </InnerComponent>, container.mountTarget)}

    </iframe>


    <AddElement
      onAddElement={onAddElement}
      currentElement={currentElement}
      setCurrentElement={setCurrentElement} />

  </ShadowRootComponent>
}

