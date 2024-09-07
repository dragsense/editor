import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";
import addCSS from "./addCSS";
import { getData, updateData } from "../db";
import addComponent, { createMenuItem } from "./addComponent";

/**
 * Object containing the properties for different types of elements.
 * Each key represents a type of element and its value is an object of CSS properties for that element.
 */
const properties = {
  normal: {},

  main: {
    "background-color": {
      value: "#f2f2f2",
    },
    padding: {
      value: "10px",
    },
  },

  icon: {
    "font-size": {
      value: "27.6px",
    },
    display: {
      value: "inline-block",
    },
  },
  "svg-icon": {
    display: {
      value: "inline-block",
    },
    width: {
      value: "24px",
    },
  },

  img: {
    "max-width": {
      value: "100%",
    },
    height: {
      value: "auto",
    },
  },
};

// Function to add an element based on the layout type
const addElement = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
  try {
    // Switch case to handle different layout types
    switch (parentElement.layout) {
      case "slides":
        // Create a slide element
        return await createSlide(tag, parentElement, state, pos, document);
      case "tabs-btn":
      case "tabs-content":
      case "tabs":
        // Create a tab element
        return await createTab(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document
        );
      case "accordions":
      case "accordion":
        // Create an accordion element
        return await createAccordion(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document
        );
      case "gallery":
        // Create a gallery item element
        return await createGalleryItem(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document
        );
      case "modal":
        // Create a modal item element
        return await createModalItem(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document
        );

      case "menu-list":
        // Create a menu item element
        return await createMenuItem(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document
        );
      default:
        // Create a default element
        return await createElement(
          tag,
          parentElement,
          addToAbove,
          currentUid,
          pos,
          state,
          document,
          properties[tag.layout] || {}
        );
    }
  } catch (e) {
    // Error handling
    throw new Error(e?.message);
  }
};

