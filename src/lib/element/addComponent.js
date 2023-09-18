import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { deleteData, getData, updateData } from '../db';
import addCSS from './addCSS';

// Function to delete an element and its child elements
export const onDeleteElement = async (currentElement, _id) => {
    if (Array.isArray(currentElement.childNodes)) {
        await Promise.all(
            currentElement.childNodes.map(async _uid => {
                const child = await getData(_id, _uid)
                if (child) {
                    await deleteData(_id, _uid);
                    await onDeleteElement(child, _id);
                }
            })
        );
    }
}

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
}

// Function to get a component based on its type
const getComponent = async (tag, state, document) => {
    switch (tag.component) {
        case 'menu':
            return await createMenu(tag, state, document);
        case 'flex':
            return await createFlex(state, document);
        case 'grid':
            return await createGrid(state, document);
        case 'container':
            return await createContainer(state, document);
        case 'slider':
            return await createSlider(state, document);
        case 'tabs':
            return await createTabs(state, document);
        case 'accordion':
            return await createAccordion(state, document);
        case 'gallery':
            return await createGallery(state, document);
        case 'modal':
            return await createModalTrigger(state, document);
        case 'sider':
            return await createSider(state, document);
        case 'dropdown':
            return await createDropownTrigger(state, document);
        case 'gototop':
            return await createGoToTop(state, document);
        case 'observable':
            return await createObservable(state, document);
        default: 
            return '';
    }
}





// Function to create a menu component
const createMenu = async (tag, state, document) => {
    // Merge global and menu specific states
    const componentStates = { ...states['global'], ...states['menu'] };

    // Generate unique id for the menu
    const menuId = nanoid(8);

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
            "href": {
                "key": "href",
                "value": "'#'",
            },
            "target": {
                "key": "target",
                "value": "'_self'",
            }
        },
        className: "menu-link",
        selector: `.${className} .menu .menu-link`,
    };

    // Create a unique id for the menu item
    const menuItemId = uuid();
    menuItemLink.parent = menuItemId

    // Define the menu item
    const menuItem = {
        _uid: menuItemId,
        tagName: "li",
        name: "Menu Item 1",
        type: "texts",
        layout: "text",
        nodeValue: "",
        childNodes: [menuItemLinkId],
        className: "menu-item",
        selector: `.${className} .menu .menu-item`
    };

    // Create a unique id for the list
    const listId = uuid();
    menuItem.parent = listId

    // Define the list
    const list = {
        _uid: listId,
        tagName: "ul",
        name: "List",
        type: "texts",
        layout: "menu",
        nodeValue: "",
        childNodes: [menuItemId],
        menus: [{
            childId: menuItemId,
            key: '1',
            title: 'Link 1',
            link: '#',
            target: '_self',
            children: [],
        }],
        className: "menu",
        selector: `.${className} .menu`
    };

    // Create a unique id for the wrapper
    const wrapperId = uuid();
    list.parent = wrapperId

    // Define the wrapper element
    const wrapperElement = {
        _uid: wrapperId,
        tagName: tag.tag,
        name: "Menu",
        cname: "Menu",
        type: "component",
        layout: "nav",
        nodeValue: "",
        childNodes: [listId],
        className: className,
        selector: `.${className}`,
        states: componentStates
    };

    // Define the CSS properties for the menu item link
    const menuItemLinkProperties = {
        'color': { value: 'inherit' },
        'text-decoration': { value: 'none' },
    };
    // Add CSS for the menu item link
    await addCSS(document, menuItemLinkProperties, menuItemLink, state.page._id);
    // Update the data for the menu item link
    await updateData(state.page._id, menuItemLink);

    // Define the CSS properties for the menu item
    const menuItemProperties = {
        'margin': { value: '0px' },
        'padding': { value: '5px 10px' },
        'position': { value: 'relative' },
    };
    // Add CSS for the menu item
    await addCSS(document, menuItemProperties, menuItem, state.page._id);
    // Update the data for the menu item
    await updateData(state.page._id, menuItem);

    // Define the CSS properties for the list
    const listProperties = {
        'display': { value: 'flex' },
        'gap': { value: '10px' },
        'list-style-type': { value: 'none' },
    };
    // Add CSS for the list
    await addCSS(document, listProperties, list, state.page._id);
    // Update the data for the list
    await updateData(state.page._id, list);

    // Define the CSS properties for the wrapper
    const wrapperProperties = {}
    // Add CSS for the wrapper
    await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
    // Update the data for the wrapper
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}

