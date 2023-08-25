
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { deleteData, getData, storeData, updateData } from '../db';
import addCSS from './addCSS';


export const onDeleteElement = async (currentElement, _id) => {

    if (Array.isArray(currentElement.childNodes))
        await Promise.all(
            currentElement.childNodes.map(async _uid => {
                const child = await getData(_id, _uid)
                if (child) {
                    await deleteData(_id, _uid);
                    await onDeleteElement(child, _id);
                }
            }));
}


export const generateElementStyle = (selector, properties) => ({
    normal: {
        [selector]: {
            selectorText: selector,
            properties: { ...properties },
        },
    },
});


const addComponent = async (tag, state, document) => {


    try {

        return getComponent(tag, state, document);

    } catch (e) {

        throw new Error(e?.message);
    }

}


const getComponent = async (tag, state, document) => {

    switch (tag.component) {
        case 'menu':
            return await createMenu(tag, state, document);

            break;
        case 'flex':
            return await createFlex(state, document);
            break;
        case 'grid':
            return await createGrid(state, document);
            break;
        case 'container':
            return await createContainer(state, document);
            break;
        case 'slider':
            return await createSlider(state, document);
            break;
        case 'tabs':
            return await createTabs(state, document);
        case 'accordion':
            return await createAccordion(state, document);
            break;
        case 'gallery':
            return await createGallery(state, document);
            break;
        case 'modal':
            return await createModalTrigger(state, document);
            break;
        case 'sider':
            return await createSider(state, document);
            break;
        case 'dropdown':
            return await createDropDownTrigger(state, document);
            break;
        case 'gototop':
            return await createGoToTop(state, document);
            break;
        case 'observable':
            return await createObservable(state, document);
            break;
        case 'searchable':
            return await createSearchable(state, document);
            break;
        default: return ''
    }
}





const createMenu = async (tag, state, document) => {

    const componentStates = { ...states['global'], ...states['menu'] };


    let id = nanoid(8);

    const className = "ac" + "-menu-" + id;

    const list_item_link_unique_id = uuid();

    const listItemLink = {
        _uid: list_item_link_unique_id,
        tagName: "a",
        name: "Menu Item Link 1",
        type: "texts",
        layout: "link",
        nodeValue: "Link 1",
        childNodes: [],
        attributes: {
            "href": {
                "key": "href",
                "value": "#",
            },
            "target": {
                "key": "target",
                "value": "_self",
            }
        },
        className: "menu-link",
        selector: "." + className + " .menu .menu-link",


    };


    const list_item_unique_id = uuid();
    listItemLink.parent = list_item_unique_id
    const listItem = {
        _uid: list_item_unique_id,
        tagName: "li",
        name: "Menu Item 1",
        type: "texts",
        layout: "text",
        nodeValue: "",
        childNodes: [list_item_link_unique_id],
        className: "menu-item",
        selector: "." + className + " .menu .menu-item"
    };

    const list_unique_id = uuid();
    listItem.parent = list_unique_id

    const list = {
        _uid: list_unique_id,
        tagName: "ul",
        name: "List",
        type: "texts",
        layout: "menu",
        nodeValue: "",
        childNodes: [list_item_unique_id],
        menus: [{
            childId: list_item_unique_id,
            key: '1',
            title: 'Link 1',
            link: '#',
            target: '_self',
            children: [],
        }],
        className: "menu",
        selector: "." + className + " .menu"
    };


    const childNodes = [list_unique_id]
    const wrraper_unique_id = uuid();
    list.parent = wrraper_unique_id

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: tag.tag,
        name: "Menu",
        cname: "Menu",

        type: "component",
        layout: "nav",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    let properties = {
        'color': { value: 'inherit' },
        'text-decoration': { value: 'none' },
    }
    await addCSS(document,
        properties, listItemLink, state.page._id);
    await updateData(state.page._id, listItemLink);

    properties = {
        'margin': { value: '0px' },
        'padding': { value: '5px 10px' },
        'position': { value: 'relative' },
    }
    await addCSS(document, properties, listItem, state.page._id);

    await updateData(state.page._id, listItem);

    properties = {
        'display': { value: 'flex' },
        'gap': { value: '10px' },
        'list-style-type': { value: 'none' },
    }
    await addCSS(document, properties, list, state.page._id);

    await updateData(state.page._id, list);

    properties = {}
    await addCSS(document, properties, wrapperElement, state.page._id);

    await updateData(state.page._id, wrapperElement);

    return wrapperElement;



}