const createInput = async (tag, state, document) => {
  // Generate unique IDs for the input, label, error message, and their wrappers
  const inputUniqueId = uuid();
  const labelUniqueId = uuid();
  const errorUniqueId = uuid();
  const inputWrapperUniqueId = uuid();
  const wrapperUniqueId = uuid();

  // Generate random IDs for the input and its wrappers
  const randomId = nanoid(4);
  const inputId = nanoid(4);

  // Define class names for the input and its wrappers
  const formGroupClassName = "ac-form-group-" + randomId;
  const inputContainerClassName = "ac-input-container-" + randomId;

  // Create the input element
  const inputElement = {
    _uid: inputUniqueId,
    tagName: tag.tag,
    name: `${tag.key}_input`,
    type: tag.type,
    layout: tag.layout,
    options: tag.options,
    attributes: {
      ...tag.attributes,
      id: { key: "id", value: `'${inputId}_${tag.key}'` },
    },
    state:
      tag.fieldType !== "file"
        ? {
            type: "FORMSTATES",
            key: [tag.key, "defaultValue"],
          }
        : undefined,
    onChange:
      tag.fieldType !== "file"
        ? {
            type: "FORMSTATES",
            key: [tag.key, "defaultValue"],
            value: "'[value]'",
          }
        : undefined,
    labelPos: tag.labelPos,
    nodeValue: tag.nodeValue,
    childNodes: [],
    className: "",
    selector: `.${inputContainerClassName} input`,
  };

  // Create the label element
  const labelElement = {
    _uid: labelUniqueId,
    tagName: "label",
    name: `${tag.key}_label`,
    type: "texts",
    layout: "form-label",
    nodeValue: tag.label,
    attributes: {
      htmlFor: { key: "htmlFor", value: `'${inputId}_${tag.key}'` },
    },
    childNodes: [],
    className: "",
    selector: `.${formGroupClassName} label`,
  };

  // Create the error message element
  const errorElement = {
    _uid: errorUniqueId,
    tagName: "span",
    name: `${tag.key}_error`,
    type: "texts",
    nodeValue: tag.errorMessage,
    state: {
      type: "FORMSTATES",
      key: [tag.key, "errorMessage"],
    },
    conditions: {
      "cond-0": {
        name: "input-error",
        key: [tag.key, "error"],
        type: "FORMSTATES",
        value: "[key] == 1",
        relation: "AND",
        valueState: undefined,
      },
    },
    childNodes: [],
    layout: "form-error-message",
    className: "ac-error-message",
    selector: `.${inputContainerClassName} .ac-error-message`,
  };

  // Create the input wrapper element
  const inputWrapperElement = {
    _uid: inputWrapperUniqueId,
    tagName: "div",
    name: "div",
    type: "layouts",
    nodeValue: "",
    layout: "form-input-container",
    fixedClass: true,
    childNodes: [inputUniqueId, errorUniqueId],
    className: inputContainerClassName,
    selector: `.${inputContainerClassName}`,
  };

  // Determine the order of the label and input based on the label position
  const childNodes =
    tag.labelPos === 0
      ? [labelUniqueId, inputWrapperUniqueId]
      : [inputWrapperUniqueId, labelUniqueId];

  // Create the form group wrapper element
  const wrapperElement = {
    _uid: wrapperUniqueId,
    tagName: "div",
    name: "div",
    type: "layouts",
    layout: "form-group",
    nodeValue: "",
    fixedClass: true,
    childNodes: childNodes,
    className: formGroupClassName,
    selector: `.${formGroupClassName}`,
  };

  // Define the CSS properties for the input, label, error message, and their wrappers
  const inputProperties = {
    padding: { value: "5px" },
    border: { value: "1px solid #ccc" },
    "margin-right": { value: "5px" },
    width: { value: "100%" },
  };
  const labelProperties = {
    display: { value: "inline-block" },
    "margin-right": { value: "5px" },
    color: { value: "#333" },
  };
  const errorProperties = {
    color: { value: "#ff0000" },
    "font-size": { value: "12px" },
  };
  const inputWrapperProperties = {
    display: { value: "flex" },
    "justify-content": { value: "center" },
    "flex-direction": { value: "column" },
  };
  const wrapperProperties = {
    "margin-right": { value: "10px" },
  };

  // Add the CSS to the elements and update the data
  await addCSS(document, inputProperties, inputElement, state.page._id);
  await updateData(state.page._id, inputElement);
  await addCSS(document, labelProperties, labelElement, state.page._id);
  await updateData(state.page._id, labelElement);
  await addCSS(document, errorProperties, errorElement, state.page._id);
  await updateData(state.page._id, errorElement);
  await addCSS(
    document,
    inputWrapperProperties,
    inputWrapperElement,
    state.page._id
  );
  await updateData(state.page._id, inputWrapperElement);
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  // Return the form group wrapper element
  return wrapperElement;
};

// Function to create a slide element
const createSlide = async (tag, parentElement, state, pos, document) => {
  // Generate a unique ID for the slide
  const slideUniqueId = uuid();

  const parentWrapper = await getData(state.page._id, parentElement.parent);

  // Define the slide element
  const slideElement = {
    _uid: slideUniqueId,
    tagName: "div",
    name: "slide",
    type: "layouts",
    layout: "slide-item",
    nodeValue: "",
    childNodes: [],
    className: "ac-slide",
    selector: `${parentWrapper.selector} .ac-slide`,
  };

  // Create the slide element and add it to the parent element
  await createElement(
    tag,
    slideElement,
    false,
    null,
    pos,
    state,
    document,
    properties[tag.layout] || {}
  );
  parentElement.childNodes.push(slideUniqueId);

  // Update the parent element in the database
  await updateData(state.page._id, parentElement);

  // Return the position, parent ID, and new ID of the slide element
  return {
    pos,
    parentId: parentElement._uid,
    newId: slideUniqueId,
  };
};