const createFlex = async (state, document, childCount = 2) => {
    // Initialize component states
    const componentStates = {};

    // Generate a unique id for the flex component
    const id = nanoid(8);
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
            className: `flex-child-${i + 1}`,
            selector: `.${className} .flex-child-${i + 1}`,
            parent: wrapperUniqueId
        };

        // Push the unique id to childNodes and the child element to childsElement
        childNodes.push(uniqueId);
        childsElement.push(child)
    }

    // Define the wrapper element structure
    const wrapperElement = {
        _uid: wrapperUniqueId,
        tagName: "div",
        name: "FlexBox",
        type: 'component',
        layout: "flex",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: `.${className}`,
        states: componentStates
    };

    // Apply CSS and update data for each child element
    childsElement.forEach(async (child) => {
        const properties = {
            'flex': { value: '1' },
            'padding': { value: '5px' }
        };
        await addCSS(document, properties, child, state.page._id);
        await updateData(state.page._id, child);
    });

    // Define CSS properties for the wrapper element
    const properties = {
        'display': { value: 'flex' }
    };
    // Apply CSS and update data for the wrapper element
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}

// Function to create a grid component
const createGrid = async (state, document, gridItemsCount = 4) => {
    // Initialize component states
    const componentStates = {};

    // Generate a unique id for the grid component
    const id = nanoid(8);
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
            className: `grid-child-${i + 1}`,
            selector: `.${className} .grid-child-${i + 1}`,
            parent: wrapperUniqueId
        };

        // Push the unique id to childNodes and the grid child element to gridChildElements
        childNodes.push(uniqueId);
        gridChildElements.push(gridChild)
    }

    // Define the wrapper element structure
    const wrapperElement = {
        _uid: wrapperUniqueId,
        tagName: 'div',
        name: "Grid",
        cname: "Grid",
        type: "component",
        layout: "grid",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: `.${className}`,
        states: componentStates
    };

    // Apply CSS and update data for each grid child element
    gridChildElements.forEach(async (gridChild) => {
        const childProperties = {
            'padding': { value: '5px' }
        };
        await addCSS(document, childProperties, gridChild, state.page._id);
        await updateData(state.page._id, gridChild);
    });

    // Define CSS properties for the wrapper element
    const wrapperProperties = {
        'display': { value: 'grid' },
        'grid-template-columns': { value: 'repeat(2, 1fr)' },
        'grid-gap': { value: '10px' }
    };
    // Apply CSS and update data for the wrapper element
    await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}


// Function to create a container component
const createContainer = async (state, document) => {
    // Initialize component states
    const componentStates = {};

    // Generate a unique id for the container
    const id = nanoid(8);
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
        states: componentStates
    };

    // Define the CSS properties for the wrapper element
    const wrapperProperties = {
        'max-width': { value: '1200px' },
        'position': { value: 'static' },
        'margin': { value: '0 auto' },
        'padding': { value: '0 15px' },
    }

    // Apply CSS to the wrapper element
    await addCSS(document, wrapperProperties, wrapperElement, state.page._id);

    // Update the data for the wrapper element
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}



// Function to create a Slider component
const createSlider = async (state, document) => {
    // Merge global and slider specific states
    const componentStates = { ...states['global'], ...states['slider'] };

    // Generate a unique id for the slider
    const sliderId = nanoid(8);
    const className = `ac-slider-${sliderId}`;

    // Create a unique slide element
    const slideUniqueId = uuid();
    const slideElement = createSlideElement(slideUniqueId, className);

    // Create a unique slides container
    const slidesContainerUniqueId = uuid();
    const slidesContainerElement = createSlidesContainerElement(slidesContainerUniqueId, slideUniqueId, className);

    // Set parent of slide element
    slideElement.parent = slidesContainerUniqueId;

    // Create navigation buttons for the slider
    const leftButtonUniqueId = uuid();
    const rightButtonUniqueId = uuid();
    const leftButtonElement = createButtonElement(leftButtonUniqueId, className, 'Left', '[key] - 1');
    const rightButtonElement = createButtonElement(rightButtonUniqueId, className, 'Right', '[key] + 1');

    // Create navigation dots for the slider
    const dotUniqueId = uuid();
    const dotsContainerUniqueId = uuid();
    const dotElement = createDotElement(dotUniqueId, className);
    const dotsContainerElement = createDotsContainerElement(dotsContainerUniqueId, dotUniqueId, className);

    // Set parent of dots container
    dotElement.parent = dotsContainerUniqueId;

    // Define child nodes of the slider
    const childNodes = [slidesContainerUniqueId, dotsContainerUniqueId, leftButtonUniqueId, rightButtonUniqueId];

    // Create a unique wrapper for the slider
    const wrapperUniqueId = uuid();
    setParents([leftButtonElement, rightButtonElement, dotsContainerElement, slidesContainerElement], wrapperUniqueId);

    // Create the wrapper element for the slider
    const wrapperElement = createWrapperElement(wrapperUniqueId, className, 'Slider', childNodes, componentStates);

    // Define and apply CSS properties for each element
    await applyCSSAndData(document, state.page._id, [
        { element: slideElement, properties: slideProperties },
        { element: slidesContainerElement, properties: slidesContainerProperties },
        { element: leftButtonElement, properties: leftButtonProperties },
        { element: rightButtonElement, properties: rightButtonProperties },
        { element: dotElement, properties: dotProperties },
        { element: dotsContainerElement, properties: dotsContainerProperties },
        { element: wrapperElement, properties: wrapperProperties }
    ]);

    // Return the wrapper element
    return wrapperElement;
}