const createFlex = async (state, document, childs = 2) => {

    const componentStates = {};

    let id = nanoid(8);
    const className = "ac" + "-flex-" + id;

    const childItem = {
        tagName: "div",
        name: "Flex Child",
        type: "layouts",
        layout: "flex-child",
        childNodes: [],

    };

    const childNodes = [];
    const childsElement = [];

    const wrraper_unique_id = uuid();


    for (let i = 0; i < childs; i++) {
        const unique_id = uuid();

        const child = {
            ...childItem,
            nodeValue: "",
            _uid: unique_id,
            className: "flex-child-" + (i + 1),
            selector: "." + className + " .flex-child-" + (i + 1),
            parent: wrraper_unique_id
        };

        childNodes.push(unique_id);
        childsElement.push(child)
    }



    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "FlexBox",
        name: "Flex",
        type: 'component',
        layout: "flex",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };


    childsElement.forEach(async (child) => {

        let properties = {
            'flex': {
                value: '1'
            },
            'padding': {
                value: '5px'
            }
        }
        await addCSS(document, properties, child, state.page._id);
        await updateData(state.page._id, child);

    })

    const properties = {
        'display': {
            value: 'flex'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;



}

const createGrid = async (state, document, childs = 4) => {
    const componentStates = {};

    let id = nanoid(8);
    const className = "ac" + "-grid-" + id;


    const childItem = {
        tagName: "div",
        name: "Grid Child",
        type: "layouts",
        layout: "grid-child",
        childNodes: [],
    };

    const childNodes = [];
    const childsElement = [];

    const wrraper_unique_id = uuid();


    for (let i = 0; i < childs; i++) {
        const unique_id = uuid();

        const child = {
            ...childItem,
            nodeValue: "",
            _uid: unique_id,
            className: "grid-child-" + (i + 1),
            selector: "." + className + " .grid-child-" + (i + 1),
            parent: wrraper_unique_id
        };

        childNodes.push(unique_id);
        childsElement.push(child)
    }

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: "Grid",
        cname: "Grid",

        type: "component",
        layout: "grid",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    childsElement.forEach(async (child) => {

        let properties = {
            'padding': {
                value: '5px'
            }
        }

        await addCSS(document, properties, child, state.page._id);

        await updateData(state.page._id, child);

    })

    let properties = {
        'display': {
            value: 'grid'
        },
        'grid-template-columns':
        {
            value: 'repeat(2, 1fr)'
        },
        'grid-gap': {
            value: '10px'
        }
    }
    await addCSS(document, properties, wrapperElement, state.page._id);


    await updateData(state.page._id, wrapperElement);

    return wrapperElement;



}



const createContainer = async (state, document) => {

    const componentStates = {};


    let id = nanoid(8);
    const className = "ac" + "-container-" + id;


    const wrraper_unique_id = uuid();

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Container",
        cname: "Container",

        type: "component",
        layout: "container",
        nodeValue: "Container",
        childNodes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    };

    let properties = {
        'max-width': {
            value: '1200px'
        },
        'position': {
            value: 'static'
        },
        'margin-left': {
            value: 'auto'
        },
        'margin-right': {
            value: 'auto'
        },
        'padding-left': {
            value: '15px',
            unit: 'px'
        },
        'padding-right': {
            value: '15px',
            unit: 'px'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);

    await updateData(state.page._id, wrapperElement);


    return wrapperElement;



}



const createSlider = async (state, document) => {

    const componentStates = { ...states['global'], ...states['slider'] };



    let id = nanoid(8);
    const className = "ac" + "-slider-" + id;

    const slide_unique_id = uuid();
    const slideElement = {
        _uid: slide_unique_id,
        tagName: 'div',
        name: 'slide',
        type: 'layouts',
        layout: 'slide',
        nodeValue: '',
        childNodes: [],
        className: "slide",
        selector: "." + className + " .slides .slide"
    }

    const slides_unique_id = uuid();
    const slidesElement = {
        _uid: slides_unique_id,
        tagName: 'div',
        name: 'slides',
        type: 'layouts',
        layout: 'slides',
        nodeValue: '',
        childNodes: [slide_unique_id],
        className: "slides",
        selector: "." + className + " .slides"
    }

    slideElement.parent = slides_unique_id;



    const left_btn_unique_id = uuid();

    const slidesLeftButton = {
        _uid: left_btn_unique_id,
        tagName: 'button',
        name: 'Left',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Left',
        childNodes: [],
     
        onClick: {
            "key": ["currentIndex"],
            'type': "Sider",
            "value": "[key] - 1"
        },
        className: "slider-left-btn",
        selector: "." + className + " .slider-left-btn"

    }

    const right_btn_unique_id = uuid();

    const slidesRightButton = {
        _uid: right_btn_unique_id,
        tagName: 'button',
        name: 'Right',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Right',
      
        onClick: {
            "key": ["currentIndex"],
            'type': "Sider",
            "value": "[key] + 1"
        },
        childNodes: [],
        className: "slider-right-btn",
        selector: "." + className + " .slider-right-btn"

    }


    const slider_dot_unique_id = uuid();

    const slidesDots = {
        _uid: slider_dot_unique_id,
        tagName: 'div',
        name: 'Slide dot',
        type: 'layouts',
        layout: 'div',
     
        onClick: {
            "key": ["currentIndex"],
            'type': "Sider",
            "statetype": "MAPINDEX",
            "value": "[value]"
        },
    
        map: {
            "key": ["items"],
            "type": "Sider"
        },
        childNodes: [],
        nodeValue: '',
        className: "slide-nav-item",
        selector: "." + className + " .slide-nav-item"

    }

    const dots_conatienr_id = uuid();

    const slidesDotsContainer = {
        _uid: dots_conatienr_id,
        tagName: 'div',
        name: 'Slides Dots',
        type: 'layouts',
        layout: 'div',
        childNodes: [slider_dot_unique_id],
        nodeValue: '',
        className: "slider-nav-container",
        selector: "." + className + " .slider-nav-container"

    }
    slidesDots.parent = dots_conatienr_id;
    const childNodes = [slides_unique_id, dots_conatienr_id, left_btn_unique_id, right_btn_unique_id];

    const wrraper_unique_id = uuid();
    slidesLeftButton.parent = wrraper_unique_id;
    slidesRightButton.parent = wrraper_unique_id;
    slidesDotsContainer.parent = wrraper_unique_id;
    slidesElement.parent = wrraper_unique_id;


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
        states: componentStates

    };


    let properties = {
        'height': {
            value: '100%'
        },
    }
    await addCSS(document, properties, slideElement, state.page._id);


    await updateData(state.page._id, slideElement);


    properties = {
        'position': {
            value: 'relative'
        },
        'height': {
            value: '400px',
        },
    }
    await addCSS(document, properties, slidesElement, state.page._id);


    await updateData(state.page._id, slidesElement);


    properties = {
        position: {
            value: 'absolute',
        },
        top: {
            value: '50%',
        },
        left: {
            value: '10px',
        },
        transform: {
            value: 'translateY(-50%)',
        },
    }
    await addCSS(document, properties, slidesLeftButton, state.page._id);

    await updateData(state.page._id, slidesLeftButton);


    properties = {

        position: {
            value: 'absolute',
        },
        top: {
            value: '50%',
        },
        right: {
            value: '10px',
        },
        transform: {
            value: 'translateY(-50%)',
        },
    }
    await addCSS(document, properties, slidesRightButton, state.page._id);

    await updateData(state.page._id, slidesRightButton);



    properties = {

        'width': {
            value: '10px'
        },
        'height': {
            value: '10px'
        },
        'border-radius': {
            value: '50%'
        },
        ' background-color': {
            value: '#ccc;'
        },
        'margin': {
            value: '0 5px'
        },
        'cursor': {
            value: 'pointer'
        },
    }
    await addCSS(document, properties, slidesDots, state.page._id);

    await updateData(state.page._id, slidesDots);


    properties = {

        'position': {
            value: 'absolute'
        },
        'bottom': {
            value: '10px'
        },
        'left': {
            value: '50%'
        },
        'transform': {
            value: 'translateX(-50%)'
        },
        'display': {
            value: 'flex'
        },
    }
    await addCSS(document, properties, slidesDotsContainer, state.page._id);

    await updateData(state.page._id, slidesDotsContainer);


    properties = {

        'position': {
            value: 'relative'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);

    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}


const createTabs = async (state, document) => {

    const componentStates = { ...states['global'], ...states['tabs'] };


    let id = nanoid(8);
    const className = "ac" + "-tabs-" + id;

    const tab_btn_unique_id = uuid();

    const tabButton = {
        _uid: tab_btn_unique_id,
        tagName: 'button',
        name: 'Tab Button',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Tab Button',
        childNodes: [],
      
        onClick: {
            key: ["currentIndex"],
            'type': "Tabs",
            "value": "0"
        },
        className: "tab-btn",
        selector: "." + className + " .tabs-btn .tab-btn"

    }

    const tabs_btn_unique_id = uuid();

    const tabsButton = {
        _uid: tabs_btn_unique_id,
        tagName: 'div',
        name: 'Tabs Button',
        type: 'layouts',
        layout: 'tabs-btn',
        nodeValue: '',
        childNodes: [tab_btn_unique_id],
        className: "tabs-btn",
        selector: "." + className + " .tabs-btn"

    }
    tabButton.parent = tabs_btn_unique_id;

    const tab_content_unique_id = uuid();
    const tabContent = {
        _uid: tab_content_unique_id,
        tagName: 'div',
        name: 'Tab Content',
        type: 'layouts',
        layout: 'tab-content',
        nodeValue: 'Tab Content',
        childNodes: [],

        className: "tab-content",
        selector: "." + className + " .tabs-content .tab-content"

    }

    const tabs_content_unique_id = uuid();
    tabsButton.contentRef = tabs_content_unique_id;

    const tabsContentElement = {
        _uid: tabs_content_unique_id,
        tagName: 'div',
        name: 'Tabs Content',
        type: 'layouts',
        layout: 'tabs-content',
        nodeValue: '',
        childNodes: [tab_content_unique_id],
        className: "tabs-content",
        selector: "." + className + " .tabs-content"

    }
    tabContent.parent = tabs_content_unique_id;
    tabsContentElement.btnRef = tabs_btn_unique_id;

    const tabs_unique_id = uuid();

    const tabs = {
        _uid: tabs_unique_id,
        tagName: 'div',
        name: 'Tabs Body',
        type: 'layouts',
        layout: 'tabs',
        nodeValue: '',
        childNodes: [tabs_btn_unique_id, tabs_content_unique_id],
        className: "tabs",
        selector: "." + className + " .tabs"

    }
    tabs.btnRef = tabs_btn_unique_id;
    tabs.contentRef = tabs_content_unique_id;


    const wrraper_unique_id = uuid();

    tabs.parent = wrraper_unique_id;
    const childNodes = [tabs_unique_id];


    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Tabs",
        cname: "Tabs",

        type: "layouts",
        layout: "tabs",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };


    let properties = {

        border: {
            value: 'none',
        },
        outline: {
            value: 'none',
        },
        "background-color": {
            value: '#f2f2f2',
        },

        padding: {
            value: '10px 20px',
        },
        cursor: {
            value: 'pointer',
        },
    }

    await addCSS(document, properties, tabButton, state.page._id);


    await updateData(state.page._id, tabButton);


    properties = {
    }

    await addCSS(document, properties, tabsButton, state.page._id);
    await updateData(state.page._id, tabsButton);


    properties = {
        padding: {
            value: '20px',
        },
        border: {
            value: '1px solid #ccc',
        },
        "background-color": {
            value: '#f2f2f2',
        },

    }

    await addCSS(document, properties, tabContent, state.page._id);
    await updateData(state.page._id, tabContent);


    properties = {

    }

    await addCSS(document, properties, tabsContentElement, state.page._id);
    await updateData(state.page._id, tabsContentElement);


    properties = {

    }
    await addCSS(document, properties, tabs, state.page._id);

    await updateData(state.page._id, tabs);


    properties = {
        'position': {
            value: 'relative'
        },
        'height': {
            value: '400px',
        },
    }

    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const createAccordion = async (state, document) => {

    const componentStates = { ...states['global'], ...states['accordion'] };

    let id = nanoid(8);
    const className = "ac" + "-accordion-" + id;

    const accordion_content_unique_id = uuid();

    const accordionContent = {
        _uid: accordion_content_unique_id,
        tagName: 'div',
        name: 'Accordion Content',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [],

        className: "accordion-content",
        selector: "." + className + " .accordion .accordion-content"

    }

    const accordion_header_unique_id = uuid();

    const accordionHeader = {
        _uid: accordion_header_unique_id,
        tagName: 'div',
        name: 'Accordion Header',
        type: 'inputs',
        layout: 'div',
        nodeValue: 'Accordion Header',
        childNodes: [],
        className: "accordion-header",
        selector: "." + className + " .accordion .accordion-header",
        onClick: {
            key: ["currentIndex"],
            'type': "Accordion",
            "value": "[value]",
            "statetype": "MAPINDEX",
        },

    }



    const accordion_unique_id = uuid();

    const accordionElement = {
        _uid: accordion_unique_id,
        tagName: 'div',
        name: 'Accordion Item',
        type: 'layouts',
        layout: 'accordion',
        nodeValue: '',
        childNodes: [accordion_header_unique_id, accordion_content_unique_id],
        className: "accordion",
        selector: "." + className + " .accordion"

    }
    accordionHeader.parent = accordion_unique_id;
    accordionContent.parent = accordion_unique_id;

    const accordions_unique_id = uuid();

    const accordionsElement = {
        _uid: accordions_unique_id,
        tagName: 'div',
        name: 'Accordion Body',
        type: 'layouts',
        layout: 'accordions',
        nodeValue: '',
        childNodes: [accordion_unique_id],
        className: "accordion-items",
        selector: "." + className + " .accordions-items"

    }
    accordionElement.parent = accordions_unique_id;


    const wrraper_unique_id = uuid();
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
        states: componentStates

    };

    let properties = {

        display: {
            value: 'flex',
        },
        "align-items": {
            value: 'center',
        },
        "background-color": {
            value: '#f2f2f2',
        },

        padding: {
            value: '10px',
        },
        cursor: {
            value: 'pointer',
        },
    }
    await addCSS(document, properties, accordionHeader, state.page._id);
    await updateData(state.page._id, accordionHeader);


    properties = {

        "background-color": {
            value: '#fff',
        },

        padding: {
            value: '10px',
        },
    }
    await addCSS(document, properties, accordionContent, state.page._id);
    await updateData(state.page._id, accordionContent);

    properties = {

        "margin-bottom": {
            value: '10px',
        },

    }
    await addCSS(document, properties, accordionElement, state.page._id);
    await updateData(state.page._id, accordionElement);


    properties = {


    }
    await addCSS(document, properties, accordionsElement, state.page._id);
    await updateData(state.page._id, accordionsElement);


    properties = {

        'position': {
            value: 'relative'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}


const createGallery = async (state, document) => {

    const componentStates = { ...states['global'], ...states['gallery'] };

    let id = nanoid(8);
    const className = "ac" + "-gallery-" + id;

    const img_unique_id = uuid();

    const image = {
        _uid: img_unique_id,
        tagName: 'img',
        name: 'Image',
        type: 'media',
        layout: 'img',
        nodeValue: '',
        childNodes: [],
        className: "gallery-img",
        selector: "." + className + " .gallery .gallery-img"

    }

    const gallery_item_unique_id = uuid();

    const galleryItem = {
        _uid: gallery_item_unique_id,
        tagName: 'div',
        name: 'Gallery Item',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [img_unique_id],
        className: "gallery-item",
        selector: "." + className + " .gallery .gallery-item",
        onClick: {
            key: ["currentIndex"],
            'type': "Gallery",
            "value": "[value]",
            "statetype": "MAPINDEX",

        },

    }
    image.parent = gallery_item_unique_id;


    const gallery_unique_id = uuid();

    const galleryElement = {
        _uid: gallery_unique_id,
        tagName: 'div',
        name: 'Gallery Body',
        type: 'layouts',
        layout: 'gallery',
        nodeValue: '',
        childNodes: [gallery_item_unique_id],
        className: "gallery",
        selector: "." + className + " .gallery"

    }

    galleryItem.parent = gallery_unique_id;


    const wrraper_unique_id = uuid();

    const modalElement = await createModal(state, document, className, {
        key: ["activeItem"],
        'type': "Gallery",
    },);

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
        states: componentStates

    };





    await updateData(state.page._id, modalElement);

    let properties = {

        'max-width': {
            value: '100%'
        },
        'height': {
            value: '100%'
        },
    }
    await addCSS(document, properties, image, state.page._id);

    await updateData(state.page._id, image);


    properties = {

        "margin-bottom": {
            value: '10px',
        },

    }
    await addCSS(document, properties, galleryItem, state.page._id);
    await updateData(state.page._id, galleryItem);


    properties = {
        "display": {
            value: 'grid',
        },

        "grid-template-columns": {
            value: 'repeat(auto-fill, minmax(250px, 1fr))',
        },
        "grid-gap": {
            value: '10px',
        }

    }
    await addCSS(document, properties, galleryElement, state.page._id);
    await updateData(state.page._id, galleryElement);


    properties = {
        'position': {
            value: 'relative'
        },

    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const createModalTrigger = async (state, document) => {

    const componentStates = { ...states['modal'] };


    let id = nanoid(8);
    const className = "ac" + "-modal-" + id;

    const modal_trigger_unique_id = uuid();

    const modalTrigger = {
        _uid: modal_trigger_unique_id,
        tagName: 'button',
        name: 'Modal Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Open Modal',
        childNodes: [],
        className: "modal-trigger",
        selector: "." + className + " .modal-trigger",
        onClick: {
            key: ["openModal"],
            'type': "Modal",
            "value": "'open'",
        },

    }
    const modalElement = await createModal(state, document, className, null);

    const wrraper_unique_id = uuid();
    modalElement.parent = wrraper_unique_id;
    modalTrigger.parent = wrraper_unique_id;

    const childNodes = [modal_trigger_unique_id, modalElement._uid];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Modal",
        cname: "Modal",

        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates
    };



    await updateData(state.page._id, modalElement);

    let properties = {
        "margin-bottom": {
            value: '10px',
        },


    }
    await addCSS(document, properties, modalTrigger, state.page._id);

    await updateData(state.page._id, modalTrigger);


    properties = {
        "postion": {
            value: 'relative',
        },
        "display": {
            value: 'inline-block',
        },

    }
    await addCSS(document, properties, wrapperElement, state.page._id);

    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const createModal = async (state, document, className, valueState) => {



    const modal_close_unique_id = uuid();

    const modalClose = {
        _uid: modal_close_unique_id,
        tagName: 'span',
        name: 'Modal Close',
        type: 'text',
        layout: 'text',
        nodeValue: '&times;',
        childNodes: [],
        className: "modal-close",
        selector: "." + className + " .modal-close",
        onClick: {
            key: ["openModal"],
            'type': "Modal",
            "value": "'close'",
        },

    }

    const modal_unique_id = uuid();
    modalClose.parent = modal_unique_id;

    const modal = {
        _uid: modal_unique_id,
        tagName: 'div',
        name: 'Modal Body',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [modal_close_unique_id],
        className: "modal-body",
        selector: "." + className + " .modal .modal-body",
        state: valueState

    }

    const modal_closer_unique_id = uuid();

    const modalCloserElement = {
        _uid: modal_closer_unique_id,
        tagName: 'div',
        name: 'Modal Closer',
        type: 'layouts',
        layout: 'empty',
        nodeValue: '',
        childNodes: [],
        className: "modal-close-wrapper",
        selector: "." + className + " .modal .modal-close-wrapper",

        onClick: {
            key: ["openModal"],
            'type': "Modal",
            "withtype": "Modal",
            "withkey": ["closable"],
            "value": "[withkey] ? 'close' : 'open'",
        },

    }

    const modal_element_unique_id = uuid();
    modal.parent = modal_element_unique_id;
    modalCloserElement.parent = modal_element_unique_id;

    const modalElement = {
        _uid: modal_element_unique_id,
        tagName: 'div',
        name: 'Modal Wrapper',
        type: 'layouts',
        layout: 'modal',
        bodyRef: modal_unique_id,
        nodeValue: '',

        childNodes: [modal_unique_id, modal_closer_unique_id],
        className: "modal",
        selector: "." + className + " .modal",

    }



    let properties = {
        "position": {
            value: 'relative',
        },
        'background-color': {
            value: '#fefefe'
        },
        'padding': {
            value: '20px'
        },
        'border-radius': {
            value: '4px'
        },
        'width': {
            value: '50%'
        },
        'height': {
            value: '50%'
        },
        'z-index': {
            value: 1
        }

    }
    await addCSS(document, properties, modal, state.page._id);
    await updateData(state.page._id, modal);


    properties = {
        "position": {
            value: 'absolute',
        },
        'left': {
            value: '0'
        },
        'top': {
            value: '0'
        },
        'width': {
            value: '100%'
        },
        'height': {
            value: '100%'
        },

    }
    await addCSS(document, properties, modalCloserElement, state.page._id);
    await updateData(state.page._id, modalCloserElement);


    properties = {
        'width': {
            value: '100%'
        },
        'height': {
            value: '100%'
        },
        ' background-color': {
            value: 'rgba(0, 0, 0, 0.5)'
        },
        'display': {
            value: 'flex'
        },
        'justify-content': {
            value: 'center'
        },
        'align-items': {
            value: 'center'
        },
        "position": {
            value: 'relative',
        },

    }
    await addCSS(document, properties, modalElement, state.page._id);
    await updateData(state.page._id, modalElement);




    properties = {
        "position": {
            value: 'absolute',
        },
        "top": {
            value: '10px',
        },
        "right": {
            value: '10px',
        },
        "font-size": {
            value: 'absolute',
        },
        "cursor": {
            value: 'pointer',
        },

    }
    await addCSS(document, properties, modalClose, state.page._id);
    await updateData(state.page._id, modalClose);



    return modalElement;
}

const createSider = async (state, document) => {

    const componentStates = { ...states['sider'] };

    let id = nanoid(8);
    const className = "ac" + "-sider-" + id;

    const sider_content_unique_id = uuid();

    const siderContent = {
        _uid: sider_content_unique_id,
        tagName: 'div',
        name: 'Sider Content',
        type: 'layouts',
        layout: 'sider',
        nodeValue: '',
        childNodes: [],

        className: "sider-content",
        selector: "." + className + " .sider-content"

    }

    const sider_trigger_unique_id = uuid();

    const siderTrigger = {
        _uid: sider_trigger_unique_id,
        tagName: 'button',
        name: 'Sider Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Sider Button',
        childNodes: [],
        className: "sider-trigger",
        selector: "." + className + " .sider-trigger",
        onClick: {
            key: ["openSider"],
            'type': "Sider",
            "value": "![key]",
        },

    }




    const wrraper_unique_id = uuid();
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
        states: componentStates

    };


    let properties = {
        width: {
            value: '100%',
        },
        height: {
            value: '100%',
        },
        'background-color': {
            value: '#f2f2f2',
        },
        'overflow': {
            value: 'hideen'
        },
        "padding": {
            value: '5px',
        }

    }
    await addCSS(document, properties, siderContent, state.page._id);
    await updateData(state.page._id, siderContent);


    properties = {
        "margin": {
            value: '10px',
        },
        "padding": {
            value: '5px',
        }
    }
    await addCSS(document, properties, siderTrigger, state.page._id);

    await updateData(state.page._id, siderTrigger);



    properties = {
        'position': {
            value: 'relative'
        },
        'display': {
            value: 'inline-block'
        },
        'background-color': {
            value: '#fff',
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const createDropDownTrigger = async (state, document) => {

    const componentStates = { ...states['dropdown'] };

    let id = nanoid(8);
    const className = "ac" + "-dropdown-" + id;

    const trigger_unique_id = uuid();

    const siderTrigger = {
        _uid: trigger_unique_id,
        tagName: 'button',
        name: 'Dropdown Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Dropdown Button',
        childNodes: [],
        className: "dropdown-trigger",
        selector: "." + className + " .dropdown-trigger",
        onClick: {
            key: ["openDropdown"],
            'type': "Dropdown",
            "value": "![key]",
        },

    }

    const dropDownContent = await createDropDown(state, document, className);

    const wrraper_unique_id = uuid();
    dropDownContent.parent = wrraper_unique_id;
    siderTrigger.parent = wrraper_unique_id;

    const childNodes = [trigger_unique_id, dropDownContent._uid];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Dropdown",
        cname: "Dropdown",

        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, dropDownContent);



    let properties = {
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
    await addCSS(document, properties, siderTrigger, state.page._id);

    await updateData(state.page._id, siderTrigger);



    properties = {
        'position': {
            value: 'relative'
        },
        'display': {
            value: 'inline-block'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);

    return wrapperElement;
}

const createDropDown = async (state, document, className) => {

    const dropdown_content_unique_id = uuid();

    const dropDownContent = {
        _uid: dropdown_content_unique_id,
        tagName: 'div',
        name: 'Dropdown Content',
        type: 'layouts',
        layout: 'dropdown',
        nodeValue: '',
        childNodes: [],

        className: "dropdown-content",
        selector: "." + className + " .dropdown-content"

    }



    let properties = {
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
    await addCSS(document, properties, dropDownContent, state.page._id);
    await updateData(state.page._id, dropDownContent);




    return dropDownContent;
}


export const createMenuItem = async (
    tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state
) => {

    const menus = parentElemet.menus || [];

    let allChilds = [];

    let deletedChilds = parentElemet.childNodes || [];

    for (let i = 0; i < menus.length; i++) {
        const element = menus[i];


        const list_item_unique_id = uuid();
        let listItem = await getData(state.page._id, element.childId);
        deletedChilds = deletedChilds.filter(_uid => _uid !== element.childId)
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
                    value: element.link,
                },
                target: {
                    key: "target",
                    value: element.target,
                },
            }


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


            }
            listItemLink = await getData(state.page._id, listItem.childNodes[0]);

            listItemLink.nodeValue = element.title;

            listItemLink.attributes = {
                href: {
                    key: "href",
                    value: element.link,
                },
                target: {
                    key: "target",
                    value: element.target,
                },
            }

        }





        if (listItem.nestedMenuId) {
            let parent = await getData(state.page._id, listItem.nestedMenuId);
            const pageUpdated = await createMenuItem({}, parent, false, null, "", state);
            if (pageUpdated)
                allChilds = [listItem._uid, ...allChilds, ...pageUpdated.newIds]
        }
        else
            if (element.children && element.children.length > 0) {
                const componentStates = { ...states["dropdown"] };
                listItem.states = componentStates;
                listItem.type = "component";

                listItemLink.onClick = {
                    key: ["openDropdown"],
                    'type': "Dropdown",
                    "value": "0",
                }

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
                const pageUpdated = await createMenuItem({}, list, false, null, "", state);
                if (pageUpdated)
                    allChilds = [listItem._uid, ...allChilds, ...pageUpdated.newIds]
            }


        await updateData(state.page._id, listItemLink);
        await updateData(state.page._id, listItem);
        allChilds = [...allChilds, ...listItem.childNodes]

    }

    for (let i = 0; i < deletedChilds.length; i++) {
        let child = await getData(state.page._id, deletedChilds[i]);

        if (child) {
            await deleteData(state.page._id, child._uid);
            await onDeleteElement(child, state.page._id)
            parentElemet.childNodes = parentElemet.childNodes.filter(_uid => _uid !== child._uid);
        }


    }

    await updateData(state.page._id, parentElemet);

    allChilds = [parentElemet._uid, ...allChilds]

    const id = nanoid(8);

    return {
        pos: pos,
        allUpdate: id,
        newIds: allChilds,
    };
};

const createGoToTop = async (state, document) => {

    const componentStates = { ...states['gototop'] };

    let id = nanoid(8);
    const className = "ac" + "-gototop-" + id;

    const unique_id = uuid();

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

    let properties = {
        'position': {
            value: 'fixed'
        },
        'bottom': {
            value: '20px'
        },
        'right': {
            value: '20px'
        },
        'padding': {
            value: '20px'
        },
        'border': {
            value: 'none'
        },
        'border-radius': {
            value: '50%'
        },
        'background-color': {
            value: '#333'
        },
        'color': {
            value: '#fff'
        },
        'font-size': {
            value: '16px'
        },
        'cursor': {
            value: 'pointer'
        },
        'z-index': {
            value: '1000'
        },
    }

    await addCSS(document, properties, button, state.page._id);


    await updateData(state.page._id, button);


    return button;
}


const createObservable = async (state, document) => {

    const componentStates = { ...states['observable'] };

    let id = nanoid(8);
    const className = "ac" + "-observable-" + id;

    const unique_id = uuid();

    const wrapperElement = {
        _uid: unique_id,
        tagName: 'div',
        name: 'Observable',
        cname: 'Observable',

        type: 'component',
        layout: "observable",
        nodeValue: '',
        childNodes: [],
        classes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    }

    let properties = {
        'position': {
            value: 'relative'
        },
    }
    await addCSS(document, properties, wrapperElement, state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const createSearchable = async (state, document) => {

    const componentStates = { ...states['global'], ...states['searchable'] };

    let id = nanoid(8);
    const className = "ac" + "-searchable-" + id;

    const input_unique_id = uuid();


    const inputElement = {
        _uid: input_unique_id,
        tagName: 'input',
        name: "search input",
        type: 'inputs',
        layout: "input",
        attributes: { type: { key: "type", value: 'text' }, placeholder: { key: "placeholder", value: "Search..." } },
        state: {
            type: 'Searchable',
            key: ["searchText", "defaultValue"]
        },
        onChange: {
            type: 'Searchable',
            key: ["searchText", "defaultValue"]
        },
        nodeValue: "",
        childNodes: [],
        className: "search-input",
        selector: "." + className + " .search-input"

    };
    const button_unique_id = uuid();

    const buttonElement = {
        _uid: button_unique_id,
        tagName: 'button',
        name: "search input",
        type: 'inputs',
        layout: "button",
        attributes: {
            type: { key: "type", value: 'button' }
        },
        onClick: {
            type: 'Searchable',
            key: ["search", "defaultValue"],
            statetype: 'Searchable',
            statekey: ["searchText", "defaultValue"],
            value: ''
        },
        nodeValue: "Submit",
        childNodes: [],
        className: ".search-btn",
        selector: "." + className + " .search-btn"

    };


    const search_unique_id = uuid();


    inputElement.parent = search_unique_id;
    buttonElement.parent = search_unique_id;

    const searchElement = {
        _uid: search_unique_id,
        tagName: 'div',
        name: 'Search',
        type: 'layouts',
        layout: "div",
        nodeValue: '',
        childNodes: [input_unique_id, button_unique_id],
        classes: [],
        className: "search",
        selector: "." + className + " .search"

    }
    const results_unique_id = uuid();

    const resultsElement = {
        _uid: results_unique_id,
        tagName: 'div',
        name: 'Results',
        type: 'layouts',
        layout: "div",
        nodeValue: '',
        childNodes: [],
        classes: [],
        map: {
            "key": ["pages"],
            "type": "Searchable"
        },
        className: "results",
        selector: "." + className + " .results"

    }

    const wrraper_unique_id = uuid();

    searchElement.parent = wrraper_unique_id;
    resultsElement.parent = wrraper_unique_id;

    const childNodes = [search_unique_id, results_unique_id];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: 'Searchable',
        cname: 'Searchable',
        type: 'component',
        layout: "searchable",
        nodeValue: '',
        childNodes: childNodes,
        classes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    }

    await addCSS(document, {}, inputElement, state.page._id);

    await updateData(state.page._id, inputElement);

    await addCSS(document, {}, buttonElement, state.page._id);

    await updateData(state.page._id, buttonElement);

    await addCSS(document, {}, searchElement, state.page._id);

    await updateData(state.page._id, searchElement);

    await addCSS(document, {}, resultsElement, state.page._id);

    await updateData(state.page._id, resultsElement);

    await addCSS(document, {}, wrapperElement, state.page._id);

    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}

const states = {

    global: {

        currentIndex: { key: 'currentIndex', defaultValue: 0, type: 'number', min: 0, max: 0 },
        total: { key: 'total', defaultValue: 0, type: 'number', min: 0, max: 0 },
    },

    slider: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Slider", type: 'array',

        },
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
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Tab", type: 'array',

        },
    },

    accordion: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Accordion", type: 'array',

        },
    },

    gallery: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Gallery Item", type: 'array',

        },
        openModal: { key: 'openModal', defaultValue: 0, type: 'boolean' },
        activeItem: { key: 'activeItem', defaultValue: null, type: 'node' },
        modal: { key: 'modal', defaultValue: false, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },

        duration: { key: 'duration', defaultValue: 300, type: 'number' },


    },

    modal: {
        openModal: { key: 'openModal', defaultValue: 'close', type: 'text' },
        type: {
            key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade', 'slideRight',
                'slideLeft',
                'slideTop',
                'slideBottom',
            ]
        },
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

        openSide: {
            key: 'openSide', defaultValue: "topLeft", type: 'dropdown', values: [
                'topRight',
                'topLeft',
                'bottomLeft',
                'bottomRight',
            ]
        },
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
        tagName: {
            key: 'tagName', defaultValue: 'div', type: 'dropdown',
            values: ['div', 'button']
        },

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
    searchable: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Search Item", type: 'array',

        },
        pages: {
            key: 'pages', defaultValue: "0", states: [], text: "Results", type: 'array',

        },
        trigger: { key: 'trigger', defaultValue: 0, type: 'boolean' },

        searchText: { key: 'searchText', defaultValue: '', type: 'search' },
        search: { key: 'search', defaultValue: '', type: 'search' },

        limit: { key: 'limit', defaultValue: '', type: 'number' },
        page: { key: 'page', defaultValue: '', type: 'number' },


    },
    menu: {
        items: {
            key: 'items',
            type: 'array',
            defaultValue: "",
            states: [],
            text: "Menu Item",

        },


    }
}




export default addComponent;