// Function to create a tab element
const createTab = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
  // Initialize tabsButton and tabsContent
  let tabsButton = null;
  let tabsContent = null;

  // Initialize dragPos
  let dragPos = "";

  // Check the layout of the parent element and assign tabsButton and tabsContent accordingly
  if (parentElement.layout === "tabs-btn") {
    tabsButton = parentElement;
    tabsContent = await getData(state.page._id, tabsButton.contentRef);
    dragPos = pos + "1";
    parentElement = await getData(state.page._id, parentElement.parent)
  } else if (parentElement.layout === "tabs-content") {
    tabsContent = parentElement;
    tabsButton = await getData(state.page._id, tabsContent.btnRef);
    parentElement = await getData(state.page._id, parentElement.parent)

    dragPos = pos + "0";
  } else {
    tabsButton = await getData(state.page._id, parentElement.btnRef);
    tabsContent = await getData(state.page._id, parentElement.contentRef);
    pos = pos + "0";
    dragPos = pos + "1";
  }
  const parentWrapper = await getData(state.page._id, parentElement.parent);

  // Get the total length of childNodes in tabsContent
  const totalLength = tabsContent.childNodes.length;

  // Generate unique ID for tab button
  const tabButtonUniqueId = uuid();

  // Define the tab button element
  const tabButton = {
    _uid: tabButtonUniqueId,
    tagName: "button",
    name: "Tab Button",
    type: "inputs",
    layout: "button",
    nodeValue: "Tab Button",
    childNodes: [],
    attributes: {
      disabled: {
        key: "disabled",
        value: true,
        conditions: {
          "cond-0": {
            name: "currentIndex",
            key: ["currentIndex"],
            type: "Tabs-"+parentWrapper._uid,
            value: `[key] == ${totalLength}`,
            relation: "AND",
          },
        },
      },
    },
    onClick: {
      key: ["currentIndex"],
      type: "Tabs-"+parentWrapper._uid,
      value: `${totalLength}`,
    },
    className: "ac-tab-btn",
    selector: tabsButton.selector + " .ac-tab-btn",
    style: {
      normal: {
        proeprties: {},
        selectorText: tabsButton.selector + " .ac-tab-btn",
      },
    },
  };

  // Add the new tab button to the tabsButton childNodes
  tabsButton.childNodes = [...tabsButton.childNodes, tabButtonUniqueId];

  // Generate unique ID for tab content
  const tabContentUniqueId = uuid();

  // Define the tab content element
  const tabContent = {
    _uid: tabContentUniqueId,
    tagName: "div",
    name: "Tab Content",
    type: "layouts",
    layout: "tab-content",
    nodeValue: "Tab Content",
    childNodes: [],
    className: "ac-tab-content",
    selector: tabsContent.selector + " .ac-tab-content",
    style: {
      normal: {
        proeprties: {},
        selectorText: tabsContent.selector + " .ac-tab-content",
      },
    },
  };

  // Create the tab content element and add it to the tabsContent childNodes
  await createElement(
    tag,
    tabContent,
    false,
    null,
    pos,
    state,
    document,
    properties[tag.layout] || {}
  );
  tabsContent.childNodes = [...tabsContent.childNodes, tabContentUniqueId];

  // Update the tab button, tabs button, and tabs content in the database
  await updateData(state.page._id, tabButton);
  await updateData(state.page._id, tabsButton);
  await updateData(state.page._id, tabsContent);

  // Return the position, drag position, current ID, parent ID, and new ID
  return {
    pos: pos,
    dragPos: dragPos,
    currentId: tabsContent._uid,
    parentId: tabsButton._uid,
    newId: tabButton._uid,
  };
};