// Function to create a Tabs component
const createTabs = async (state, document) => {
    // Merge global and tabs specific states
    const componentStates = { ...states['global'], ...states['tabs'] };

    // Generate a unique id for the tabs component
    const id = nanoid(8);
    const className = `ac-tabs-${id}`;

    // Create unique ids for tab button and tabs button
    const tabButtonId = uuid();
    const tabsButtonId = uuid();

    // Define the structure of a tab button
    const tabButton = createTabButton(tabButtonId, className, tabsButtonId);

    // Define the structure of tabs button
    const tabsButton = createTabsButton(tabsButtonId, className, tabButtonId);

    // Create unique ids for tab content and tabs content
    const tabContentId = uuid();
    const tabsContentId = uuid();

    // Define the structure of a tab content
    const tabContent = createTabContent(tabContentId, className, tabsContentId);

    // Define the structure of tabs content
    const tabsContent = createTabsContent(tabsContentId, className, tabContentId);

    // Create a unique id for the tabs
    const tabsId = uuid();

    // Define the structure of tabs
    const tabs = createTabs(tabsId, className, tabsButtonId, tabsContentId);

    // Create a unique id for the wrapper
    const wrapperId = uuid();

    // Define the structure of the wrapper
    const wrapperElement = createWrapper(wrapperId, className, tabsId, componentStates);

    // Define and apply CSS properties for each element
    await applyCSSAndData(document, state.page._id, [
        { element: tabButton, properties: tabButtonProperties },
        { element: tabsButton, properties: tabsButtonProperties },
        { element: tabContent, properties: tabContentProperties },
        { element: tabsContent, properties: tabsContentProperties },
        { element: tabs, properties: tabsProperties },
        { element: wrapperElement, properties: wrapperProperties }
    ]);

    // Return the wrapper element
    return wrapperElement;
}

// Function to create an Accordion component
const createAccordion = async (state, document) => {
    // Merge global and accordion specific states
    const componentStates = { ...states['global'], ...states['accordion'] };

    // Generate a unique id for the accordion
    const accordionId = nanoid(8);
    const className = `ac-accordion-${accordionId}`;

    // Create unique ids for accordion content and header
    const accordionContentId = uuid();
    const accordionHeaderId = uuid();

    // Define the structure of accordion content and header
    const accordionContent = createAccordionContent(accordionContentId, className);
    const accordionHeader = createAccordionHeader(accordionHeaderId, className, accordionContentId);

    // Create a unique id for the accordion element
    const accordionElementId = uuid();

    // Define the structure of accordion element
    const accordionElement = createAccordionElement(accordionElementId, className, accordionHeaderId, accordionContentId);

    // Set parent of accordion header and content
    setParents([accordionHeader, accordionContent], accordionElementId);

    // Create a unique id for the accordions element
    const accordionsElementId = uuid();

    // Define the structure of accordions element
    const accordionsElement = createAccordionsElement(accordionsElementId, className, accordionElementId);

    // Set parent of accordion element
    accordionElement.parent = accordionsElementId;

    // Create a unique id for the wrapper
    const wrapperId = uuid();

    // Define the structure of the wrapper
    const wrapperElement = createWrapper(wrapperId, className, accordionsElementId, componentStates);

    // Define and apply CSS properties for each element
    await applyCSSAndData(document, state.page._id, [
        { element: accordionHeader, properties: accordionHeaderProperties },
        { element: accordionContent, properties: accordionContentProperties },
        { element: accordionElement, properties: accordionElementProperties },
        { element: accordionsElement, properties: accordionsElementProperties },
        { element: wrapperElement, properties: wrapperProperties }
    ]);

    // Return the wrapper element
    return wrapperElement;
}


