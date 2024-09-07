import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";
import { deleteData, getData, updateData } from "../db";
import addCSS from "./addCSS";
import { onDeleteElement } from "../../components/Editors/Page/PageProvider/PageManager";

// Function to generate style for an element
export const generateElementStyle = (selector, properties) => ({
  normal: {
    [selector]: {
      selectorText: selector,
      properties: { ...properties },
    },
  },
});

// Function to add a component
const addComponent = async (tag, state, document) => {
  try {
    return getComponent(tag, state, document);
  } catch (e) {
    throw new Error(e?.message);
  }
};

// Function to create a menu component
const createMenu = async (tag, state, document) => {
  // Merge global and menu specific states
  const componentStates = { ...states["global"], ...states["menu"] };

  // Generate unique id for the menu
  const menuId = nanoid(4);

  // Create a unique class name for the menu
  const className = `ac-menu-${menuId}`;

  // Create a unique id for the menu item link
  const menuItemLinkId = uuid();

  // Define the menu item link
  const menuItemLink = {
    _uid: menuItemLinkId,
    tagName: "a",
    name: "Menu Item Link 1",
    type: "texts",
    layout: "link",
    nodeValue: "Link 1",
    childNodes: [],
    attributes: {
      href: {
        key: "href",
        value: "'#'",
      },
      target: {
        key: "target",
        value: "'_self'",
      },
    },
    className: "ac-menu-link",
    selector: `.${className} .ac-menu-link`,
  };

  // Create a unique id for the menu item
  const menuItemId = uuid();
  menuItemLink.parent = menuItemId;

  // Define the menu item
  const menuItem = {
    _uid: menuItemId,
    tagName: "li",
    name: "Menu Item 1",
    type: "texts",
    layout: "text",
    nodeValue: "",
    childNodes: [menuItemLinkId],
    className: "ac-menu-item",
    selector: `.${className} .ac-menu-item`,
    listItemLink: menuItemLinkId,
  };

  // Create a unique id for the list
  const listId = uuid();
  menuItem.parent = listId;

  // Define the list
  const list = {
    _uid: listId,
    tagName: "ul",
    name: "Menu List",
    type: "texts",
    layout: "menu-list",
    nodeValue: "",
    childNodes: [menuItemId],
    menus: [
      {
        childId: menuItemId,
        key: "1",
        title: "Link 1",
        link: "#",
        target: "_self",
        children: [],
        level: 0,
      },
    ],
    className: "ac-menu",
    selector: `.${className} .ac-menu`,
  };

  // Create a unique id for the wrapper
  const wrapperId = uuid();
  list.parent = wrapperId;

  // Define the wrapper element
  const wrapperElement = {
    _uid: wrapperId,
    tagName: tag.tag,
    name: "Menu",
    cname: "Menu",
    layout: "nav",
    nodeValue: "",
    childNodes: [listId],
    className: className,
    selector: `.${className}`,
    states: componentStates,
    type: "component",
  };

  // Define the CSS properties for the menu item link
  const menuItemLinkProperties = {
    color: { value: "inherit" },
    "text-decoration": { value: "none" },
  };
  // Add CSS for the menu item link
  await addCSS(document, menuItemLinkProperties, menuItemLink, state.page._id);
  // Update the data for the menu item link
  await updateData(state.page._id, menuItemLink);

  // Define the CSS properties for the menu item
  const menuItemProperties = {
    margin: { value: "0px" },
    padding: { value: "5px 10px" },
    position: { value: "relative" },
  };
  // Add CSS for the menu item
  await addCSS(document, menuItemProperties, menuItem, state.page._id);
  // Update the data for the menu item
  await updateData(state.page._id, menuItem);

  // Define the CSS properties for the list
  const listProperties = {
    display: { value: "flex" },
    gap: { value: "10px" },
    "list-style-type": { value: "none" },
  };
  // Add CSS for the list
  await addCSS(document, listProperties, list, state.page._id);
  // Update the data for the list
  await updateData(state.page._id, list);

  // Define the CSS properties for the wrapper
  const wrapperProperties = {};
  // Add CSS for the wrapper
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
  // Update the data for the wrapper
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

const createFlex = async (state, document, childCount = 2) => {
  // Initialize component states
  const componentStates = {};

  // Generate a unique id for the flex component
  const id = nanoid(4);
  const className = `ac-flex-${id}`;

  // Define the child item structure
  const childItem = {
    tagName: "div",
    name: "Flex Child",
    type: "layouts",
    layout: "flex-child",
    childNodes: [],
  };

  // Initialize childNodes and childsElement arrays
  const childNodes = [];
  const childsElement = [];

  // Generate a unique id for the wrapper
  const wrapperUniqueId = uuid();

  // Create child elements based on the childCount
  for (let i = 0; i < childCount; i++) {
    const uniqueId = uuid();

    const child = {
      ...childItem,
      nodeValue: "",
      _uid: uniqueId,
      className: `ac-flex-child-${i + 1}`,
      selector: `.${className} .ac-flex-child-${i + 1}`,
      parent: wrapperUniqueId,
    };

    // Push the unique id to childNodes and the child element to childsElement
    childNodes.push(uniqueId);
    childsElement.push(child);
  }

  // Define the wrapper element structure
  const wrapperElement = {
    _uid: wrapperUniqueId,
    tagName: "div",
    name: "FlexBox",
    cname: "FlexBox",
    type: "component",
    layout: "Flex",
    nodeValue: "",
    childNodes: childNodes,
    className: className,
    selector: `.${className}`,
    states: componentStates,
  };

  // Apply CSS and update data for each child element
  childsElement.forEach(async (child) => {
    const properties = {
      flex: { value: "1" },
      padding: { value: "5px" },
    };
    await addCSS(document, properties, child, state.page._id);
    await updateData(state.page._id, child);
  });

  // Define CSS properties for the wrapper element
  const properties = {
    display: { value: "flex" },
  };
  // Apply CSS and update data for the wrapper element
  await addCSS(document, properties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

// Function to create a grid component
const createGrid = async (state, document, gridItemsCount = 4) => {
  // Initialize component states
  const componentStates = {};

  // Generate a unique id for the grid component
  const id = nanoid(4);
  const className = `ac-grid-${id}`;

  // Define the structure of a grid child item
  const gridChildItem = {
    tagName: "div",
    name: "Grid Child",
    type: "layouts",
    layout: "grid-child",
    childNodes: [],
  };

  // Initialize arrays to hold child nodes and child elements
  const childNodes = [];
  const gridChildElements = [];

  // Generate a unique id for the wrapper
  const wrapperUniqueId = uuid();

  // Create grid child elements based on the gridItemsCount
  for (let i = 0; i < gridItemsCount; i++) {
    const uniqueId = uuid();

    const gridChild = {
      ...gridChildItem,
      nodeValue: "",
      _uid: uniqueId,
      className: `ac-grid-child-${i + 1}`,
      selector: `.${className} .ac-grid-child-${i + 1}`,
      parent: wrapperUniqueId,
    };

    // Push the unique id to childNodes and the grid child element to gridChildElements
    childNodes.push(uniqueId);
    gridChildElements.push(gridChild);
  }

  // Define the wrapper element structure
  const wrapperElement = {
    _uid: wrapperUniqueId,
    tagName: "div",
    name: "Grid",
    cname: "Grid",
    type: "component",
    layout: "grid",
    nodeValue: "",
    childNodes: childNodes,
    className: className,
    selector: `.${className}`,
    states: componentStates,
  };

  // Apply CSS and update data for each grid child element
  gridChildElements.forEach(async (gridChild) => {
    const childProperties = {
      padding: { value: "5px" },
    };
    await addCSS(document, childProperties, gridChild, state.page._id);
    await updateData(state.page._id, gridChild);
  });

  // Define CSS properties for the wrapper element
  const wrapperProperties = {
    display: { value: "grid" },
    "grid-template-columns": { value: "repeat(2, 1fr)" },
    "grid-gap": { value: "10px" },
  };
  // Apply CSS and update data for the wrapper element
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

// Function to create a container component
const createContainer = async (state, document) => {
  // Initialize component states
  const componentStates = {};

  // Generate a unique id for the container
  const id = nanoid(4);
  const className = `ac-container-${id}`;

  // Generate a unique id for the wrapper
  const wrapperUniqueId = uuid();

  // Define the wrapper element structure
  const wrapperElement = {
    _uid: wrapperUniqueId,
    tagName: "div",
    name: "Container",
    cname: "Container",
    type: "component",
    layout: "container",
    nodeValue: "Container",
    childNodes: [],
    className: className,
    selector: `.${className}`,
    states: componentStates,
  };

  // Define the CSS properties for the wrapper element
  const wrapperProperties = {
    "max-width": { value: "1200px" },
    position: { value: "static" },
    margin: { value: "0 auto" },
    padding: { value: "0 15px" },
  };

  // Apply CSS to the wrapper element
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);

  // Update the data for the wrapper element
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

const createSlider = async (state, document) => {
  // Merge global and slider specific states
  const componentStates = { ...states["global"], ...states["slider"] };

  // Generate a unique id for the slider
  let id = nanoid(4);
  const className = "ac" + "-slider-" + id;
  const wrraper_unique_id = uuid();

  // Create a slide element
  const slide_unique_id = uuid();
  const slideElement = {
    _uid: slide_unique_id,
    tagName: "div",
    name: "slide",
    type: "layouts",
    layout: "slide",
    nodeValue: "",
    childNodes: [],
    className: "ac-slide",
    selector: "." + className + " .ac-slide",
  };

  // Create a slides container
  const slides_unique_id = uuid();
  const slidesElement = {
    _uid: slides_unique_id,
    tagName: "div",
    name: "slides",
    type: "layouts",
    layout: "slides",
    nodeValue: "",
    childNodes: [slide_unique_id],
    className: "ac-slides",
    selector: "." + className + " .ac-slides",
  };

  // Set the parent of the slide element to be the slides container
  slideElement.parent = slides_unique_id;

  // Create a left button for the slider
  const left_btn_unique_id = uuid();
  const slidesLeftButton = {
    _uid: left_btn_unique_id,
    tagName: "button",
    name: "Left",
    type: "inputs",
    layout: "button",
    nodeValue: "Left",
    childNodes: [],
    // Define the onClick event to decrease the currentIndex
    onClick: {
      key: ["currentIndex"],
      type: "Sider-" + wrraper_unique_id,
      value: "[key] - 1",
    },
    className: "ac-slider-left-btn",
    selector: "." + className + " .ac-slider-left-btn",
  };

  // Create a right button for the slider
  const right_btn_unique_id = uuid();
  const slidesRightButton = {
    _uid: right_btn_unique_id,
    tagName: "button",
    name: "Right",
    type: "inputs",
    layout: "button",
    nodeValue: "Right",
    // Define the onClick event to increase the currentIndex
    onClick: {
      key: ["currentIndex"],
      type: "Slider-" + wrraper_unique_id,
      value: "[key] + 1",
    },
    childNodes: [],
    className: "ac-slider-right-btn",
    selector: "." + className + " .ac-slider-right-btn",
  };

  // Create a dot for the slider
  const slider_dot_unique_id = uuid();
  const slidesDots = {
    _uid: slider_dot_unique_id,
    tagName: "div",
    name: "Slide dot",
    type: "texts",
    layout: "li",
    // Define the onClick event to set the currentIndex to the clicked dot's index
    onClick: {
      key: ["currentIndex"],
      type: "Slider-" + wrraper_unique_id,
      withtype: "MAPINDEX",
      withkey: [],
      value: "[withkey]",
    },
    // Define the map property to map the dots to the items
    map: {
      key: ["items"],
      type: "Sider",
    },
    attributes: {
      style: {
        key: "style",
        type: "",
        value: "",
        name: "styles",
        conditions: {},
        attributes: {
          backgroundColor: {
            key: "backgroundColor",
            type: "",
            value: "'#e0e0e0'",
            name: "active-slider-dot-bg",
            conditions: {
              "cond-active-bg": {
                key: ["currentIndex"],
                type: "Slider-" + wrraper_unique_id,
                valueState: {
                  key: [],
                  type: "MAPINDEX",
                },
                relation: "AND",
                value: "[key] == [state]",
                name: "active-bg",
              },
            },
          },
        },
      },
    },
    childNodes: [],
    nodeValue: ".",
    className: "ac-slide-nav-item",
    selector: "." + className + " .ac-slide-nav-item",
  };

  // Create a container for the dots
  const dots_conatienr_id = uuid();
  const slidesDotsContainer = {
    _uid: dots_conatienr_id,
    tagName: "ul",
    name: "Slides Dots",
    type: "text",
    layout: "list",
    childNodes: [slider_dot_unique_id],
    nodeValue: "",
    className: "ac-slider-nav-container",
    selector: "." + className + " .ac-slider-nav-container",
  };
  // Set the parent of the dots to be the dots container
  slidesDots.parent = dots_conatienr_id;
  // Define the child nodes of the slider
  const childNodes = [
    slides_unique_id,
    dots_conatienr_id,
    left_btn_unique_id,
    right_btn_unique_id,
  ];

  // Create a wrapper for the slider
  slidesLeftButton.parent = wrraper_unique_id;
  slidesRightButton.parent = wrraper_unique_id;
  slidesDotsContainer.parent = wrraper_unique_id;
  slidesElement.parent = wrraper_unique_id;

  // Define the wrapper element structure
  const wrapperElement = {
    _uid: wrraper_unique_id,
    tagName: "div",
    name: "Slider",
    cname: "Slider",
    layout: "slider",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  let properties = {
    height: {
      value: "100%",
      unit: "%",
    },
  };
  await addCSS(document, properties, slideElement, state.page._id);

  await updateData(state.page._id, slideElement);

  properties = {
    position: {
      value: "relative",
    },
    height: {
      value: "400px",
    },
  };
  await addCSS(document, properties, slidesElement, state.page._id);

  await updateData(state.page._id, slidesElement);

  properties = {
    position: {
      value: "absolute",
    },
    top: {
      value: "50%",
      unit: "%",
    },
    left: {
      value: "10px",
    },
    transform: {
      value: "translateY(-50%)",
    },
  };
  await addCSS(document, properties, slidesLeftButton, state.page._id);

  await updateData(state.page._id, slidesLeftButton);

  properties = {
    position: {
      value: "absolute",
    },
    top: {
      value: "50%",
      unit: "%",
    },
    right: {
      value: "10px",
    },
    transform: {
      value: "translateY(-50%)",
    },
  };
  await addCSS(document, properties, slidesRightButton, state.page._id);

  await updateData(state.page._id, slidesRightButton);

  properties = {
    width: {
      value: "10px",
    },
    height: {
      value: "10px",
    },
    "border-radius": {
      value: "50%",
      unit: "%",
    },
    " background-color": {
      value: "#ccc;",
    },
    margin: {
      value: "0 5px",
    },
    cursor: {
      value: "pointer",
    },
  };
  await addCSS(document, properties, slidesDots, state.page._id);

  await updateData(state.page._id, slidesDots);

  properties = {
    position: {
      value: "absolute",
    },
    bottom: {
      value: "10px",
    },
    left: {
      value: "50%",
      unit: "%",
    },
    transform: {
      value: "translateX(-50%)",
    },
    display: {
      value: "flex",
    },
    "list-style-type": {
      value: "none",
    },
  };
  await addCSS(document, properties, slidesDotsContainer, state.page._id);

  await updateData(state.page._id, slidesDotsContainer);

  properties = {
    position: {
      value: "relative",
    },
  };
  await addCSS(document, properties, wrapperElement, state.page._id);

  await updateData(state.page._id, wrapperElement);

  return wrapperElement;
};

const createTabs = async (state, document) => {
  const componentStates = { ...states["global"], ...states["tabs"] };

  let id = nanoid(4);
  const className = "ac" + "-tabs-" + id;
  const wrraper_unique_id = uuid();

  const tab_btn_unique_id = uuid();

  const tabButton = {
    _uid: tab_btn_unique_id,
    tagName: "button",
    name: "Tab Button",
    type: "inputs",
    layout: "button",
    nodeValue: "Tab Button",
    childNodes: [],

    onClick: {
      key: ["currentIndex"],
      type: "Tabs-" + wrraper_unique_id,
      value: "0",
    },
    className: "ac-tab-btn",
    selector: "." + className + " .ac-tab-btn",
  };

  const tabs_btn_unique_id = uuid();

  const tabsButton = {
    _uid: tabs_btn_unique_id,
    tagName: "div",
    name: "Tabs Button",
    type: "layouts",
    layout: "tabs-btn",
    nodeValue: "",
    childNodes: [tab_btn_unique_id],
    className: "ac-tabs-btn",
    selector: "." + className + " .ac-tabs-btn",
  };
  tabButton.parent = tabs_btn_unique_id;

  const tab_content_unique_id = uuid();
  const tabContent = {
    _uid: tab_content_unique_id,
    tagName: "div",
    name: "Tab Content",
    type: "layouts",
    layout: "tab-content",
    nodeValue: "Tab Content",
    childNodes: [],

    className: "ac-tab-content",
    selector: "." + className + " .ac-tab-content",
  };

  const tabs_content_unique_id = uuid();
  tabsButton.contentRef = tabs_content_unique_id;

  const tabsContentElement = {
    _uid: tabs_content_unique_id,
    tagName: "div",
    name: "Tabs Content",
    type: "layouts",
    layout: "tabs-content",
    nodeValue: "",
    childNodes: [tab_content_unique_id],
    className: "ac-tabs-content",
    selector: "." + className + " .ac-tabs-content",
  };
  tabContent.parent = tabs_content_unique_id;
  tabsContentElement.btnRef = tabs_btn_unique_id;

  const tabs_unique_id = uuid();

  const tabs = {
    _uid: tabs_unique_id,
    tagName: "div",
    name: "Tabs Body",
    type: "layouts",
    layout: "tabs",
    nodeValue: "",
    childNodes: [tabs_btn_unique_id, tabs_content_unique_id],
    className: "ac-tabs",
    selector: "." + className + " .ac-tabs",
  };
  tabs.btnRef = tabs_btn_unique_id;
  tabs.contentRef = tabs_content_unique_id;

  tabs.parent = wrraper_unique_id;
  const childNodes = [tabs_unique_id];

  const wrapperElement = {
    _uid: wrraper_unique_id,
    tagName: "div",
    name: "Tabs",
    cname: "Tabs",

    type: "layouts",
    layout: "layout",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  let properties = {
    border: {
      value: "none",
    },
    outline: {
      value: "none",
    },
    "background-color": {
      value: "#f2f2f2",
    },

    padding: {
      value: "10px 20px",
    },
    cursor: {
      value: "pointer",
    },
  };

  await addCSS(document, properties, tabButton, state.page._id);

  await updateData(state.page._id, tabButton);

  properties = {};

  await addCSS(document, properties, tabsButton, state.page._id);
  await updateData(state.page._id, tabsButton);

  properties = {
    padding: {
      value: "20px",
    },
    border: {
      value: "1px solid #ccc",
    },
    "background-color": {
      value: "#f2f2f2",
    },
  };

  await addCSS(document, properties, tabContent, state.page._id);
  await updateData(state.page._id, tabContent);

  properties = {};

  await addCSS(document, properties, tabsContentElement, state.page._id);
  await updateData(state.page._id, tabsContentElement);

  properties = {};
  await addCSS(document, properties, tabs, state.page._id);

  await updateData(state.page._id, tabs);

  properties = {
    position: {
      value: "relative",
    },
    height: {
      value: "400px",
    },
  };

  await addCSS(document, properties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  return wrapperElement;
};

const createAccordion = async (state, document) => {
  const componentStates = { ...states["global"], ...states["accordion"] };

  let id = nanoid(4);
  const className = "ac" + "-accordion-" + id;
  const wrraper_unique_id = uuid();

  const accordion_content_unique_id = uuid();

  const accordionContent = {
    _uid: accordion_content_unique_id,
    tagName: "div",
    name: "Accordion Content",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    childNodes: [],

    className: "ac-accordion-content",
    selector: "." + className + " .ac-accordion-content",
  };

  const accordion_header_unique_id = uuid();

  const accordionHeader = {
    _uid: accordion_header_unique_id,
    tagName: "div",
    name: "Accordion Header",
    type: "inputs",
    layout: "div",
    nodeValue: "Accordion Header",
    childNodes: [],
    className: "ac-accordion-header",
    selector: "." + className + " .ac-accordion-header",
    onClick: {
      key: ["currentIndex"],
      type: "Accordion-" + wrraper_unique_id,
      value: "0",
    },
  };

  const accordion_unique_id = uuid();

  const accordionElement = {
    _uid: accordion_unique_id,
    tagName: "div",
    name: "Accordion Item",
    type: "layouts",
    layout: "accordion",
    nodeValue: "",
    childNodes: [accordion_header_unique_id, accordion_content_unique_id],
    className: "ac-accordion",
    selector: "." + className + " .ac-accordion",
  };
  accordionHeader.parent = accordion_unique_id;
  accordionContent.parent = accordion_unique_id;

  const accordions_unique_id = uuid();

  const accordionsElement = {
    _uid: accordions_unique_id,
    tagName: "div",
    name: "Accordion Body",
    type: "layouts",
    layout: "accordions",
    nodeValue: "",
    childNodes: [accordion_unique_id],
    className: "ac-accordion-items",
    selector: "." + className + " .ac-accordions-items",
  };
  accordionElement.parent = accordions_unique_id;

  accordionsElement.parent = wrraper_unique_id;
  const childNodes = [accordions_unique_id];

  const wrapperElement = {
    _uid: wrraper_unique_id,
    tagName: "div",
    name: "Accordion",
    cname: "Accordion",

    type: "layouts",
    layout: "component",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  let properties = {
    display: {
      value: "flex",
    },
    "align-items": {
      value: "center",
    },
    "background-color": {
      value: "#f2f2f2",
    },

    padding: {
      value: "10px",
    },
    cursor: {
      value: "pointer",
    },
  };
  await addCSS(document, properties, accordionHeader, state.page._id);
  await updateData(state.page._id, accordionHeader);

  properties = {
    "background-color": {
      value: "#fff",
    },

    padding: {
      value: "10px",
    },
  };
  await addCSS(document, properties, accordionContent, state.page._id);
  await updateData(state.page._id, accordionContent);

  properties = {
    "margin-bottom": {
      value: "10px",
    },
  };
  await addCSS(document, properties, accordionElement, state.page._id);
  await updateData(state.page._id, accordionElement);

  properties = {};
  await addCSS(document, properties, accordionsElement, state.page._id);
  await updateData(state.page._id, accordionsElement);

  properties = {
    position: {
      value: "relative",
    },
  };
  await addCSS(document, properties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  return wrapperElement;
};

const createGallery = async (state, document) => {
  const componentStates = {
    ...states["global"],
    ...states["gallery"],
    ...states["modal"],
  };

  let id = nanoid(4);
  const className = "ac" + "-gallery-" + id;
  const wrraper_unique_id = uuid();

  const img_unique_id = uuid();

  const image = {
    _uid: img_unique_id,
    tagName: "img",
    name: "Image",
    type: "media",
    
    layout: "img",
    nodeValue: "",
    childNodes: [],
    className: "ac-gallery-img",
    fixedClass: true,
    selector: "." + className + " .ac-gallery-img",
  };

  const gallery_item_unique_id = uuid();

  const galleryItem = {
    _uid: gallery_item_unique_id,
    tagName: "div",
    name: "Gallery Item",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    childNodes: [img_unique_id],
    className: "ac-gallery-item",
    fixedClass: true,
    selector: "." + className + " .ac-gallery-item",
    onClick: {
      key: ["currentIndex"],
      type: "Gallery-" + wrraper_unique_id,
      value: "0",
    },
  };
  image.parent = gallery_item_unique_id;

  const gallery_unique_id = uuid();

  const galleryElement = {
    _uid: gallery_unique_id,
    tagName: "div",
    name: "Gallery Body",
    type: "layouts",
    layout: "gallery",
    nodeValue: "",
    childNodes: [gallery_item_unique_id],
    className: "ac-gallery",
    selector: "." + className + " .ac-gallery",
  };

  galleryItem.parent = gallery_unique_id;

  const extraSelectors = {
    selectors: [
      { selector:  "." + className + " .ac-modal-body .ac-gallery-item", tagName: 'div' },
      { selector:  "." + className + " .ac-modal-body .ac-gallery-img", tagName: 'div' },
    ],
    properties: [
      {},
      {
        "object-fit": {
          value: "contain",
        },
      },
    ],
  };

  const modalElement = await createModal(
    state,
    document,
    className,
    {
      key: ["activeItem"],
      type: "Gallery-" + wrraper_unique_id,
    },
    "Gallery-" + wrraper_unique_id, extraSelectors
  );

  modalElement.parent = wrraper_unique_id;
  galleryElement.parent = wrraper_unique_id;
  const childNodes = [gallery_unique_id, modalElement._uid];

  const wrapperElement = {
    _uid: wrraper_unique_id,
    tagName: "div",
    name: "Gallery",
    cname: "Gallery",

    type: "layouts",
    layout: "div",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  await updateData(state.page._id, modalElement);

  let properties = {
    "max-width": {
      value: "100%",
      unit: "%",
    },
    height: {
      value: "100%",
      unit: "%",
    },
    width: {
      value: "100%",
      unit: "100%",
    },
    "object-fit": {
      value: "cover",
    },
  };
  await addCSS(document, properties, image, state.page._id);

  await updateData(state.page._id, image);

  properties = {
    "margin-bottom": {
      value: "10px",
    },
    height: {
      value: "100%",
      unit: "%",
    },
  };
  await addCSS(document, properties, galleryItem, state.page._id);
  await updateData(state.page._id, galleryItem);

  properties = {
    display: {
      value: "grid",
    },

    "grid-template-columns": {
      value: "repeat(auto-fill, minmax(250px, 1fr))",
    },
    "grid-gap": {
      value: "10px",
    },
  };
  await addCSS(document, properties, galleryElement, state.page._id);
  await updateData(state.page._id, galleryElement);

  properties = {
    position: {
      value: "relative",
    },
  };
  await addCSS(document, properties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  return wrapperElement;
};

// Function to create a Modal Trigger
const createModalTrigger = async (state, document) => {
  // Merge global and modal specific states
  const modalTriggerStates = { ...states["global"], ...states["modal"] };

  let id = nanoid(4);
  const className = "ac" + "-modal-" + id;
  // Create unique id for the modal trigger
  const modalTriggerUniqueId = uuid();
  const wrapperUniqueId = uuid();

  // Define the structure of the modal trigger
  const modalTrigger = {
    _uid: modalTriggerUniqueId,
    tagName: "button",
    name: "Modal Trigger",
    type: "inputs",
    layout: "button",
    nodeValue: "Open Modal",
    childNodes: [],
    className: "ac-modal-trigger",
    selector: `.${className} .ac-modal-trigger`,
    onClick: {
      key: ["openModal"],
      type: "Modal-" + wrapperUniqueId,
      value: "'open'",
    },
  };

  // Create a modal element
  const modalElement = await createModal(
    state,
    document,
    className,
    null,
    "Modal-" + wrapperUniqueId
  );

  // Create unique id for the wrapper
  // Set parent of modal element and modal trigger
  modalElement.parent = wrapperUniqueId;
  modalTrigger.parent = wrapperUniqueId;

  // Define child nodes of the wrapper
  const childNodes = [modalTriggerUniqueId, modalElement._uid];

  // Define the structure of the wrapper
  const wrapperElement = {
    _uid: wrapperUniqueId,
    tagName: "div",
    name: "Modal",
    cname: "Modal",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: `.${className}`,
    states: modalTriggerStates,
  };

  // Update the data for the modal element
  await updateData(state.page._id, modalElement);

  // Define CSS properties for the modal trigger
  const modalTriggerProperties = {
    "margin-bottom": {
      value: "10px",
    },
  };
  // Apply CSS properties to the modal trigger
  await addCSS(document, modalTriggerProperties, modalTrigger, state.page._id);

  // Update the data for the modal trigger
  await updateData(state.page._id, modalTrigger);

  // Define CSS properties for the wrapper
  const wrapperProperties = {
    position: {
      value: "relative",
    },
    display: {
      value: "inline-block",
    },
  };
  // Apply CSS properties to the wrapper
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);

  // Update the data for the wrapper
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

const createModal = async (
  state,
  document,
  className,
  valueState,
  type,
  extraSelectors = undefined
) => {
  const modal_close_unique_id = uuid();

  const modalClose = {
    _uid: modal_close_unique_id,
    tagName: "span",
    name: "Modal Close",
    type: "text",
    layout: "text",
    nodeValue: "&times;",
    childNodes: [],
    className: "ac-modal-close",
    selector: "." + className + " .ac-modal-close",
    onClick: {
      key: ["openModal"],
      type: type,
      value: "'close'",
    },
  };

  const modal_unique_id = uuid();
  modalClose.parent = modal_unique_id;

  const modal = {
    _uid: modal_unique_id,
    tagName: "div",
    name: "Modal Body",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    childNodes: [modal_close_unique_id],
    className: "ac-modal-body",
    fixedClass: true,
    selector: "." + className + " .ac-modal-body",
    state: valueState,
  };

  const modal_closer_unique_id = uuid();

  const modalCloserElement = {
    _uid: modal_closer_unique_id,
    tagName: "div",
    name: "Modal Closer",
    type: "layouts",
    layout: "empty",
    nodeValue: "",
    childNodes: [],
    className: "ac-modal-close-wrapper",
    selector: "." + className + " .ac-modal-close-wrapper",

    onClick: {
      key: ["openModal"],
      type: type,
      withtype: type,
      withkey: ["closable"],
      value: "[withkey] ? 'close' : 'open'",
    },
  };

  const modal_element_unique_id = uuid();
  modal.parent = modal_element_unique_id;
  modalCloserElement.parent = modal_element_unique_id;

  const modalElement = {
    _uid: modal_element_unique_id,
    tagName: "div",
    name: "Modal Wrapper",
    type: "layouts",
    layout: "modal",
    bodyRef: modal_unique_id,
    nodeValue: "",

    childNodes: [modal_unique_id, modal_closer_unique_id],
    className: "ac-modal",
    selector: "." + className + " .ac-modal",
  };

  let properties = {
    position: {
      value: "relative",
    },
    "background-color": {
      value: "#fefefe",
    },
    padding: {
      value: "20px",
    },
    "border-radius": {
      value: "4px",
    },
    width: {
      value: "50%",
      unit: "%",
    },
    height: {
      value: "50%",
      unit: "%",
    },
    "text-align": {
      value: "center",
    },
    "z-index": {
      value: 1,
    },
  };
  await addCSS(document, properties, modal, state.page._id);

  if (extraSelectors && Array.isArray(extraSelectors?.selectors)) {
    for (let i = 0; i < extraSelectors.selectors.length; i++) {
      await addCSS(document, extraSelectors.properties[i], extraSelectors.selectors[i], state.page._id);
    }

    modal["selectors"] = extraSelectors.selectors;
  }

  await updateData(state.page._id, modal);



  properties = {
    position: {
      value: "absolute",
    },
    left: {
      value: "0",
    },
    top: {
      value: "0",
    },
    width: {
      value: "100%",
      unit: "%",
    },
    height: {
      value: "100%",
      unit: "%",
    },
  };
  await addCSS(document, properties, modalCloserElement, state.page._id);
  await updateData(state.page._id, modalCloserElement);

  properties = {
    width: {
      value: "100%",
      unit: "%",
    },
    height: {
      value: "100%",
      unit: "%",
    },
    " background-color": {
      value: "rgba(0, 0, 0, 0.5)",
    },
    display: {
      value: "flex",
    },
    "justify-content": {
      value: "center",
    },
    "align-items": {
      value: "center",
    },
    position: {
      value: "relative",
    },
  };
  await addCSS(document, properties, modalElement, state.page._id);
  await updateData(state.page._id, modalElement);

  properties = {
    position: {
      value: "absolute",
    },
    top: {
      value: "10px",
    },
    right: {
      value: "10px",
    },
    "font-size": {
      value: "absolute",
    },
    cursor: {
      value: "pointer",
    },
  };
  await addCSS(document, properties, modalClose, state.page._id);
  await updateData(state.page._id, modalClose);

  return modalElement;
};

const createSider = async (state, document) => {
  const componentStates = { ...states["sider"] };

  let id = nanoid(4);
  const className = "ac" + "-sider-" + id;
  const wrraper_unique_id = uuid();

  const sider_content_unique_id = uuid();

  const siderContent = {
    _uid: sider_content_unique_id,
    tagName: "div",
    name: "Sider Content",
    type: "layouts",
    layout: "sider",
    nodeValue: "",
    childNodes: [],

    className: "ac-sider-content",
    selector: "." + className + " .ac-sider-content",
  };

  const sider_trigger_text_unique_id = uuid();

  const siderButtonText = {
    _uid: sider_trigger_text_unique_id,
    tagName: "span",
    name: "Sider Trigger Text",
    type: "texts",
    layout: "text",
    nodeValue: "{{Sider-" + wrraper_unique_id + "/siderStatus}}",
    isStateActive: true,
    childNodes: [],
    className: "ac-sider-trigger-text",
    selector: "." + className + " .ac-sider-trigger-text",
  };

  const sider_trigger_unique_id = uuid();
  siderButtonText.parent = sider_trigger_unique_id;

  const siderTrigger = {
    _uid: sider_trigger_unique_id,
    tagName: "button",
    name: "Sider Trigger",
    type: "inputs",
    layout: "button",
    nodeValue: "",
    childNodes: [sider_trigger_text_unique_id],
    className: "ac-sider-trigger",
    selector: "." + className + " .ac-sider-trigger",
    onClick: {
      key: ["openSider"],
      type: "Sider-" + wrraper_unique_id,
      value: "![key]",
    },
  };

  siderTrigger.parent = wrraper_unique_id;
  siderContent.parent = wrraper_unique_id;
  const childNodes = [sider_trigger_unique_id, sider_content_unique_id];

  const wrapperElement = {
    _uid: wrraper_unique_id,
    tagName: "div",
    name: "Sider",
    cname: "Sider",

    type: "layouts",
    layout: "div",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  let properties = {
    width: {
      value: "100%",
      unit: "%",
    },
    height: {
      value: "100%",
      unit: "%",
    },
    "background-color": {
      value: "#f2f2f2",
    },
    overflow: {
      value: "hideen",
    },
    padding: {
      value: "5px",
    },
  };
  await addCSS(document, properties, siderContent, state.page._id);
  await updateData(state.page._id, siderContent);

  await addCSS(document, {}, siderButtonText, state.page._id);
  await updateData(state.page._id, siderButtonText);
  properties = {
    margin: {
      value: "10px",
    },
    padding: {
      value: "5px",
    },
  };
  await addCSS(document, properties, siderTrigger, state.page._id);
  await updateData(state.page._id, siderTrigger);

  properties = {
    position: {
      value: "relative",
    },
    display: {
      value: "inline-block",
    },
    "background-color": {
      value: "#fff",
    },
  };
  await addCSS(document, properties, wrapperElement, state.page._id);
  await updateData(state.page._id, wrapperElement);

  return wrapperElement;
};

// Function to create a Dropdown Trigger
const createDropdownTrigger = async (state, document) => {
  // Merge global and dropdown specific states
  const dropdownStates = { ...states["dropdown"] };

  // Generate a unique id for the dropdown
  const dropdownId = nanoid(4);
  const dropdownClassName = `ac-dropdown-${dropdownId}`;

  // Create unique id for the dropdown trigger
  const dropdownTriggerId = uuid();
  const wrapperId = uuid();

  // Define the structure of the dropdown trigger
  const dropdownTrigger = {
    _uid: dropdownTriggerId,
    tagName: "button",
    name: "Dropdown Trigger",
    type: "inputs",
    layout: "button",
    nodeValue: "Dropdown Button",
    childNodes: [],
    className: "ac-dropdown-trigger",
    selector: `.${dropdownClassName} .ac-dropdown-trigger`,
    onClick: {
      key: ["openDropdown"],
      type: "Dropdown-" + wrapperId,
      value: "![key]",
    },
  };

  // Create a dropdown content
  const dropdownContent = await createDropDown(
    state,
    document,
    dropdownClassName,
    wrapperId
  );

  // Create unique id for the wrapper
  // Set parent of dropdown content and trigger
  dropdownContent.parent = wrapperId;
  dropdownTrigger.parent = wrapperId;

  // Define child nodes of the wrapper
  const childNodes = [dropdownTriggerId, dropdownContent._uid];

  // Define the structure of the wrapper
  const wrapperElement = {
    _uid: wrapperId,
    tagName: "div",
    name: "Dropdown",
    cname: "Dropdown",
    type: "layouts",
    layout: "div",
    nodeValue: "",
    type: "component",
    childNodes: childNodes,
    className: dropdownClassName,
    selector: `.${dropdownClassName}`,
    states: dropdownStates,
  };

  // Update the data for the dropdown content
  await updateData(state.page._id, dropdownContent);

  // Define CSS properties for the dropdown trigger
  const dropdownTriggerProperties = {
    padding: {
      value: "8px 16px",
    },
    "background-color": {
      value: "#f2f2f2",
    },
    border: {
      value: "1px solid #ccc",
    },
    cursor: {
      value: "pointer",
    },
  };
  // Apply CSS properties to the dropdown trigger
  await addCSS(
    document,
    dropdownTriggerProperties,
    dropdownTrigger,
    state.page._id
  );

  // Update the data for the dropdown trigger
  await updateData(state.page._id, dropdownTrigger);

  // Define CSS properties for the wrapper
  const wrapperProperties = {
    position: {
      value: "relative",
    },
    display: {
      value: "inline-block",
    },
  };
  // Apply CSS properties to the wrapper
  await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
  // Update the data for the wrapper
  await updateData(state.page._id, wrapperElement);

  // Return the wrapper element
  return wrapperElement;
};

// Function to create a Dropdown Content
const createDropDown = async (
  state,
  document,
  dropdownClassName,
  wrapperId
) => {
  const dropdownContentId = uuid();

  const dropDownContent = {
    _uid: dropdownContentId,
    tagName: "div",
    name: "Dropdown Content",
    type: "layouts",
    layout: "dropdown",
    nodeValue: "",
    childNodes: [],

    className: "ac-dropdown-content",
    selector: `.${dropdownClassName} .ac-dropdown-content`,
  };

  // Define CSS properties for the dropdown content
  const dropdownContentProperties = {
    padding: {
      value: "5px",
    },
    margin: {
      value: 0,
    },
    "background-color": {
      value: "#fff",
    },
    border: {
      value: "1px solid #ccc",
    },
    "border-top": {
      value: "none",
    },
  };

  // Apply CSS properties to the dropdown content
  await addCSS(
    document,
    dropdownContentProperties,
    dropDownContent,
    state.page._id
  );

  // Update the data for the dropdown content
  await updateData(state.page._id, dropDownContent);

  // Return the dropdown content
  return dropDownContent;
};

/* export const createMenuItem = async (
  tag,
  parentElemet,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
  const menus = parentElemet.menus || [];

  let allChilds = [];

  let deletedChilds = parentElemet.childNodes || [];

  for (let i = 0; i < menus.length; i++) {
    const element = menus[i];

    const list_item_unique_id = uuid();
    let listItem = await getData(state.page._id, element.childId);
    deletedChilds = deletedChilds.filter((_uid) => _uid !== element.childId);
    let listItemLink;

    if (!listItem) {
      const list_link_unique_id = uuid();

      listItemLink = {
        _uid: list_link_unique_id,
        tagName: "a",
        name: "Menu Item Link " + (i + 1),
        type: "texts",
        layout: "link",
        childNodes: [],

        className: "menu-link",
        selector: parentElemet.selector + " .menu-link",
      };

      listItemLink.nodeValue = element.title;

      listItemLink.attributes = {
        href: {
          key: "href",
          value: `'${element.link}'`,
        },
        target: {
          key: "target",
          value: `'${element.target}'`,
        },
      };

      listItem = {
        _uid: list_item_unique_id,
        tagName: "li",
        name: "Menu Item " + (i + 1),
        type: "texts",
        layout: "text",
        nodeValue: "",
        childNodes: [list_link_unique_id],
        className: "menu-item",
        selector: parentElemet.selector + " .menu-item",
      };

      for (let i = 0; i < listItem.childNodes.length; i++)
        listItemLink.parent = list_item_unique_id;
      parentElemet.childNodes.push(list_item_unique_id);

      listItem.parent = parentElemet._uid;
    } else {
      const list_link_unique_id = uuid();

      if (!listItem.childNodes[0]) {
        listItemLink = {
          _uid: list_link_unique_id,
          tagName: "a",
          name: "Menu Item Link " + (i + 1),
          type: "texts",
          layout: "link",
          childNodes: [],

          className: "menu-link",
          selector: parentElemet.selector + " .menu-link",
        };

        listItem.childNodes.push(list_link_unique_id);
        listItemLink.parent = listItem._uid;
      } else
      listItemLink = await getData(state.page._id, listItem.childNodes[0]);

      listItemLink.nodeValue = element.title;

      listItemLink.attributes = {
        href: {
          key: "href",
          value: `'${element.link}'`,
        },
        target: {
          key: "target",
          value: `'${element.target}'`,
        },
      };
    }


    let dropdown = await getData(state.page._id, listItem.dropdownId);

    if (element.dropdown) {
      const componentStates = { ...states["dropdown"] };
    
      // Use logical OR to set default states
      listItem = {
        ...listItem,
        states: listItem.states || componentStates,
        type: "component",
      };
    
      if (dropdown) {
        // Ensure dropdown UID is added to childNodes only once
        if (!listItem.childNodes.includes(dropdown._uid)) {
          listItem.childNodes.push(dropdown._uid);
        }
    
        // Set parent for listItemLink
        listItemLink.parent = dropdown._uid;
    
        // Ensure listItemLink UID is added to dropdown's childNodes only once
        if (!dropdown.childNodes.includes(listItemLink._uid)) {
          dropdown.childNodes.push(listItemLink._uid);
        }
    
        // Update dropdownId
        listItem.dropdownId = dropdown._uid;

        await updateData(state.page._id, dropdown);
      } else {
        // Create new dropdown wrapper
        const dropdownWrapperUniqueId = uuid();
        const randomId = nanoid(4);
        const className = "ac-elem-" + randomId;
    
        const dropdownWrapper = {
          _uid: dropdownWrapperUniqueId,
          tagName: "div",
          name: "DropDown Wrapper",
          type: "layouts",
          layout: "layout",
          childNodes: [listItemLink._uid],
          onClick: {
            key: ["openDropdown"],
            type: "Dropdown",
            value: "![key]",
          },
          className: className,
          selector: listItem.className + " ." + className,
        };

        allChilds = [...allChilds, ...dropdownWrapper.childNodes];

    
        const dropDownContent = await createDropDown(state, document, dropdownWrapper.className);
    
        dropDownContent.parent = dropdownWrapper._uid;
        dropdownWrapper.childNodes.push(dropDownContent._uid);
    
        listItemLink.parent = dropdownWrapperUniqueId;
    
        // Update parent and child relationship
        dropdownWrapper.parent = listItem._uid;
        listItem.childNodes = [dropdownWrapperUniqueId];
        listItem.dropdownId = dropdownWrapperUniqueId;

        await addCSS(
          document,
          {},
          dropdownWrapper,
          state.page._id
        );

        await updateData(state.page._id, dropdownWrapper);



      }
    } else {
      if (dropdown) {
        // Set parent for listItemLink and manage childNodes
        listItemLink.parent = listItem._uid;
    
        if (!listItem.childNodes.includes(listItemLink._uid)) {
          listItem.childNodes.push(listItemLink._uid);
        }
    
        dropdown.childNodes = dropdown.childNodes.filter(
          (_uid) => _uid !== listItemLink._uid
        );
    
        listItem.dropdownId = dropdown._uid;

        await updateData(state.page._id, dropdown);
      }
    
      // Remove 'type' property if it exists
      delete listItem.type;
      
      // Remove dropdownId from childNodes
      listItem.childNodes = listItem.childNodes.filter(
        (_uid) => _uid !== listItem.dropdownId
      );
    }

    /*  if (listItem.nestedMenuId) {
      let parent = await getData(state.page._id, listItem.nestedMenuId);
      const pageUpdated = await createMenuItem(
        {},
        parent,
        false,
        null,
        "",
        state
      );
      if (pageUpdated)
        allChilds = [listItem._uid, ...allChilds, ...pageUpdated.newIds];
    } else if (element.children && element.children.length > 0) {
      const componentStates = { ...states["dropdown"] };
      listItem.states = componentStates;
      listItem.type = "component";

      listItemLink.onClick = {
        key: ["openDropdown"],
        type: "Dropdown",
        value: "![key]",
      };

      const dropDownContent = await createDropDown(
        state,
        document,
        listItem.className
      );
      listItem.childNodes.push(dropDownContent._uid);
      dropDownContent.parent = listItem._uid;

      const list_unique_id = uuid();

      const list = {
        _uid: list_unique_id,
        tagName: "ul",
        name: "List",
        type: "texts",
        layout: "menu",
        nodeValue: "",
        childNodes: [],
        menus: element.children,
        className: "sub-menu",
        selector: parentElemet.selector + " .sub-menu",
      };
      listItem.nestedMenuId = list_unique_id;

      dropDownContent.childNodes = [list_unique_id];
      list.parent = dropDownContent._uid;
      await updateData(state.page._id, dropDownContent);
      const pageUpdated = await createMenuItem(
        {},
        list,
        false,
        null,
        "",
        state
      );
      if (pageUpdated)
        allChilds = [listItem._uid, ...allChilds, ...pageUpdated.newIds];
    } */

/* await updateData(state.page._id, listItemLink);
    await updateData(state.page._id, listItem);

    allChilds = [...allChilds, ...listItem.childNodes];
  }

  const deletChild = async (uid) => {
    let child = await getData(state.page._id, uid);

    if (child) {
      await deleteData(state.page._id, child._uid);
      await onDeleteElement(child, state.page._id);

      if (child.dropdownId) {
        await deletChild(child.dropdownId);
      }
    }

    return child;
  };

  for (let i = 0; i < deletedChilds.length; i++) {
    const child = deletChild(deletedChilds[i]);
    if (child)
      parentElemet.childNodes = parentElemet.childNodes.filter(
        (_uid) => _uid !== child._uid
      );
  }

  await updateData(state.page._id, parentElemet);

  allChilds = [parentElemet._uid, ...allChilds];

  const id = nanoid(4);

  return {
    pos: pos,
    allUpdate: id,
    newIds: allChilds,
  };
}; */

export const createMenuItem = async (
  tag,
  parentElement,
  addToAbove,
  currentUid,
  pos,
  state,
  document
) => {
  const menus = parentElement.menus || [];
  let allChilds = [];
  let deletedChilds = parentElement.childNodes || [];

  for (const [i, element] of menus.entries()) {
    const listItemUniqueId = uuid();
    let listItem = await getData(state.page._id, element.childId);
    deletedChilds = deletedChilds.filter((_uid) => _uid !== element.childId);
    let listItemLink;
    let dropdown;

    const createListItemLink = () => {
      const listLinkUniqueId = uuid();
      return {
        _uid: listLinkUniqueId,
        tagName: "a",
        name: `Menu Item Link ${i + 1}`,
        type: "texts",
        layout: "link",
        className: "ac-menu-link",
        selector: `${parentElement.selector} .ac-menu-link`,
        nodeValue: element.title,
        attributes: {
          href: { key: "href", value: `'${element.link}'` },
          target: { key: "target", value: `'${element.target}'` },
        },
        childNodes: [],
        parent: listItemUniqueId,
      };
    };

    if (!listItem) {
      listItemLink = createListItemLink();

      listItem = {
        _uid: listItemUniqueId,
        tagName: "li",
        name: `Menu Item ${i + 1}`,
        type: "texts",
        layout: "text",
        className: "ac-menu-item",
        selector: `${parentElement.selector} .ac-menu-item`,
        nodeValue: "",
        childNodes: [listItemLink._uid],
        parent: parentElement._uid,
        listItemLink: listItemLink._uid,
      };

      parentElement.childNodes.push(listItemUniqueId);
    } else {
      if (!listItem.listItemLink) {
        listItemLink = createListItemLink();
        listItem.childNodes.push(listItemLink._uid);
        listItemLink.parent = listItem._uid;
        listItem.listItemLink = listItemLink._uid;
      } else {
        listItemLink = await getData(state.page._id, listItem.listItemLink);
        listItemLink.nodeValue = element.title;
        listItemLink.attributes = {
          href: { key: "href", value: `'${element.link}'` },
          target: { key: "target", value: `'${element.target}'` },
        };
      }
    }

    dropdown = await getData(state.page._id, listItem.dropdownId);

    if (element.dropdown) {
      const componentStates = { ...states["dropdown"] };
      listItem = {
        ...listItem,
        states: listItem.states || componentStates,
        type: "component",
        cname: "Dropdown",
      };

      if (dropdown) {
        listItem.childNodes = [dropdown._uid, dropdown.dropdownId];
        dropdown.childNodes = [listItemLink._uid];

        listItemLink.parent = dropdown._uid;

        listItem.dropdownId = dropdown._uid;
        dropdown.parent = listItem._uid;
        await updateData(state.page._id, dropdown);
      } else {
        const dropdownWrapperUniqueId = uuid();
        const randomId = nanoid(4);
        const className = `ac-elem-${randomId}`;

        const dropdownWrapper = {
          _uid: dropdownWrapperUniqueId,
          tagName: "div",
          name: "DropDown Wrapper",
          type: "layouts",
          layout: "layout",
          childNodes: [listItemLink._uid],
          onClick: {
            key: ["openDropdown"],
            type: "Dropdown-" + listItem._uid,
            value: "![key]",
          },
          className: className,
          selector: `${parentElement.className} .${className}`,
          parent: listItem._uid,
        };
        const dropDownContent = await createDropDown(
          state,
          document,
          listItem.className
        );

        listItemLink.parent = dropdownWrapperUniqueId;

        dropDownContent.parent = listItem._uid;
        listItem.childNodes = [dropdownWrapperUniqueId, dropDownContent._uid];

        listItem.dropdownId = dropdownWrapperUniqueId;
        dropdownWrapper.dropdownId = dropDownContent._uid;

        await addCSS(document, {}, dropdownWrapper, state.page._id);
        await updateData(state.page._id, dropdownWrapper);
      }
    } else if (dropdown) {
      dropdown.childNodes = [];
      listItem.dropdownId = dropdown._uid;
      await updateData(state.page._id, dropdown);
      delete listItem.type;
      delete listItem.cname;

      listItemLink.parent = listItem._uid;
      listItem.childNodes = [listItemLink._uid];
    }

    await updateData(state.page._id, listItemLink);
    await updateData(state.page._id, listItem);

    allChilds = [...allChilds, listItem._uid, ...listItem.childNodes];
  }

  const deleteChild = async (uid) => {
    const child = await getData(state.page._id, uid);
    if (child) {
      await onDeleteElement(child, state.page._id);
    }
    return child;
  };

  for (const uid of deletedChilds) {
    const child = await deleteChild(uid);
    if (child) {
      parentElement.childNodes = parentElement.childNodes.filter(
        (_uid) => _uid !== child._uid
      );
    }
  }

  await updateData(state.page._id, parentElement);

  allChilds = [parentElement._uid, ...allChilds];

  return { pos, allUpdate: nanoid(4), newIds: allChilds };
};

// Function to create a GoToTop button
const createGoToTop = async (state, document) => {
  // Copy the states for the 'gototop' component
  const componentStates = { ...states["gototop"] };

  // Generate a unique id for the button
  const id = nanoid(4);
  const className = "ac" + "-gototop-" + id;

  // Generate a unique id for the button
  const unique_id = uuid();

  // Define the button properties
  const button = {
    _uid: unique_id,
    tagName: "button",
    name: "GoToTop",
    cname: "GoToTop",
    type: "component",
    layout: "gototop",
    nodeValue: "Go to Top",
    childNodes: [],
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  // Define the CSS properties for the button
  const properties = {
    position: { value: "fixed" },
    bottom: { value: "20px" },
    right: { value: "20px" },
    padding: { value: "20px" },
    border: { value: "none" },
    "border-radius": { value: "50%", unit: "%" },
    "background-color": { value: "#333" },
    color: { value: "#fff" },
    "font-size": { value: "16px" },
    cursor: { value: "pointer" },
    "z-index": { value: "1000" },
  };

  // Add the CSS to the document
  await addCSS(document, properties, button, state.page._id);

  // Update the state with the new button
  await updateData(state.page._id, button);

  // Return the new button
  return button;
};

// Function to create an Observable component
const createObservable = async (state, document) => {
  // Copy the states for the 'observable' component
  const componentStates = { ...states["observable"] };

  // Generate a unique id for the component
  const id = nanoid(4);
  const className = "ac" + "-observable-" + id;

  // Generate a unique id for the component
  const unique_id = uuid();

  // Define the component properties
  const wrapperElement = {
    _uid: unique_id,
    tagName: "div",
    name: "Observable",
    cname: "Observable",
    type: "component",
    layout: "observable",
    nodeValue: "",
    childNodes: [],
    className: className,
    selector: "." + className,
    states: componentStates,
  };

  // Define the CSS properties for the component
  const properties = {
    position: { value: "relative" },
  };
  // Add the CSS to the document
  await addCSS(document, properties, wrapperElement, state.page._id);
  // Update the state with the new component
  await updateData(state.page._id, wrapperElement);

  // Return the new component
  return wrapperElement;
};

// Define the states for the components
const states = {
  global: {
    currentIndex: {
      key: "currentIndex",
      defaultValue: 0,
      type: "number",
      min: 0,
      max: 0,
    },
    total: { key: "total", defaultValue: 0, type: "number", min: 0, max: 0 },
  },
  slider: {
    items: {
      key: "items",
      defaultValue: "0",
      states: [],
      text: "Slider",
      type: "array",
    },
    type: {
      key: "type",
      defaultValue: "slide",
      type: "dropdown",
      values: ["slide", "fade"],
    },
    numColumns: { key: "numColumns", defaultValue: 1, type: "number" },
    moveColumns: { key: "moveColumns", defaultValue: 1, type: "number" },
    space: {
      key: "space",
      defaultValue: 0.1,
      step: 0.1,
      min: 0,
      max: 5,
      type: "slider",
    },
    centered: { key: "centered", defaultValue: false, type: "boolean" },
    loop: { key: "loop", defaultValue: true, type: "boolean" },
    autoPlay: { key: "autoPlay", defaultValue: false, type: "boolean" },
    interval: { key: "interval", defaultValue: 2000, type: "number" },
    hoverStop: { key: "hoverStop", defaultValue: false, type: "boolean" },
    duration: { key: "duration", defaultValue: 300, type: "number" },
    activeItem: { key: "activeItem", defaultValue: null, type: "node" },
  },
  tabs: {
    duration: { key: "duration", defaultValue: 300, type: "number" },

    items: {
      key: "items",
      defaultValue: "0",
      states: [],
      text: "Tab",
      type: "array",
    },
  },
  accordion: {
    duration: { key: "duration", defaultValue: 300, type: "number" },

    items: {
      key: "items",
      defaultValue: "0",
      states: [],
      text: "Accordion",
      type: "array",
    },
  },
  gallery: {
    items: {
      key: "items",
      defaultValue: "0",
      states: [],
      text: "Gallery Item",
      type: "array",
    },
    activeItem: { key: "activeItem", defaultValue: null, type: "node" },
    modal: { key: "modal", defaultValue: false, type: "boolean" },
  },
  modal: {
    openModal: { key: "openModal", defaultValue: "close", type: "text" },
    type: {
      key: "type",
      defaultValue: "fade",
      type: "dropdown",
      values: ["fade", "slideRight", "slideLeft", "slideTop", "slideBottom"],
    },
    zIndex: { key: "zIndex", defaultValue: 1000, type: "number" },
    closable: { key: "closable", defaultValue: false, type: "boolean" },
    duration: { key: "duration", defaultValue: 300, type: "number" },
  },
  dropdown: {
    openDropdown: { key: "openDropdown", defaultValue: 0, type: "boolean" },
    type: {
      key: "type",
      defaultValue: "fade",
      type: "dropdown",
      values: ["fade", "expandRight", "expandBottom"],
    },
    expandable: { key: "expandable", defaultValue: 0, type: "boolean" },
    initialValue: { key: "initialValue", defaultValue: "200px", type: "text" },
    expandValue: { key: "expandValue", defaultValue: "400px", type: "text" },
    openSide: {
      key: "openSide",
      defaultValue: "topLeft",
      type: "dropdown",
      values: ["topRight", "topLeft", "bottomLeft", "bottomRight"],
    },
    leftOffset: { key: "leftOffset", defaultValue: "15px", type: "text" },
    topOffset: { key: "topOffset", defaultValue: "50px", type: "text" },
    duration: { key: "duration", defaultValue: 300, type: "number" },
  },
  sider: {
    openSider: { key: "openSider", defaultValue: false, type: "boolean" },
    siderStatus: { key: "siderStatus", defaultValue: "close", type: "text" },
    type: {
      key: "type",
      defaultValue: "expandRight",
      type: "dropdown",
      values: ["expandRight", "expandBottom"],
    },
    initialValue: { key: "initialValue", defaultValue: "200px", type: "text" },
    expandValue: { key: "expandValue", defaultValue: "400px", type: "text" },
    duration: { key: "duration", defaultValue: 300, type: "number" },
  },
  gototop: {
    type: {
      key: "type",
      defaultValue: "fade",
      type: "dropdown",
      values: ["fade"],
    },
    duration: { key: "duration", defaultValue: 300, type: "number" },
  },
  observable: {
    tagName: {
      key: "tagName",
      defaultValue: "div",
      type: "dropdown",
      values: ["div", "button", "span"],
    },

    onScroll: { key: "onScroll", defaultValue: 0, type: "boolean" },
    scrollTop: { key: "scrollTop", defaultValue: 50, type: "number" },
    scrollLeft: { key: "scrollLeft", defaultValue: 100, type: "number" },
    scrollTopValue: { key: "scrollTopValue", defaultValue: "", type: "text" },
    scrollLeftValue: { key: "scrollLeftValue", defaultValue: "", type: "text" },
    upatedTopValue: { key: "upatedTopValue", defaultValue: "", type: "text" },
    upatedLeftValue: { key: "upatedLeftValue", defaultValue: "", type: "text" },

    onVisible: { key: "onVisible", defaultValue: 0, type: "boolean" },
    calculateVisibility: {
      key: "calculateVisibility",
      defaultValue: 0,
      type: "boolean",
    },

    threshold: {
      key: "threshold",
      defaultValue: 0.1,
      step: 0.1,
      min: 0,
      max: 1,
      type: "slider",
    },
    visibleY: { key: "visibleY", defaultValue: 0, type: "number" },
    oneTime: { key: "oneTime", defaultValue: 0, type: "boolean" },
    updatedVisibleValue: {
      key: "updatedVisibleValue",
      defaultValue: "",
      type: "text",
    },
    visibleValue: { key: "visibleValue", defaultValue: "", type: "text" },
    inVisibleValue: { key: "inVisibleValue", defaultValue: "", type: "text" },
  },
  menu: {
    items: {
      key: "items",
      type: "array",
      defaultValue: "",
      states: [],
      text: "Menu Item",
    },
  },
};

// Function to get a component based on its type
const getComponent = async (tag, state, document) => {
  switch (tag.component) {
    case "menu":
      return await createMenu(tag, state, document);
    case "flex":
      return await createFlex(state, document);
    case "grid":
      return await createGrid(state, document);
    case "container":
      return await createContainer(state, document);
    case "slider":
      return await createSlider(state, document);
    case "tabs":
      return await createTabs(state, document);
    case "accordion":
      return await createAccordion(state, document);
    case "gallery":
      return await createGallery(state, document);
    case "modal":
      return await createModalTrigger(state, document);
    case "sider":
      return await createSider(state, document);
    case "dropdown":
      return await createDropdownTrigger(state, document);
    case "gototop":
      return await createGoToTop(state, document);
    case "observable":
      return await createObservable(state, document);
    default:
      return "";
  }
};

// Export the addComponent function
export default addComponent;