// Function to create an accordion element
const createAccordion = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
  // If the parent element's layout is 'accordion', fetch the parent data
  if (parentElement.layout === "accordion") {
    parentElement = await getData(state.page._id, parentElement.parent);
  }

  const parentWrapper = await getData(state.page._id, parentElement.parent);
  const totalLength = parentElement.childNodes.length;

  // Generate unique IDs for accordion content, header and the accordion itself
  const accordionContentUniqueId = uuid();
  const accordionHeaderUniqueId = uuid();
  const accordionUniqueId = uuid();

  // Define the accordion content element
  const accordionContent = {
    _uid: accordionContentUniqueId,
    tagName: "div",
    name: "Accordion Content",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    childNodes: [],
    className: "ac-accordion-content",
    selector: `${parentWrapper.selector} .ac-accordion-content`,
    parent: accordionUniqueId,
  };

  // Define the accordion header element
  const accordionHeader = {
    _uid: accordionHeaderUniqueId,
    tagName: "div",
    name: "Accordion Header",
    type: "inputs",
    layout: "div",
    nodeValue: "Accordion Header",
    childNodes: [],
    className: "ac-accordion-header",
    selector: `${parentWrapper.selector} .ac-accordion-header`,
    onClick: {
      key: ["currentIndex"],
      type: "Accordion-" + parentWrapper?._uid,
      value: `${totalLength}`,
    },
    parent: accordionUniqueId,
  };

  // Define the accordion element
  const accordionElement = {
    _uid: accordionUniqueId,
    tagName: "div",
    name: "Accordion Item",
    type: "layouts",
    layout: "accordion",
    nodeValue: "",
    childNodes: [accordionHeaderUniqueId, accordionContentUniqueId],
    className: "ac-accordion",
    selector: `${parentWrapper.selector} .ac-accordion`,
    parent: parentElement._uid,
  };

  // Create the accordion content element
  await createElement(
    tag,
    accordionContent,
    false,
    null,
    pos,
    state,
    document,
    properties[tag.layout] || {}
  );

  // Add the accordion element to the parent element's childNodes at the correct position
  if (addToAbove) {
    const index = parentElement.childNodes.indexOf(currentUid);
    parentElement.childNodes.splice(index, 0, accordionUniqueId);
  } else {
    parentElement.childNodes.push(accordionUniqueId);
  }

  // Update the accordion header, accordion element and parent element in the database
  await updateData(state.page._id, accordionHeader);
  await updateData(state.page._id, accordionElement);
  await updateData(state.page._id, parentElement);

  // Return the position, parent ID, and new ID of the accordion element
  return {
    pos: pos,
    parentId: parentElement._uid,
    newId: accordionElement._uid,
  };
};

// Function to create a gallery item
const createGalleryItem = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
 
  const parentWrapper = await getData(state.page._id, parentElement.parent);
  const totalLength = parentElement.childNodes.length;

  // Generate unique ID for the image and gallery item
  const imageUniqueId = uuid();
  const galleryItemUniqueId = uuid();

  // Define the image element
  const imageElement = {
    _uid: imageUniqueId,
    tagName: "img",
    name: "Image",
    type: "media",
    layout: "img",
    nodeValue: "",
    childNodes: [],
    className: "ac-gallery-img",
    selector: `${parentWrapper.selector} .ac-gallery-img`,
    parent: galleryItemUniqueId,
  };

  // Define the gallery item element
  const galleryItemElement = {
    _uid: galleryItemUniqueId,
    tagName: "div",
    name: "Gallery Item",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    childNodes: [imageUniqueId],
    className: "ac-gallery-item",
    selector: `${parentWrapper.selector} .ac-gallery-item`,
    onClick: {
      key: ["currentIndex"],
      type: "Gallery-"+parentWrapper?._uid,
      value: `${totalLength}`,
    },
    parent: parentElement._uid,
  };

  // Add the gallery item to the parent element's childNodes at the correct position
  if (addToAbove) {
    const index = parentElement.childNodes.indexOf(currentUid);
    parentElement.childNodes.splice(index, 0, galleryItemUniqueId);
  } else {
    parentElement.childNodes.push(galleryItemUniqueId);
  }

  // Update the image, gallery item, and parent element in the database
  await updateData(state.page._id, imageElement);
  await updateData(state.page._id, galleryItemElement);
  await updateData(state.page._id, parentElement);

  // Return the position, parent ID, and new ID of the gallery item
  return {
    pos: pos,
    parentId: parentElement._uid,
    newId: galleryItemElement._uid,
  };
};