// Function to create a Gallery component
const createGallery = async (state, document) => {
    // Merge global and gallery specific states
    const componentStates = { ...states['global'], ...states['gallery'] };

    // Generate a unique id for the gallery
    const galleryId = nanoid(8);
    const className = `ac-gallery-${galleryId}`;

    // Create unique ids for image and gallery item
    const imageUniqueId = uuid();
    const galleryItemUniqueId = uuid();

    // Define the structure of an image
    const imageElement = createImageElement(imageUniqueId, className);

    // Define the structure of a gallery item
    const galleryItemElement = createGalleryItemElement(galleryItemUniqueId, className, imageUniqueId);

    // Set parent of image element
    imageElement.parent = galleryItemUniqueId;

    // Create a unique id for the gallery
    const galleryUniqueId = uuid();

    // Define the structure of gallery
    const galleryElement = createGalleryElement(galleryUniqueId, className, galleryItemUniqueId);

    // Set parent of gallery item
    galleryItemElement.parent = galleryUniqueId;

    // Create a unique id for the wrapper
    const wrapperUniqueId = uuid();

    // Create a modal element
    const modalElement = await createModal(state, document, className, {
        key: ["activeItem"],
        'type': "Gallery",
    });

    // Set parent of modal and gallery elements
    setParents([modalElement, galleryElement], wrapperUniqueId);

    // Define child nodes of the wrapper
    const childNodes = [galleryUniqueId, modalElement._uid];

    // Define the structure of the wrapper
    const wrapperElement = createWrapperElement(wrapperUniqueId, className, 'Gallery', childNodes, componentStates);

    // Update the data for the modal element
    await updateData(state.page._id, modalElement);

    // Define and apply CSS properties for each element
    await applyCSSAndData(document, state.page._id, [
        { element: imageElement, properties: imageProperties },
        { element: galleryItemElement, properties: galleryItemProperties },
        { element: galleryElement, properties: galleryProperties },
        { element: wrapperElement, properties: wrapperProperties }
    ]);

    // Return the wrapper element
    return wrapperElement;
}


// Function to create a Modal Trigger
const createModalTrigger = async (state, document) => {

    // Merge global and modal specific states
    const modalTriggerStates = { ...state.global, ...state.modal };


    // Create unique id for the modal trigger
    const modalTriggerUniqueId = uuid();

    // Define the structure of the modal trigger
    const modalTrigger = {
        _uid: modalTriggerUniqueId,
        tagName: 'button',
        name: 'Modal Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Open Modal',
        childNodes: [],
        className: "modal-trigger",
        selector: `.${className} .modal-trigger`,
        onClick: {
            key: ["openModal"],
            'type': "Modal",
            "value": "'open'",
        },
    }

    // Create a modal element
    const modalElement = await createModal(state, document, className, null);

    // Create unique id for the wrapper
    const wrapperUniqueId = uuid();
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
        states: modalTriggerStates
    };

    // Update the data for the modal element
    await updateData(state.page._id, modalElement);

    // Define CSS properties for the modal trigger
    const modalTriggerProperties = {
        "margin-bottom": {
            value: '10px',
        },
    }
    // Apply CSS properties to the modal trigger
    await addCSS(document, modalTriggerProperties, modalTrigger, state.page._id);

    // Update the data for the modal trigger
    await updateData(state.page._id, modalTrigger);

    // Define CSS properties for the wrapper
    const wrapperProperties = {
        "position": {
            value: 'relative',
        },
        "display": {
            value: 'inline-block',
        },
    }
    // Apply CSS properties to the wrapper
    await addCSS(document, wrapperProperties, wrapperElement, state.page._id);

    // Update the data for the wrapper
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}

// Function to create a Modal
const createModal = async (state, document, className, valueState) => {

    // Generate unique ids for modal elements
    const modalCloseUniqueId = uuid();
    const modalUniqueId = uuid();
    const modalCloserUniqueId = uuid();
    const modalElementUniqueId = uuid();

    // Define the structure of the modal close button
    const modalClose = createModalClose(modalCloseUniqueId, className, modalUniqueId);

    // Define the structure of the modal body
    const modal = createModalBody(modalUniqueId, className, modalCloseUniqueId, valueState);

    // Define the structure of the modal closer
    const modalCloserElement = createModalCloser(modalCloserUniqueId, className, modalElementUniqueId);

    // Define the structure of the modal wrapper
    const modalElement = createModalWrapper(modalElementUniqueId, className, modalUniqueId, modalCloserUniqueId);

    // Set parent-child relationships between modal elements
    setModalParentChildRelationships(modalClose, modal, modalCloserElement, modalElement);

    // Define CSS properties for each modal element
    const modalProperties = getModalProperties();
    const modalCloserProperties = getModalCloserProperties();
    const modalElementProperties = getModalElementProperties();
    const modalCloseProperties = getModalCloseProperties();

    // Apply CSS properties to each modal element
    await applyCSSAndData(document, state.page._id, [
        { element: modal, properties: modalProperties },
        { element: modalCloserElement, properties: modalCloserProperties },
        { element: modalElement, properties: modalElementProperties },
        { element: modalClose, properties: modalCloseProperties }
    ]);

    // Return the modal wrapper element
    return modalElement;
}

