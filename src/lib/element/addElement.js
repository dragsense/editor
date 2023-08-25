
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import addCSS from './addCSS';
import { storePage, getAllData, getData, updateData, STYLE_STORE_NAME } from '../db';
import addComponent, { createMenuItem, generateElementStyle } from './addComponent';


const addElement = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document) => {


    try {

        switch (parentElemet.layout) {
            case 'slides':
                return await createSlide(tag,
                    parentElemet,
                    state,
                    pos,
                    document,);
            case 'tabs-btn':
            case 'tabs-content':
            case 'tabs':
                return await createTab(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);
            case 'accordions':
            case 'accordion':
                return await createAccordion(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);
            case 'gallery':
                return await createGalleryItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            case 'modal':
                return await createModalItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            // case 'sider':
            //     return await createSiderItem(tag,
            //         parentElemet,
            //         addToAbove,
            //         currentUid,
            //         pos,
            //         state,
            //         document,);
            case 'menu':
                return await createMenuItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            default:
                return await createElement(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document, proeprties[tag.layout] || {})
        }

    } catch (e) {

        throw new Error(e?.message);
    }

}


const createInput = async (tag, state, document) => {

    const input_unique_id = uuid();
    let id = nanoid(8);

    let inputId = nanoid(4);
    const className = "ac" + "-form-group-" + id;
    const className2 = "ac" + "-input-container-" + id;

    const inputElement = {
        _uid: input_unique_id,
        tagName: tag.tag,
        name: tag.key + "_input",
        type: tag.type,
        layout: tag.layout,
        options: tag.options,
        attributes: { ...tag.attributes, id: { key: "id", value: inputId + "_" + tag.key } },
        state: {
            type: 'FORMSTATES',
            key: [tag.key, "defaultValue"]
        },
        onChange: {
            type: 'FORMSTATES',
            key: [tag.key, "defaultValue"],
            value: "'[value]'"
        },
        labelPos: tag.labelPos,
        nodeValue: tag.nodeValue,
        childNodes: [],
        className: "",
        selector: "." + className2 + " input"

    };

    const label_unique_id = uuid();


    const labelElement = {
        _uid: label_unique_id,
        tagName: "label",
        name: tag.key + "_label",
        type: "texts",
        layout: "form-label",
        nodeValue: tag.label,
        attributes: { htmlFor: { key: "htmlFor", value: inputId + "_" + tag.key } },
        childNodes: [],
        className: "",
        selector: "." + className + " label"
    };

    const error_unique_id = uuid();


    const errorElement = {
        _uid: error_unique_id,
        tagName: "span",
        name: tag.key + "_error",
        type: "texts",
        nodeValue: tag.errorMessage,
        state: {
            type: 'FORMSTATES',
            key: [tag.key, "errorMessage"]
        },
        conditions: {
            'cond-0': {
                name: "input-error",
                key: [tag.key, "error"],
                type: 'FORMSTATES',
                value: '[key] === 1', relation: 'AND',
                valueState: undefined
            }

        },

        childNodes: [],
        layout: "form-error-message",
        className: "error-message",
        selector: "." + className2 + " .error-message"

    };

    const input_wrraper_unique_id = uuid();
    errorElement.parent = input_wrraper_unique_id;
    inputElement.parent = input_unique_id;

    const inputWrapperElement = {
        _uid: input_wrraper_unique_id,
        tagName: 'div',
        name: "div",
        type: "layouts",
        nodeValue: '',
        layout: "form-input-container",
        childNodes: [input_unique_id, error_unique_id],
        className: className2,
        selector: "." + className2

    };

    let childNodes = [];

    if (tag.labelPos === 0)
        childNodes = [label_unique_id, input_wrraper_unique_id]
    else
        childNodes = [input_wrraper_unique_id, label_unique_id]

    const wrraper_unique_id = uuid();
    labelElement.parent = wrraper_unique_id;
    inputWrapperElement.parent = input_wrraper_unique_id;


    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: "div",
        type: "layouts",
        layout: "form-group",
        nodeValue: '',
        childNodes: childNodes,
        className: className,
        selector: "." + className,


    };

    let properties = {
        'padding': {
            value: '5px'
        },
        'border': {
            value: '1px solid #ccc'
        },
        'margin-right': {
            value: '5px'
        },
        'width': {
            value: '100%'
        }
    }
    await addCSS(document, properties, inputElement
        , state.page._id);
    await updateData(state.page._id, inputElement);


    properties = {
        'display': {
            value: 'inline-block'
        },
        'margin-right': {
            value: '5px'
        },
        'color': {
            value: '#333'
        },
    }
    await addCSS(document, properties, labelElement
        , state.page._id);
    await updateData(state.page._id, labelElement);



    properties = {
        'color': {
            value: '#ff0000'
        },
        'font-size': {
            value: '12px'
        },
    }
    await addCSS(document, properties, errorElement
        , state.page._id);
    await updateData(state.page._id, errorElement);


    properties = {
        'display': {
            value: 'flex'
        },
        'justify-content': {
            value: 'center'
        },
        'flex-direction': {
            value: 'column'
        }
    }
    await addCSS(document,
        properties,
        inputWrapperElement,
        state.page._id);
    await updateData(state.page._id, inputWrapperElement);


    properties = {
        'margin-right': {
            value: '10px'
        },
    }
    await addCSS(document,
        properties, wrapperElement
        , state.page._id);
    await updateData(state.page._id, wrapperElement);


    return wrapperElement;
}