// Function to create a modal item
const createModalItem = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  position,
  state,
  document
) => {
  // Fetch the modal body reference from the database
  const modalBody = await getData(state.page._id, parentElement.bodyRef);

  // Create the modal item element and return it
  // The position is appended with "0" to ensure it's placed at the start of the modal
  // The properties are fetched based on the layout of the tag, if no properties are found, an empty object is used
  return await createElement(
    tag,
    modalBody,
    false,
    null,
    position + "0",
    state,
    document,
    properties[tag.layout] || {}
  );
};

/**
 * Function to create a new element based on the provided tag and properties.
 * @param {Object} tag - The tag object containing the details of the element to be created.
 * @param {Object} parentElement - The parent element to which the new element will be added.
 * @param {boolean} addToAbove - Flag to determine if the new element should be added above the current element.
 * @param {string} currentUid - The unique identifier of the current element.
 * @param {number} position - The position at which the new element should be added.
 * @param {Object} state - The current state of the application.
 * @param {Object} document - The current document object.
 * @param {Object} properties - The properties to be applied to the new element.
 * @returns {Object} - Returns an object containing the position, parent ID, and new ID of the new element.
 */
const createElement = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  position,
  state,
  document,
  properties
) => {
  let newElement = null;

  // Check the type of the tag and create the appropriate element
  if (tag.type === "component") {
    newElement = await addComponent(tag, state, document);
  } else if (tag.type === "form") {
    newElement = await createInput(tag, state, document);
  } else {
    // Generate a unique ID for the new element
    const uniqueId = uuid();

    // Generate a random ID for the new element
    const randomId = nanoid(4);

    // Define the class name for the new element
    const className = "ac-elem-" + randomId;

    // Check if the tag is a page and create the appropriate element
    if (tag.page) {
      newElement = {
        ...tag,
        _uid: uniqueId,
        className: className,
        childNodes: ["0"],
        tagName: "div",
        nodeValue: "",
        type: "layouts",
        layout: "div",
        selector: "." + className,
        style: {
          normal: {
            properties,
          },
        },
      };
    } else {
      // Create a new element with the provided tag details
      newElement = {
        _uid: uniqueId,
        tagName: tag.tag,
        name: tag.layout,
        type: tag.type,
        layout: tag.layout,
        attributes: tag.attributes,
        state: tag.state,
        map: tag.map,
        nodeValue: tag.nodeValue ? tag.nodeValue : tag.text ? tag.text : "",
        childNodes: tag.childNodes || [],
        classes: tag.classes,
        className: className,
        selector: "." + className,
      };
    }

    // Check if the tag has a width property and the layout is 'fg-child'
    if (tag.width && tag.layout === "fg-child") {
      properties["width"] = {
        value: tag.width,
        unit: "%",
      };
    }

    // Add CSS to the new element
    await addCSS(document, properties, newElement, state.page._id);
  }

  // Set the parent of the new element
  newElement.parent = parentElement._uid;

  // Check if the new element should be added above the current element
  if (addToAbove) {
    const index = parentElement.childNodes.indexOf(currentUid);
    parentElement.childNodes.splice(index, 0, newElement._uid);
  } else {
    parentElement.childNodes.push(newElement._uid);
  }

  // Update the new element and the parent element in the database
  await updateData(state.page._id, newElement);
  await updateData(state.page._id, parentElement);

  // Return the position, parent ID, and new ID of the new element
  return {
    pos: position,
    parentId: parentElement._uid,
    newId: newElement._uid,
  };
};

export default addElement;