// Function to create a Sider component
const createSider = async (state, document) => {

    // Merge global and sider specific states
    const siderStates = { ...states['sider'] };

    // Generate a unique id for the sider
    const id = nanoid(8);
    const className = `ac-sider-${id}`;

    // Create unique ids for sider content and trigger
    const siderContentId = uuid();
    const siderTriggerId = uuid();

    // Define the structure of the sider content
    const siderContent = createSiderContent(siderContentId, className);

    // Define the structure of the sider trigger
    const siderTrigger = createSiderTrigger(siderTriggerId, className);

    // Create a unique id for the wrapper
    const wrapperId = uuid();

    // Set parent of sider content and trigger
    setParents([siderContent, siderTrigger], wrapperId);

    // Define child nodes of the wrapper
    const childNodes = [siderTriggerId, siderContentId];

    // Define the structure of the wrapper
    const wrapperElement = createWrapper(wrapperId, className, 'Sider', childNodes, siderStates);

    // Define CSS properties for each element
    const siderContentProperties = getSiderContentProperties();
    const siderTriggerProperties = getSiderTriggerProperties();
    const wrapperProperties = getWrapperProperties();

    // Apply CSS properties and update data for each element
    await applyCSSAndData(document, state.page._id, [
        { element: siderContent, properties: siderContentProperties },
        { element: siderTrigger, properties: siderTriggerProperties },
        { element: wrapperElement, properties: wrapperProperties }
    ]);

    // Return the wrapper element
    return wrapperElement;
}

// Function to create a Dropdown Trigger
const createDropdownTrigger = async (state, document) => {

    // Merge global and dropdown specific states
    const dropdownStates = { ...states['dropdown'] };

    // Generate a unique id for the dropdown
    const dropdownId = nanoid(8);
    const dropdownClassName = `ac-dropdown-${dropdownId}`;

    // Create unique id for the dropdown trigger
    const dropdownTriggerId = uuid();

    // Define the structure of the dropdown trigger
    const dropdownTrigger = {
        _uid: dropdownTriggerId,
        tagName: 'button',
        name: 'Dropdown Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Dropdown Button',
        childNodes: [],
        className: "dropdown-trigger",
        selector: `.${dropdownClassName} .dropdown-trigger`,
        onClick: {
            key: ["openDropdown"],
            'type': "Dropdown",
            "value": "![key]",
        },
    }

    // Create a dropdown content
    const dropdownContent = await createDropDown(state, document, dropdownClassName);

    // Create unique id for the wrapper
    const wrapperId = uuid();
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
        states: dropdownStates
    };

    // Update the data for the dropdown content
    await updateData(state.page._id, dropdownContent);

    // Define CSS properties for the dropdown trigger
    const dropdownTriggerProperties = {
        "padding": {
            value: '8px 16px',
        },
        "background-color": {
            value: '#f2f2f2',
        },
        "border": {
            value: '1px solid #ccc',
        },
        "cursor": {
            value: 'pointer',
        },
    }
    // Apply CSS properties to the dropdown trigger
    await addCSS(document, dropdownTriggerProperties, dropdownTrigger, state.page._id);

    // Update the data for the dropdown trigger
    await updateData(state.page._id, dropdownTrigger);

    // Define CSS properties for the wrapper
    const wrapperProperties = {
        'position': {
            value: 'relative'
        },
        'display': {
            value: 'inline-block'
        },
    }
    // Apply CSS properties to the wrapper
    await addCSS(document, wrapperProperties, wrapperElement, state.page._id);
    // Update the data for the wrapper
    await updateData(state.page._id, wrapperElement);

    // Return the wrapper element
    return wrapperElement;
}