const createSlide = async (tag,
    parentElemet,
    state,
    pos,
    document,) => {



    const slide_unique_id = uuid();
    const slideElement = {
        _uid: slide_unique_id,
        tagName: 'div',
        name: 'slide',
        type: 'layouts',
        layout: 'slide-item',
        nodeValue: '',
        childNodes: [],
        className: "slide",
        selector: parentElemet.selector + " .slide"
    }

    await createElement(tag,
        slideElement,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    parentElemet.childNodes.push(slide_unique_id);
    await updateData(state.page._id, parentElemet);

    return {
        pos,
        parentId: parentElemet._uid,
        newId: slideElement._uid
    };
}

const createTab = async (
    tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {



    let tabsButton = null;
    let tabsContent = null;

    let dragPos = '';
    if (parentElemet.layout === 'tabs-btn') {
        tabsButton = parentElemet;
        tabsContent = await getData(state.page._id, tabsButton.contentRef);
        dragPos = pos + "1";
    } else
        if (parentElemet.layout === 'tabs-content') {
            tabsContent = parentElemet;
            tabsButton = await getData(state.page._id, tabsContent.btnRef);
            dragPos = pos + "0";
        } else {
            tabsButton = await getData(state.page._id, parentElemet.btnRef);
            tabsContent = await getData(state.page._id, parentElemet.contentRef);
            pos = pos + "0"
            dragPos = pos + "1";

        }


    const totalLength = tabsContent.childNodes.length;

    const tab_btn_unique_id = uuid();
    const tabButton = {
        _uid: tab_btn_unique_id,
        tagName: 'button',
        name: 'Tab Button',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Tab Button',
        childNodes: [],
        attributes: {
            "disabled": {
                "key": "disabled",
                "value": true,
                "conditions": {
                    'cond-0': {
                        name: "currentIndex",
                        key: ["currentIndex"],
                        type: 'Tabs',
                        value: `[key] === ${totalLength}`, relation: 'AND',

                    }

                }
            },

        },
        onClick: {
            key: ["currentIndex"],
            'type': "Tabs",
            "value": `${totalLength}`
        },
        className: "tab-btn",
        selector: tabsButton.selector + " .tab-btn",
        style: {
            normal: {
                proeprties: {},
                selectorText: tabsButton.selector + " .tab-btn"
            }
        }

    }

    tabsButton.childNodes = [...tabsButton.childNodes, tab_btn_unique_id]
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
        selector: tabsContent.selector + " .tab-content",
        style: {
            normal: {
                proeprties: {},
                selectorText: tabsContent.selector + " .tab-content"
            }
        }
    }
    await createElement(tag,
        tabContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    tabsContent.childNodes = [...tabsContent.childNodes, tab_content_unique_id]

    await updateData(state.page._id, tabButton);
    await updateData(state.page._id, tabsButton);
    await updateData(state.page._id, tabsContent);

    return {
        pos: pos,
        dragPos: dragPos,
        currentId: tabsContent._uid,
        parentId: tabsButton._uid,
        newId: tabButton._uid
    };
}

const createAccordion = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


    if (parentElemet.layout === 'accordion') {
        parentElemet = await getData(state.page._id, parentElemet.parent);

    }

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
        selector: parentElemet.selector + " .accordion-content"

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
        selector: parentElemet.selector + " .accordion-header",
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
        selector: parentElemet.selector + " .accordion"

    }
    accordionHeader.parent = accordion_unique_id;
    accordionContent.parent = accordion_unique_id;


    await createElement(tag,
        accordionContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, accordion_unique_id);
    }
    else
        parentElemet.childNodes.push(accordion_unique_id);

    accordionElement.parent = parentElemet._uid;

    await updateData(state.page._id, accordionHeader);

    await updateData(state.page._id, accordionElement);
    await updateData(state.page._id, parentElemet);

    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: accordionElement._uid
    };
}

const createGalleryItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


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
        selector: parentElemet.selector + " .gallery-img"

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
        selector: parentElemet.selector + " .gallery-item",
        onClick: {
            key: ["currentIndex"],
            'type': "Gallery",
            "value": "[value]",

        },

    }
    image.parent = gallery_item_unique_id;



    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, gallery_item_unique_id);
    }
    else
        parentElemet.childNodes.push(gallery_item_unique_id);

    galleryItem.parent = parentElemet._uid;

    await updateData(state.page._id, image);
    await updateData(state.page._id, galleryItem);
    await updateData(state.page._id, parentElemet);

    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: galleryItem._uid
    };
}

const createModalItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


    const modal = await getData(state.page._id, parentElemet.bodyRef);

    return await createElement(tag,
        modal,
        false,
        null,
        pos + "0",
        state,
        document, proeprties[tag.layout] || {})

}


const createSiderItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {

    const siderContent = await getData(state.page._id, parentElemet.contentRef);


    return await createElement(tag,
        siderContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})
}



const createElement = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document, properties) => {

    let newElement = null;
    if (tag.type === 'component')
        newElement = await addComponent(tag, state, document);
    else if (tag.type === 'form')
        newElement = await createInput(tag, state, document);
    else {

        const unique_id = uuid();

        let id = nanoid(8);
        const className = "ac" + "-elem-" + id;
        if (tag.page) {
            newElement = {
                ...tag,
                _uid: unique_id,
                className: className,
                childNodes: ["0"],
                tagName: "div",
                nodeValue: "",
                type: 'layouts',
                layout: "div",
                selector: "." + className,
                style: {
                    normal: {
                        properties
                    }
                }
            }
        } else {

            newElement = {
                _uid: unique_id,
                tagName: tag.tag,
                name: tag.layout,
                type: tag.type,
                layout: tag.layout,
                attributes: tag.attributes,
                state: tag.state,
                map: tag.map,
                nodeValue: tag.nodeValue ? tag.nodeValue : tag.text ? tag.text : '',
                childNodes: [],
                classes: tag.classes,
                className: className,
                selector: "." + className,
                style: {
                    normal: {
                        properties
                    }
                }

            };
        }

        if (tag.width && tag.layout === 'fg-child') {
            properties['width'] = {
                value: tag.width,
                unit: '%'
            }
        }

        await addCSS(document, properties, newElement, state.page._id);

    }



    newElement.parent = parentElemet._uid;


    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, newElement._uid);
    }
    else
        parentElemet.childNodes.push(newElement._uid);


    await updateData(state.page._id, newElement);
    await updateData(state.page._id, parentElemet);


    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: newElement._uid
    };
}


const proeprties = {

    "normal": {},


    'main': {

        'background-color': {
            value: '#f2f2f2'
        },
        'padding': {
            value: '10px'
        },
    },

    'icon': {
        'font-size': {
            value: '27.6px'
        },
        'display': {
            value: 'inline-block'
        },


    },
    'svg-icon': {

        'display': {
            value: 'inline-block'
        },
        'width': {
            value: '24px'
        },

    },

    'img': {
        'max-width': {
            value: '100%'
        },
        'height': {
            value: 'auto'
        },
    },

}




export default addElement;