// Function to create a Dropdown Content
const createDropDown = async (state, document, dropdownClassName) => {

    const dropdownContentId = uuid();

    const dropDownContent = {
        _uid: dropdownContentId,
        tagName: 'div',
        name: 'Dropdown Content',
        type: 'layouts',
        layout: 'dropdown',
        nodeValue: '',
        childNodes: [],

        className: "dropdown-content",
        selector: `.${dropdownClassName} .dropdown-content`

    }

    // Define CSS properties for the dropdown content
    const dropdownContentProperties = {
        'padding': {
            value: '5px'
        },
        'margin': {
            value: 0
        },
        'background-color': {
            value: '#fff'
        },
        'border': {
            value: '1px solid #ccc'
        },
        'border-top': {
            value: 'none'
        }
    }

    // Apply CSS properties to the dropdown content
    await addCSS(document, dropdownContentProperties, dropDownContent, state.page._id);

    // Update the data for the dropdown content
    await updateData(state.page._id, dropDownContent);

    // Return the dropdown content
    return dropDownContent;
}

// Function to create a menu item
export const createMenuItem = async (
    tag,
    parentElement,
    addToAbove,
    currentUid,
    position,
    state
) => {

    // Extract menus from the parent element or default to an empty array
    const menus = parentElement.menus || [];

    // Initialize allChilds and deletedChilds arrays
    let allChilds = [];
    let deletedChilds = parentElement.childNodes || [];

    // Process menus and update allChilds array
    allChilds = await processMenus(menus, allChilds, deletedChilds, parentElement, state);

    // Delete unused children
    await deleteUnusedChilds(deletedChilds, parentElement, state);

    // Update the data for the parent element
    await updateData(state.page._id, parentElement);

    // Generate a unique id
    const id = nanoid(8);

    // Return an object containing position, allUpdate and newIds
    return {
        position: position,
        allUpdate: id,
        newIds: allChilds,
    };
};

// Function to process menus
const processMenus = async (menus, allChilds, deletedChilds, parentElement, state) => {
    // Loop through each menu
    for (let i = 0; i < menus.length; i++) {
        const element = menus[i];

        // Generate a unique id for the list item
        const listItemUniqueId = uuid();

        // Get data for the list item
        let listItem = await getData(state.page._id, element.childId);

        // Filter out the current child id from the deletedChilds array
        deletedChilds = deletedChilds.filter(_uid => _uid !== element.childId)

        // Create a list item link
        let listItemLink = await createListItemLink(listItem, element, parentElement, listItemUniqueId, i, state);

        // Create a list item
        listItem = await createListItem(listItem, listItemLink, element, parentElement, listItemUniqueId, i, state);

        // Process nested menu and update allChilds array
        allChilds = await processNestedMenu(listItem, element, parentElement, state, allChilds);

        // Update the data for the list item link and list item
        await updateData(state.page._id, listItemLink);
        await updateData(state.page._id, listItem);

        // Update allChilds array with child nodes of the list item
        allChilds = [...allChilds, ...listItem.childNodes]
    }
    // Return allChilds array
    return allChilds;
}

// Function to process nested menu
const processNestedMenu = async (listItem, element, parentElement, state, allChilds) => {
    // Check if the list item has a nested menu id
    if (listItem.nestedMenuId) {
        // Get data for the parent
        let parent = await getData(state.page._id, listItem.nestedMenuId);

        // Create a menu item
        const pageUpdated = await createMenuItem({}, parent, false, null, "", state);

        // If pageUpdated is true, update allChilds array
        if (pageUpdated)
            allChilds = [listItem._uid, ...allChilds, ...pageUpdated.newIds]
    }
    // If the element has children, create a nested menu
    else if (element.children && element.children.length > 0) {
        listItem = await createNestedMenu(listItem, element, parentElement, state, document);
    }
    // Return allChilds array
    return allChilds;
}

// Function to delete unused children
const deleteUnusedChilds = async (deletedChilds, parentElement, state) => {
    // Loop through each child in deletedChilds array
    for (let i = 0; i < deletedChilds.length; i++) {
        // Get data for the child
        let child = await getData(state.page._id, deletedChilds[i]);

        // If child exists, delete the child and update parentElement's childNodes array
        if (child) {
            await deleteData(state.page._id, child._uid);
            await onDeleteElement(child, state.page._id)
            parentElement.childNodes = parentElement.childNodes.filter(_uid => _uid !== child._uid);
        }
    }
}

// Function to create a list item
const createListItem = async (listItem, listItemLink, element, parentElement, listItemUniqueId, i, state) => {
    // If listItem does not exist, create a new list item
    if (!listItem) {
        listItem = {
            _uid: listItemUniqueId,
            tagName: "li",
            name: `Menu Item ${i + 1}`,
            type: "texts",
            layout: "text",
            nodeValue: "",
            childNodes: [listItemLink._uid],
            className: "menu-item",
            selector: `${parentElement.selector} .menu-item`,
        };

        // Set parent of listItemLink to listItemUniqueId
        listItemLink.parent = listItemUniqueId;
    } else {
        // If listItem exists, add the listItemLink to the childNodes and set the parent of listItemLink
        listItem.childNodes.push(listItemLink._uid);
        listItemLink.parent = listItemUniqueId;
    }
    // Return the updated or new listItem
    return listItem;
};

// Function to create a list item link
const createListItemLink = async (listItem, element, parentElement, listItemUniqueId, i, state) => {
    let listItemLink;
    const listItemLinkUniqueId = uuid();

    if (!listItem) {
        listItemLink = await createNewListItemLink(element, parentElement, listItemLinkUniqueId, i);
    } else {
        listItemLink = await updateExistingListItemLink(listItem, element, parentElement, listItemLinkUniqueId, i, state);
    }
    return listItemLink;
}

// Function to create a new list item link
// This function takes in the element data, the parent element, a unique id for the list item link, and the index.
// It creates a new list item link with the provided data.
const createNewListItemLink = async (element, parentElement, listItemLinkUniqueId, i) => {
    let listItemLink = {
        _uid: listItemLinkUniqueId,
        tagName: "a",
        name: `Menu Item Link ${i + 1}`,
        type: "texts",
        layout: "link",
        childNodes: [],
        className: "menu-link",
        selector: `${parentElement.selector} .menu-link`,
        nodeValue: element.title,
        attributes: {
            href: {
                key: "href",
                value: `'${element.link}'`,
            },
            target: {
                key: "target",
                value: `'${element.target}'`,
            },
        }
    };
    return listItemLink;
}

// Function to update an existing list item link
const updateExistingListItemLink = async (listItem, element, parentElement, listItemLinkUniqueId, i, state) => {
    let listItemLink;

    if (!listItem.childNodes[0]) {
        listItemLink = {
            _uid: listItemLinkUniqueId,
            tagName: "a",
            name: `Menu Item Link ${i + 1}`,
            type: "texts",
            layout: "link",
            childNodes: [],
            className: "menu-link",
            selector: `${parentElement.selector} .menu-link`,
        };

        listItem.childNodes.push(listItemLinkUniqueId);
        listItemLink.parent = listItem._uid;
    }
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
    }

    return listItemLink;
}



// Function to create a GoToTop button
const createGoToTop = async (state, document) => {
    // Copy the states for the 'gototop' component
    const componentStates = { ...states['gototop'] };

    // Generate a unique id for the button
    const id = nanoid(8);
    const className = "ac" + "-gototop-" + id;

    // Generate a unique id for the button
    const unique_id = uuid();

    // Define the button properties
    const button = {
        _uid: unique_id,
        tagName: 'button',
        name: 'GoToTop',
        cname: 'GoToTop',
        type: 'component',
        layout: "gototop",
        nodeValue: 'Go to Top',
        childNodes: [],
        className: className,
        selector: "." + className,
        states: componentStates
    }

    // Define the CSS properties for the button
    const properties = {
        'position': { value: 'fixed' },
        'bottom': { value: '20px' },
        'right': { value: '20px' },
        'padding': { value: '20px' },
        'border': { value: 'none' },
        'border-radius': { value: '50%' },
        'background-color': { value: '#333' },
        'color': { value: '#fff' },
        'font-size': { value: '16px' },
        'cursor': { value: 'pointer' },
        'z-index': { value: '1000' },
    }

    // Add the CSS to the document
    await addCSS(document, properties, button, state.page._id);

    // Update the state with the new button
    await updateData(state.page._id, button);

    // Return the new button
    return button;
}

// Function to create an Observable component
const createObservable = async (state, document) => {
    // Copy the states for the 'observable' component
    const componentStates = { ...states['observable'] };

    // Generate a unique id for the component
    const id = nanoid(8);
    const className = "ac" + "-observable-" + id;

    // Generate a unique id for the component
    const unique_id = uuid();

    // Define the component properties
    const wrapperElement = {
        _uid: unique_id,
        tagName: 'div',
        name: 'Observable',
        cname: 'Observable',
        type: 'component',
        layout: "observable",
        nodeValue: '',
        childNodes: [],
        className: className,
        selector: "." + className,
        states: componentStates
    }

    // Define the CSS properties for the component
    const properties = {
        'position': { value: 'relative' },
    }
    // Add the CSS to the document
    await addCSS(document, properties, wrapperElement, state.page._id);
    // Update the state with the new component
    await updateData(state.page._id, wrapperElement);

    // Return the new component
    return wrapperElement;
}

// Define the states for the components
const states = {
    global: {
        currentIndex: { key: 'currentIndex', defaultValue: 0, type: 'number', min: 0, max: 0 },
        total: { key: 'total', defaultValue: 0, type: 'number', min: 0, max: 0 },
    },
    slider: {
        items: { key: 'items', defaultValue: "0", states: [], text: "Slider", type: 'array' },
        type: { key: 'type', defaultValue: 'slide', type: 'dropdown', values: ['slide', 'fade'] },
        numColumns: { key: 'numColumns', defaultValue: 1, type: 'number' },
        moveColumns: { key: 'moveColumns', defaultValue: 1, type: 'number' },
        space: { key: 'space', defaultValue: 0.1, step: 0.1, min: 0, max: 5, type: 'slider' },
        centered: { key: 'centered', defaultValue: false, type: 'boolean' },
        loop: { key: 'loop', defaultValue: true, type: 'boolean' },
        autoPlay: { key: 'autoPlay', defaultValue: false, type: 'boolean' },
        interval: { key: 'interval', defaultValue: 2000, type: 'number' },
        hoverStop: { key: 'hoverStop', defaultValue: false, type: 'boolean' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
        activeItem: { key: 'activeItem', defaultValue: null, type: 'node' },
    },
    tabs: {
        items: { key: 'items', defaultValue: "0", states: [], text: "Tab", type: 'array' },
    },
    accordion: {
        items: { key: 'items', defaultValue: "0", states: [], text: "Accordion", type: 'array' },
    },
    gallery: {
        items: { key: 'items', defaultValue: "0", states: [], text: "Gallery Item", type: 'array' },
        openModal: { key: 'openModal', defaultValue: 0, type: 'boolean' },
        activeItem: { key: 'activeItem', defaultValue: null, type: 'node' },
        modal: { key: 'modal', defaultValue: false, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    modal: {
        openModal: { key: 'openModal', defaultValue: 'close', type: 'text' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade', 'slideRight', 'slideLeft', 'slideTop', 'slideBottom'] },
        zIndex: { key: 'zIndex', defaultValue: 1000, type: 'number' },
        closable: { key: 'closable', defaultValue: false, type: 'boolean' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    dropdown: {
        openDropdown: { key: 'openDropdown', defaultValue: 0, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade', 'expandRight', 'expandBottom'] },
        expandable: { key: 'expandable', defaultValue: 0, type: 'boolean' },
        intialValue: { key: 'intialValue', defaultValue: '200px', type: 'text' },
        expandValue: { key: 'expandValue', defaultValue: '400px', type: 'text' },
        openSide: { key: 'openSide', defaultValue: "topLeft", type: 'dropdown', values: ['topRight', 'topLeft', 'bottomLeft', 'bottomRight'] },
        leftOffset: { key: 'leftOffset', defaultValue: '15px', type: 'text' },
        topOffset: { key: 'topOffset', defaultValue: '50px', type: 'text' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    sider: {
        openSider: { key: 'openSider', defaultValue: 0, type: 'boolean' },
        type: { key: 'type', defaultValue: 'expandRight', type: 'dropdown', values: ['expandRight', 'expandBottom'] },
        intialValue: { key: 'intialValue', defaultValue: '200px', type: 'text' },
        expandValue: { key: 'expandValue', defaultValue: '400px', type: 'text' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    gototop: {
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    observable: {
        tagName: { key: 'tagName', defaultValue: 'div', type: 'dropdown', values: ['div', 'button'] },
        onScroll: { key: 'onScroll', defaultValue: 0, type: 'boolean' },
        scrollTop: { key: 'scrollTop', defaultValue: 50, type: 'number' },
        scrollLeft: { key: 'scrollLeft', defaultValue: 100, type: 'number' },
        scrollTopClass: { key: 'scrollTopClass', defaultValue: '', type: 'text' },
        scrollLeftClass: { key: 'scrollLeftClass', defaultValue: '', type: 'text' },
        onVisible: { key: 'onVisible', defaultValue: 0, type: 'boolean' },
        visible: { key: 'visible', defaultValue: 0.1, step: 0.1, min: 0, max: 1, type: 'slider' },
        oneTime: { key: 'oneTime', defaultValue: 0, type: 'boolean' },
        visibleClass: { key: 'visibleClass', defaultValue: '', type: 'text' },
        inVisibleClass: { key: 'inVisibleClass', defaultValue: '', type: 'text' },
    },
    menu: {
        items: { key: 'items', type: 'array', defaultValue: "", states: [], text: "Menu Item" },
    }
}

// Export the addComponent function
export default addComponent;