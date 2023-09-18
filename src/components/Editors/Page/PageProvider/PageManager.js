import React, { useReducer, useState, useEffect, useCallback } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Importing necessary functions and constants from the database library
import {
    loadPage, getData, updateData, updateStyleData, searchSelector,
    clearStore, UNDO_STORE_NAME, REDO_STORE_NAME, publishPage, savePage, getAction, deleteAction, deleteAllActions, storeAction, STYLE_STORE_NAME, PAGE_STORE_NAME, deleteData, getAllData, loadWithoutStyle, storePage
} from '../../../../lib/db';
import addElement from '../../../../lib/element/addElement';
import addCSS from '../../../../lib/element/addCSS';

// Importing necessary libraries for generating unique IDs
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import ThemeServices from "../../../../lib/services/theme";
import HTMLTags from '../Panel/LeftPanel/Tag/htmlTags.json'
import { message, Modal } from "antd";

// Creating a context for the page
export const pageContext = React.createContext({});

// Initial state of the page
const initial = {
    page: null,
    node: null,
    selector: null,
    isChange: false,
    isStyleChange: false,
    error: '',
    loading: false,
    isUpdate: '0',
    states: {},
}

// Reducer function to handle state changes
// Reducer function to handle state changes
const reducer = (state, action) => {
    // Using a lookup object for better performance
    const actions = {
        "start": () => ({ ...state, loading: true, error: '' }),
        "laod": () => ({ ...state, pageUpdated: action.pageUpdated }),
        "preview": () => ({ ...state, preview: action.preview }),
        "edit": () => ({ ...state, page: action.page, type: action.pageType, isChange: false }),
        "updatePage": () => ({ ...state, pageUpdated: action.pageUpdated, isChange: true }),
        "updateStates": () => ({ ...state, states: { ...state.states, ...action.states } }),
        "styleChange": () => ({ ...state, isStyleChange: true }),
        "updateElement": () => ({ ...state, isChange: true, isStyleChange: action.style }),
        "close": () => ({ ...state, isChange: false }),
        "media": () => ({ ...state, media: action.media, selector: null, node: null }),
        "savePage": () => ({ ...state, isChange: false }),
        "delete": () => ({ ...state, node: null }),
        "addSelector": () => ({ ...state, selector: action.selector }),
        "selectNode": () => ({ ...state, node: action.node }),
        "error": () => ({ ...state, error: action.error }),
        "finish": () => ({ ...state, loading: false })
    };

    // Check if the action type exists in the lookup object
    if (actions[action.type]) {
        // If it does, execute the corresponding function
        return actions[action.type]();
    } else {
        // If it doesn't, return the current state
        return state;
    }
}


/**
 * Function to validate and add an element to the page
 * @param {string} currentUid - The unique identifier of the current element
 * @param {object} tag - The tag object of the element to be added
 * @param {string} _id - The unique identifier of the page
 * @param {number} level - The current level of the element in the page hierarchy
 * @returns {boolean} - Returns true if the element is successfully added, false otherwise
 */
const onAddElement = async (currentUid, tag, _id, level = 0) => {
    // Check if the currentUid is provided
    if (currentUid) {
        // Fetch the current element data from the database
        const element = await getData(_id, currentUid);
        // Fetch the parent tag from the HTMLTags JSON
        const parentTag = HTMLTags[element.type]?.find(val => val.tag == element.tagName);

        // Check if the parent tag does not accept the current tag
        if (parentTag && (parentTag.notaccept?.includes(tag.tag) || parentTag.notaccept?.includes(tag.type))) {
            // Display an error message and return false
            message.error("This tag is not allowed within this element.")
            return false;
        }

        // Check if the current tag is the same as the element tag
        if (element.tagName == tag.tag)
            // If it is, increment the level
            level = level + 1;
        else
            // If it's not, reset the level to 0
            level = 0;

        // Check if the level has reached the maximum limit
        if (level > 10) {
            // Display an error message and return false
            message.error("This tag reached maximum level within this element.")
            return false;
        }

        // Recursively call the onAddElement function with the parent element
        return await onAddElement(element.parent, tag, _id, level);
    }

    // If the currentUid is not provided, return true
    return true;
}

/**
 * Function to get the stylesheet from the document
 * @param {Document} iFrameDocument - The document object of the iframe
 * @returns {CSSStyleSheet} - Returns the stylesheet object
 */
const getStyleSheet = (iFrameDocument) => {
    const styleSheets = iFrameDocument.styleSheets;
    let sheet = null;

    // Loop through all the stylesheets in the document
    for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        // If the stylesheet is the global one, break the loop
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
            break;
    }

    return sheet;
}

/**
 * Function to generate the CSS text from the style properties
 * @param {object} properties - The style properties object
 * @returns {string} - Returns the CSS text
 */
const generateCssText = (properties) => {
    let cssText = '';

    // Loop through all the properties in the object
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const value = properties[property].value;
            // Append the property and its value to the CSS text
            cssText += `${property}: ${value}; `;
        }
    }

    return cssText;
}

/**
 * Function to create a CSS rule and insert it into the stylesheet
 * @param {string} key - The key of the style element
 * @param {object} style - The style object
 * @param {string} selectorText - The selector text
 * @param {Document} iFrameDocument - The document object of the iframe
 */
const createCss = (key, style, selectorText, iFrameDocument) => {
    // Get the stylesheet from the document
    const sheet = getStyleSheet(iFrameDocument);

    // Get the CSS rules from the stylesheet
    let cssRules = sheet.cssRules || sheet.rules;

    // Get the style element from the style object
    const styleElement = style.style;

    // If the style element does not have the key, initialize it
    if (!styleElement[key])
        styleElement[key] = { ['root']: {} }

    // Get the properties from the style element
    const properties = styleElement[key]['root'].properties || {}

    // Generate the CSS text from the properties
    const cssText = generateCssText(properties);

    // Insert the new rule into the stylesheet
    sheet.insertRule(`${selectorText} {${cssText}}`, cssRules.length);
}

/**
 * Function to update the style of the child element
 * @param {object} child - The child element object
 * @param {object} state - The state object
 * @param {Document} iFrameDocument - The document object of the iframe
 */
const updateChildStyle = async (child, state, iFrameDocument) => {
    const style = await getData(state.page._id, child.styleUid, 'id', STYLE_STORE_NAME);
    if (style) {
        let id = nanoid(8);

        style._uid = id;
        style.selectorText = child.selector;
        child.styleUid = id;

        createCss('normal', style, style.selectorText, iFrameDocument)

        if (state.media)
            createCss(state.media, style, style.selectorText, iFrameDocument)

        await updateData(state.page._id, style, STYLE_STORE_NAME);
    }
}

/**
 * Function to copy the child element
 * @param {object} child - The child element object
 * @param {object} state - The state object
 * @param {boolean} deep - The flag to indicate whether to copy the child elements
 * @param {Document} iFrameDocument - The document object of the iframe
 * @returns {string} - Returns the unique identifier of the copied child element
 */
const copyChildElement = async (child, state, deep, iFrameDocument) => {
    const unique_id = uuid();
    let id = nanoid(8);
    child._uid = unique_id;

    if (deep) {
        const mainClass = child.mainClass || "ac" + "-elem-";

        child.className = mainClass + "-" + id;
        const selectors = child.selector.split(" ");
        selectors[selectors.length - 1] = "." + mainClass + id;
        child.selector = selectors.join(" ");

        await updateChildStyle(child, state, iFrameDocument);
    }

    child.parent = currentElement._uid;

    await onCopyElement(child, state, deep, iFrameDocument);
    await updateData(state.page._id, child);
    return unique_id;
}

/**
 * Function to copy an element
 * @param {object} currentElement - The current element object
 * @param {object} state - The state object
 * @param {boolean} deep - The flag to indicate whether to copy the child elements
 * @param {Document} iFrameDocument - The document object of the iframe
 */
const onCopyElement = async (currentElement, state, deep = false, iFrameDocument) => {
    if (Array.isArray(currentElement.childNodes)) {
        const newChilds = await Promise.all(currentElement.childNodes.map(async (_uid) => {
            const child = await getData(state.page._id, _uid);
            return await copyChildElement(child, state, deep, iFrameDocument);
        }));
        currentElement.childNodes = newChilds;
    }
}

/**
 * Function to delete a style
 * @param {object} child - The child element object
 * @param {string} _id - The unique identifier of the page
 */
const deleteStyle = async (child, _id) => {
    const style = await getData(_id, child.styleUid, 'id', STYLE_STORE_NAME);
    if (style) {
        style.deleted = true;
        await updateData(_id, style, STYLE_STORE_NAME);
    }
}

/**
 * Function to delete an element
 * @param {object} currentElement - The current element object
 * @param {string} _id - The unique identifier of the page
 */
const deleteElement = async (currentElement, _id) => {
    currentElement.deleted = true;
    await updateData(_id, currentElement);
    await deleteStyle(currentElement, _id);
}

/**
 * Function to delete an element and its child elements
 * @param {object} currentElement - The current element object
 * @param {string} _id - The unique identifier of the page
 */
export const onDeleteElement = async (currentElement, _id) => {
    // Check if the current element has child nodes
    if (Array.isArray(currentElement.childNodes)) {
        // Use Promise.all to delete all child elements concurrently for better performance
        await Promise.all(
            currentElement.childNodes.map(async _uid => {
                const child = await getData(_id, _uid);
                if (child) {
                    // Recursively delete the child element and its child elements
                    await onDeleteElement(child, _id);
                }
            })
        );
    }
    // Delete the current element
    await deleteElement(currentElement, _id);
}



export default function PageManger({ children }) {
    // Use the useReducer hook to manage the state of the page
    // The reducer function is used to handle state changes
    // The initial state is passed as the second argument to the useReducer hook
    const [state, dispatch] = useReducer(reducer, initial);

    // Use the useState hook to manage the preview mode of the page
    // The initial value of previewMode is set to false
    const [previewMode, setPreviewMode] = useState(false);


    // Function to handle the 'beforeunload' event
    const handleBeforeUnload = async (event) => {
        // If there are unsaved changes, prevent the default action (closing the window)
        if (state.isChange) {
            event.preventDefault();

            // Check if the user wants to save the unsaved changes
            const shouldSave = await window.autocode.checkUnsavedChanges(state.isChange);

            // If the user wants to save the changes, call the onSubmit function
            if (shouldSave) {
                await onSubmit();
            }

            // If the user wants to discard the changes, close the window after a short delay
            if (shouldSave === 1) {
                setTimeout(() => {
                    window.close();
                }, 100);
            }

            // Dispatch a 'close' action to update the state
            dispatch({ type: 'close' });
        }
    }

    // Use the useEffect hook to add the 'beforeunload' event listener when the component mounts
    // and remove it when the component unmounts
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state.isChange]); // The effect depends on the 'isChange' state



    // Function to load elements for preview
    const loadElements = async (page, type, iframeDocument) => {
        try {
            // Throw an error if page or type is not selected
            if (!page || !type) {
                throw new Error('Page not selected!');
            }

            // If iframeDocument is not provided, get it from the iframe
            if (!iframeDocument) {
                const iframe = document.querySelector("#ac-editor-iframe-preveiw-doc");
                iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            }

            // Start loading process
            dispatch({ type: 'start' });

            // Throw an error if iframeDocument is not found
            if (!iframeDocument) {
                throw new Error('Iframe content document not found.');
            }

            // Set preview mode to 0
            dispatch({ type: 'preview', preview: 0 });

            // Load page without style
            await loadWithoutStyle(page, type, dispatch, true);

            // Get page CSS
            const res = await ThemeServices.getPageCss(type, page._id)

            // Get or create style element in iframeDocument
            let style = iframeDocument.querySelector('#ac-stylesheet-global');
            if (!style) {
                style = iframeDocument.createElement('style');
                style.id = 'ac-stylesheet-global';
                iframeDocument.head.appendChild(style);
            }

            // If res.css is an array, join it and set as style text content
            if (Array.isArray(res.css)) {
                style.textContent = res.css.join('\n');
            }

            // Set preview mode to 1 after a delay
            setTimeout(() => {
                dispatch({ type: 'preview', preview: 1 });
            })

        } catch (e) {
            // Dispatch error if any occurs during the process
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Finish loading process
            dispatch({ type: 'finish' });
        }
    }

    // Function to handle preview
    const onPreview = async (page, type, iframeDocument) => {
        // If previewMode is false, return immediately
        if (!previewMode)
            return;

        // Load elements for preview
        loadElements(page, type, iframeDocument);
    }


    // Function to handle the 'shouldSave' response
    const handleShouldSave = async (shouldSave) => {
        switch (shouldSave) {
            case 0:
                // If the user wants to save the changes, call the onSubmit function
                await onSubmit();
                break;
            case 2:
                // If the user wants to discard the changes, return immediately
                return;
        }
    }

    // Function to load the stylesheet for the page
    const loadStyleSheet = async (type, page, iframeDocument) => {
        const res = await ThemeServices.getPageCss(type, page._id)
        let style = iframeDocument.querySelector('#ac-stylesheet-global');

        if (!style) {
            style = iframeDocument.createElement('style');
            style.id = 'ac-stylesheet-global';
            iframeDocument.head.appendChild(style);
        }

        if (Array.isArray(res.css)) {
            style.textContent = res.css.join('\n');
        }
    }

    const onEdit = async (page, type, iframeDocument) => {
        // If there are unsaved changes, check if the user wants to save them
        if (state.isChange) {
            const shouldSave = await window.autocode.checkUnsavedChanges(state.isChange);
            await handleShouldSave(shouldSave);
        }

        try {
            // Dispatch a 'start' action to indicate the start of the edit process.
            dispatch({ type: 'start' });

            // Check if both page and type are provided. If not, throw an error.
            if (!page || !type) {
                throw new Error('Page or Type not selected!');
            }

            // Dispatch an 'edit' action with the selected page and page type to update the state.
            dispatch({ type: 'edit', page: page, pageType: type });

            // Clear the undo and redo stores to start a fresh edit session.
            await clearStore(UNDO_STORE_NAME);
            await clearStore(REDO_STORE_NAME);

            // Update the 'pageUpdated' flag in the state to indicate that the page is being updated.
            dispatch({ type: 'load', pageUpdated: 0 });

            // Load the selected page data asynchronously and update the state with the loaded data.
            await loadPage(page, type, dispatch);

            // If iframeDocument is not provided, get it from the iframe
            if (!iframeDocument) {
                const iframe = document.querySelector("#ac-editor-iframe-doc");
                iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            }

            // Load the stylesheet for the page
            await loadStyleSheet(type, page, iframeDocument);

            // After loading the page data, update the 'pageUpdated' flag to indicate that the update is completed.
            setTimeout(() => {
                dispatch({ type: 'load', pageUpdated: 1 });
            }, 0);

        } catch (e) {
            // If an error occurs during the edit process, dispatch an 'error' action with the error message.
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Finally, after completing or encountering an error during the edit process, dispatch a 'finish' action.
            dispatch({ type: 'finish' });
        }
    };

    // Function to update the value of an element
    const updateValue = async (updatedElement, STORE = UNDO_STORE_NAME) => {
        // If the updatedElement is not provided, dispatch an error and return
        if (!updatedElement) {
            dispatch({ type: 'error', error: 'Element not selected.' });
            return;
        }

        // Dispatch a 'start' action to indicate the start of the update process
        dispatch({ type: 'start' });

        // Get the iframe document
        const iframeDocument = getIframeDocumentBySelector("#ac-editor-iframe-doc");

        // If the iframeDocument is not found, throw an error
        if (!iframeDocument) {
            throw new Error('Iframe content document not found.');
        }

        // Get the node from the iframeDocument using the unique identifier of the updatedElement
        let node = getNodeFromIframeDocument(iframeDocument, updatedElement._uid);

        // If the node is not found, dispatch an error and return
        if (!node) {
            dispatch({ type: 'error', error: 'Node not found.' });
            return;
        }

        // Get the unique identifier and position of the node
        const currentUid = node.dataset.id;
        const pos = node.dataset.pos;

        try {
            // Update the node value if necessary
            updateNodeValue(node, updatedElement);

            // Update the class name and style of the node if necessary
            await updateNodeClassNameAndStyle(node, updatedElement, state);

            // Remove unnecessary properties from the updatedElement
            delete updatedElement.updateHTML;
            delete updatedElement.mainClass;

            // Get the original element data
            const orignal = await getData(state.page._id, updatedElement._uid)

            // Update the element data in the database
            await updateData(state.page._id, {
                ...updatedElement, updateHTML: undefined,
                node: undefined, mainClass: undefined
            });

            // Create the pageUpdated object
            const pageUpdated = { pos: pos, currentId: currentUid };

            // Add an 'update' action to the undo/redo store
            onAddAction({ action: 'update', ...pageUpdated, orignal }, STORE);

            // Dispatch an 'updatePage' action to update the state
            dispatch({ type: 'updatePage', pageUpdated, node: null });

        } catch (e) {
            // If an error occurs during the update process, dispatch an 'error' action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            // Finally, after completing or encountering an error during the update process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }
    }

    // Function to get the iframe document
    const getIframeDocumentBySelector = (iframeSelector) => {
        const iframe = document.querySelector(iframeSelector);
        return iframe.contentDocument;
    }

    // Function to get the node from the iframe document
    const getNodeFromIframeDocument = (iframeDocument, uid) => {
        return iframeDocument.querySelector(`[data-id="${uid}"]`);
    }

    // Function to update the node value
    const updateNodeValue = (node, updatedElement) => {
        let childNode = node.querySelector(`[data-child="child-${updatedElement._uid}"]`);

        if (!childNode)
            childNode = node.querySelector(`[data-child="child-muted"]`);

        if (childNode && updatedElement.updateHTML) {
            updatedElement.nodeValue = childNode.innerHTML;
        }
    }

    // Function to update the class name and style of the node
    const updateNodeClassNameAndStyle = async (node, updatedElement, state) => {
        if (updatedElement.mainClass && updatedElement.mainClass !== updatedElement.className) {
            const iframe = document.querySelector("#ac-editor-iframe-doc")
            const iFrameDocument = iframe.contentDocument;

            updatedElement.className = updatedElement.mainClass;
            const selectors = updatedElement.selector.split(" ");
            selectors[selectors.length - 1] = "." + updatedElement.mainClass;
            updatedElement.selector = selectors.join(" ");

            const style = await getData(state.page._id, updatedElement.styleUid, 'id', STYLE_STORE_NAME);

            const selector = {
                _uid: style._uid,
                selectorText: updatedElement.selector,
                properties: state.selector?.properties || {}
            }

            onSelectSelector(selector, "")

            if (style) {
                style.selectorText = updatedElement.selector;
                createCss('normal', style, style.selectorText, iFrameDocument)

                if (state.media)
                    createCss(state.media, style, style.selectorText, iFrameDocument)

                await updateData(state.page._id, style, STYLE_STORE_NAME);
            }
        }
    }


    // Helper function to update the original node
    const updateOriginalNode = async (orignalNode) => {
        if (!orignalNode) {
            throw new Error('Element not found.');
        }
        const orignal = await getData(state.page._id, orignalNode._uid)
        await updateData(state.page._id, orignalNode);
        return { orignal, pageUpdated: { pos: pos, currentId: orignalNode._uid } };
    }

    // Function to handle the revert update operation
    const onUpdateRevert = useCallback(async (orignalNode, pos, STORE = UNDO_STORE_NAME, isRedo) => {
        // Start the update process
        dispatch({ type: 'start' });

        try {
            // Update the original node and get the updated data
            const { orignal, pageUpdated } = await updateOriginalNode(orignalNode);

            // Add an 'update' action to the undo/redo store
            onAddAction({ action: 'update', ...pageUpdated, orignal }, STORE, isRedo);

            // Update the state with the updated page data
            dispatch({ type: 'updatePage', pageUpdated });

        } catch (e) {
            // If an error occurs during the update process, dispatch an 'error' action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            // Finally, after completing or encountering an error during the update process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

    // Function to load a component
    const loadComponent = async (tag, iFramedocument) => {
        // Initialize a new tag object
        let newTag = {};

        // Check if the page id of the tag matches the current page id
        if (tag.page._id == state.page._id) {
            // If it does, throw an error
            throw new Error(`This ${tag.page.pageType} is Not Allowed.`);
        }

        // Fetch the page data associated with the tag
        let page = await getPageData(tag.page._id);

        // If the page data doesn't exist, load the page without style and add the component
        if (!page) {
            await loadPageWithoutStyle(tag.page, tag.page.pageType);
            const res = await getPageCss(tag.page.pageType, tag.page._id);
            await addStylesToIframeDocument(iFramedocument, res, tag.page._id);
            page = await getPageData(tag.page._id);
            await addComponent(tag);
        }

        // Update the new tag with the name of the page
        newTag = { ...tag, name: page.name };

        // Return the new tag
        return newTag;
    }



    // Helper function to load page without style
    const loadPageWithoutStyle = async (page, pageType) => {
        return await loadWithoutStyle(page, pageType, dispatch, false);
    }

    // Helper function to get page CSS
    const getPageCss = async (pageType, pageId) => {
        return await ThemeServices.getPageCss(pageType, pageId);
    }

    // Helper function to add styles to iframe document
    const addStylesToIframeDocument = async (iFramedocument, res, pageId) => {
        if (iFramedocument) {
            let style = iFramedocument.querySelector(`#ac-stylesheet-${pageId}`);
            if (!style) {
                style = iFramedocument.createElement('style');
                style.id = `ac-stylesheet-${pageId}`;
                iFramedocument.head.appendChild(style);
            }
            if (Array.isArray(res.css)) {
                style.textContent = res.css.join('\n');
            }
        }
    }

    // Function to add a component to the page
    const addComponent = async (tag) => {
        // Check if tag is provided
        if (!tag) {
            throw new Error('Tag is required to add a component.');
        }

        // Fetch the current page data
        const page = await getPageData(state.page._id);

        // Check if the page data exists
        if (!page) {
            throw new Error('Page data not found.');
        }

        // Get the page type from the tag
        const pageType = tag.page.pageType;

        // Check if the page type exists in the page data
        if (!page[pageType]) {
            page[pageType] = [];
        }

        // Add the component to the page data
        addComponentToPageData(page, pageType, tag.page._id);

        // Store the updated page data
        await storePage(page);
    }



    // Helper function to add a component to the page data
    const addComponentToPageData = (page, pageType, componentId) => {
        // Check if the component already exists in the page data
        if (!page[pageType].includes(componentId)) {
            // If it doesn't, add it
            page[pageType].push(componentId);
        }
    }

    // Function to delete a component from the page
    const deleteComponent = async (tag) => {
        // Fetch all data related to the current page
        const page = await getAllData(state.page._id);

        // Check if the page data exists
        if (page) {
            // Check if the page data contains an array of the page type
            if (Array.isArray(page[`${tag.page.pageType}s`])) {
                // Filter out the component to be deleted
                page[`${tag.page.pageType}s`] = filterPageComponents(page, tag);

                // Store the updated page data
                await storePage(page);

                // Remove the component's style from the iframe document
                removeComponentStyleFromIframe(tag);
            }
        }
    };

    // Helper function to filter out the component to be deleted from the page data
    const filterPageComponents = (page, tag) => {
        return page[`${tag.page.pageType}s`].filter(
            (id) => id !== tag.page._id
        );
    }

    // Helper function to remove the component's style from the iframe document
    const removeComponentStyleFromIframe = (tag) => {
        const iframe = document.querySelector("#ac-editor-iframe-doc");

        // Check if the iframe exists
        if (iframe) {
            const iFramedocument = iframe.contentDocument;
            let style = iFramedocument.querySelector(`#ac-stylesheet-${tag.page._id}`);

            // Check if the style exists
            if (style) {
                style.remove();
            }
        }
    }


    // Function to add a component to the page
    const onAdd = useCallback(async (
        tag,
        currentUid,
        addToAbove,
        pos,
        iFramedocument,
        STORE = UNDO_STORE_NAME) => {

        // Check if tag or currentUid is provided
        if (!tag || !currentUid) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        // Fetch the parent element data
        let parentElemet = await getData(state.page._id, currentUid);
        if (addToAbove)
            parentElemet = await getData(state.page._id, parentElemet.parent);

        // Check if the parent element data exists
        if (!parentElemet) {
            dispatch({ type: 'error', error: "Target element not found." });
            return false;
        }

        // Check if the parent element is a page
        if (parentElemet.page) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        // Check if the element can be added to the page
        if (!await onAddElement(parentElemet._uid, tag, state.page._id))
            return false;

        let status = false;
        try {
            dispatch({ type: 'start' });

            // Check if the iframe document is provided
            if (!iFramedocument) {
                const iframe = document.querySelector("#ac-editor-iframe-doc")
                iFramedocument = iframe.contentDocument;;
            }

            // Check if the tag is a page
            if (tag.page)
                tag = await loadComponent(tag, iFramedocument);

            // Add the element to the page and get the updated page data
            const pageUpdated = await addElement(
                tag,
                parentElemet,
                addToAbove,
                currentUid,
                pos,
                state,
                iFramedocument);

            // Update the state with the updated page data
            dispatch({
                type: 'updatePage', pageUpdated
            });

            // Check if the tag is not a menu
            if (!tag.addmenu)
                onAddAction({ action: 'delete', newId: pageUpdated.newId, pos: pos }, STORE);

            status = true;

        } catch (e) {
            // If an error occurs during the add process, dispatch an 'error' action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            status = false;

        } finally {
            // Finally, after completing or encountering an error during the add process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }

        return status;

    }, [state.page]);

    // Function to validate the parent element
    const validateParentElement = async (parentId) => {
        if (!parentId) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        let parentElement = await getData(state.page._id, parentId);

        if (!parentElement) {
            dispatch({ type: 'error', error: 'Target not found.' });
            return false;
        }

        return parentElement;
    }

    // Function to validate the current element
    const validateCurrentElement = async (newId) => {
        let currentElement = await getData(state.page._id, newId);

        if (!currentElement) {
            dispatch({ type: 'error', error: 'Element not found.' });
            return false;
        }

        return currentElement;
    }

    // Function to revert the addition of an element
    const onAddRevert = useCallback(async (parentId, newId, index, pos, STORE = UNDO_STORE_NAME, isRedo) => {
        // Validate the parent element
        let parentElement = await validateParentElement(parentId);
        if (!parentElement) return false;

        // Validate the current element
        let currentElement = await validateCurrentElement(newId);
        if (!currentElement) return false;

        let status = false;

        try {
            dispatch({ type: 'start' });

            // Revert the addition of the element
            parentElement.childNodes.splice(index, 0, newId);
            await updateData(state.page._id, parentElement);
            currentElement.deleted = false;
            await updateData(state.page._id, currentElement);

            // Revert the addition of the style
            let style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);
            if (style) {
                style.deleted = false;
                await updateData(state.page._id, style, STYLE_STORE_NAME);
            }

            // Update the page
            const pageUpdated = {
                pos: pos,
                parentId: parentElement._uid,
                newId
            }
            onAddAction({ action: 'delete', ...pageUpdated }, STORE, isRedo);

            dispatch({
                type: 'updatePage', pageUpdated
            });

            status = true;

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            status = false;

        } finally {
            dispatch({ type: 'finish' });
        }

        return status;

    }, [state.page]);

    // Function to delete a node
    const onDelete = useCallback(async (node, STORE = UNDO_STORE_NAME, isRedo) => {
        // Check if node is provided
        if (!node) return;

        // Extract the currentUid and position from the node
        const currentUid = node.dataset.id;
        const pos = node.dataset.pos;

        // Fetch the current element data
        let currentElement = await getData(state.page._id, currentUid);

        // Check if the current element data exists
        if (!currentElement) {
            throw new Error('Element not selected.');
        }

        // Check if the currentUid is '0'
        if (currentUid == '0') {
            throw new Error('Body cannot be deleted.');
        }

        // Start the delete process
        dispatch({ type: 'start' });
        try {
            // Fetch the parent element data
            let parentUid = currentElement.parent;
            const parent = await getData(state.page._id, parentUid);

            // Find the index of the currentUid in the parent's childNodes
            const index = parent.childNodes.indexOf(currentUid);

            // Check if the currentUid was found in the parent's childNodes
            if (index <= -1)
                throw new Error('Element not found.');

            // Remove the currentUid from the parent's childNodes
            parent.childNodes.splice(index, 1);
            await updateData(state.page._id, parent);

            // Mark the current element as deleted
            currentElement.deleted = true;
            await updateData(state.page._id, currentElement);

            // Fetch the style data of the current element
            const style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);

            // Check if the style data exists
            if (style) {
                // Mark the style as deleted
                style.deleted = true;
                await updateData(state.page._id, style, STYLE_STORE_NAME);
            }

            // Delete the current element
            onDeleteElement(currentElement, state.page._id);

            // Check if the current element is a page
            if (currentElement.page)
                deleteComponent(currentElement);

            // Prepare the updated page data
            const pageUpdated = {
                pos: pos,
                parentId: parent._uid,
            }

            // Update the state with the updated page data
            dispatch({
                type: 'updatePage', pageUpdated
            });

            // Dispatch a 'delete' action after a delay
            setTimeout(() => {
                dispatch({
                    type: 'delete'
                });
            })

            // Add an 'add' action to the undo/redo store
            onAddAction({
                action: 'add',
                index,
                pos,
                currentUid,
                parentUid
            }, STORE, isRedo);

        } catch (e) {
            // If an error occurs during the delete process, dispatch an 'error' action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            // Finally, after completing or encountering an error during the delete process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

    // Function to validate the target element
    const validateTargetElement = async (targetUid) => {
        if (!targetUid) {
            dispatch({ type: 'error', error: 'Target Element not selected.' });
            return false;
        }

        let targetElement = await getData(state.page._id, targetUid);

        if (!targetElement) {
            dispatch({ type: 'error', error: 'Target Element not found.' });
            return false;
        }

        return targetElement;
    }

    // Function to copy an element
    const onCopy = useCallback(async (node, deep = false, STORE = UNDO_STORE_NAME) => {
        // Check if node is provided
        if (!node) return;

        // Extract the currentUid, targetUid, addToAbove, copy, and pageId from the node
        const currentUid = node.dataset.id;
        const targetUid = node.dataset.targetId;
        const addToAbove = node.dataset.addToAbove;
        const copy = node.dataset.copy;
        const pageId = node.dataset.pageId || state.page._id;
        let pos = node.dataset.pos;

        // Fetch the current element data
        let currentElement = await getData(pageId, currentUid);

        // Check if the current element data exists
        if (!currentElement) {
            dispatch({ type: 'error', error: 'Element not selected.' });
            return false;
        }

        // Check if the currentUid is '0'
        if (currentUid == '0') {
            dispatch({ type: 'error', error: 'Body can not be clone.' });
            return false;
        }

        // Validate the target element
        let parentElement = await validateTargetElement(targetUid);
        if (!parentElement) return false;

        // If addToAbove or not copy, fetch the parent of the target element
        if (addToAbove || !copy)
            parentElement = await getData(state.page._id, parentElement.parent);

        // Check if the parent element exists
        if (!parentElement) {
            dispatch({ type: 'error', error: 'Target Element not found.' });
            return false;
        }

        // Check if the element can be added to the page
        if (!await onAddElement(parentElement._uid, { tag: currentElement.tagName }, state.page._id))
            return false;

        // Start the copy process
        dispatch({ type: 'start' });

        // Generate a unique id for the new element
        let id = nanoid(8);
        const unique_id = uuid();

        // Assign the unique id to the current element
        currentElement._uid = unique_id;

        // Fetch the iframe document
        const iframe = document.querySelector("#ac-editor-iframe-doc")
        let iFrameDocument = iframe.contentDocument;

        // If deep copy, update the className and selector of the current element
        if (deep) {
            const mainClass = currentElement.mainClass || "ac" + "-elem";

            currentElement.className = mainClass + "-" + id;
            const selectors = currentElement.selector.split(" ");
            selectors[selectors.length - 1] = "." + mainClass + "-" + id;
            currentElement.selector = selectors.join(" ");

            // Fetch the style data of the current element
            const style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);
            if (style) {
                // Generate a new id for the style
                let id = nanoid(8);
                style._uid = id;
                style.selectorText = currentElement.selector;
                currentElement.styleUid = id;

                // Create the new style in the iframe document
                createCss('normal', style, style.selectorText, iFrameDocument)

                if (state.media)
                    createCss(state.media, style, style.selectorText, iFrameDocument)

                // Update the style data
                await updateData(state.page._id, style, STYLE_STORE_NAME);

            }

        }

        // Copy the element
        await onCopyElement(currentElement, { media: state.media, page: { _id: pageId } }, deep, iFrameDocument);

        // If copy, add the new element to the parent element's childNodes at the correct position
        if (copy) {

            if (addToAbove) {
                let targetIndex = parentElement.childNodes.indexOf(targetUid);
                parentElement.childNodes.splice(targetIndex, 0, unique_id);
                pos = pos.slice(0, -1);

            }
            else {
                parentElement.childNodes.push(unique_id);
            }


        }
        else {
            // If not copy, add the new element to the parent element's childNodes after the current element
            const index = parentElement.childNodes.indexOf(currentUid);
            parentElement.childNodes.splice(index + 1, 0, unique_id);
            pos = pos.slice(0, -1);

        }

        // Update the parent element data
        await updateData(state.page._id, parentElement);

        // Update the current element data
    }, [state.page]);

    // Function to validate the move operation
    const validateMove = async (targetUid, currentUid) => {
        if (!targetUid || !currentUid) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        let currentElement = await getData(state.page._id, currentUid);
        let _parentElemet = await getData(state.page._id, targetUid);

        if (!_parentElemet || !currentElement) {
            dispatch({ type: 'error', error: 'Target Element Or Element not found.' });
            return false;
        }

        if (_parentElemet._uid === currentElement._uid) {
            dispatch({ type: 'error', error: 'Target Element is not valid.' });
            return false;
        }

        return { currentElement, _parentElemet };
    }

    // Function to move an element
    const onMove = useCallback(async (targetUid, currentUid, addToAbove, pos, dragPos, document, STORE = UNDO_STORE_NAME) => {
        // Validate the move operation
        const validation = await validateMove(targetUid, currentUid);
        if (!validation) return false;

        let { currentElement, _parentElemet } = validation;

        if (addToAbove)
            _parentElemet = await getData(state.page._id, _parentElemet.parent);

        if (_parentElemet.page) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        if (!_parentElemet) {
            dispatch({ type: 'error', error: 'Target Element Or Element not found.' });
            return false;
        }

        dispatch({ type: 'start' });

        let parentUid = currentElement.parent;

        const currentParent = await getData(state.page._id, parentUid);
        const currentIndex = currentParent.childNodes.indexOf(currentUid);

        if (currentIndex <= -1) {
            dispatch({ type: 'error', error: 'Element not found.' });
            return false;
        }

        currentParent.childNodes.splice(currentIndex, 1);
        await updateData(state.page._id, currentParent);

        let targetIndex = 0;
        let parentElemet = await getData(state.page._id, targetUid);
        if (addToAbove) {

            parentElemet = await getData(state.page._id, parentElemet.parent);
            targetIndex = parentElemet.childNodes.indexOf(targetUid);
            parentElemet.childNodes.splice(targetIndex, 0, currentUid);
            pos = pos.slice(0, -1);

        }
        else {
            parentElemet.childNodes.push(currentUid);
            targetIndex = parentElemet.childNodes.length - 1;
        }

        currentElement.parent = parentElemet._uid;

        await updateData(state.page._id, parentElemet);
        await updateData(state.page._id, currentElement);

        const pageUpdated = {
            pos: pos,
            dragPos: dragPos,
            newId: currentUid,
            parentId: parentElemet._uid,
            currentId: currentParent._uid
        }

        onAddAction({
            action: 'move',
            pos: pos,
            dragPos: dragPos,
            currentParentUid: parentElemet._uid,
            currentIndex: targetIndex,
            targetParentUid: currentParent._uid,
            targetIndex: currentIndex,
            newId: currentUid,
        }, STORE);

        dispatch({
            type: 'updatePage', pageUpdated
        });

        dispatch({ type: 'finish' });

    }, [state.page]);

    // Function to update the page
    const updatePage = async (pageId, pageData) => {
        await updateData(pageId, pageData);
    }

    // Function to update the element
    const updateElement = async (elementId, elementData) => {
        await updateData(state.page._id, elementData);
    }

    // Function to revert the move operation
    const onMoveRevert = useCallback(async (
        targetParentUid,
        targetIndex,
        currentParentUid,
        currentIndex,
        newId,
        pos,
        dragPos,
        STORE = UNDO_STORE_NAME, isRedo) => {

        try {
            dispatch({ type: 'start' });

            // Fetch the current parent data
            let currentParent = await getData(state.page._id, currentParentUid);
            // Remove the element from the current parent's childNodes
            currentParent.childNodes.splice(currentIndex, 1);
            // Update the current parent data
            await updatePage(state.page._id, currentParent);

            // Fetch the target parent data
            let targetParent = await getData(state.page._id, targetParentUid);
            // Add the element to the target parent's childNodes at the correct position
            targetParent.childNodes.splice(targetIndex, 0, newId);
            // Fetch the current element data
            let currentElement = await getData(state.page._id, newId);

            // Update the parent of the current element
            currentElement.parent = targetParent._uid;
            // Update the current element data
            await updateElement(newId, currentElement);
            // Update the target parent data
            await updatePage(state.page._id, targetParent);

            // Prepare the updated page data
            const pageUpdated = {
                pos: pos,
                dragPos: dragPos,
                newId,
                parentId: targetParentUid,
                currentId: currentParentUid
            }

            // Add a 'move' action to the undo/redo store
            onAddAction({
                action: 'move',
                pos: pos,
                dragPos: dragPos,
                currentParentUid: targetParent._uid,
                currentIndex: targetIndex,
                targetParentUid: currentParent._uid,
                targetIndex: currentIndex,
                newId,
            }, STORE, isRedo);

            // Update the state with the updated page data
            dispatch({
                type: 'updatePage', pageUpdated
            });

        } catch (e) {
            // If an error occurs during the move revert process, dispatch an 'error' action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            // Finally, after completing or encountering an error during the move revert process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }

    }, [state.page]);


    // State to hold the updated node
    const [updatedNode, setUpdated] = useState(null);

    // Effect to handle changes in the updatedNode state
    useEffect(() => {
        // If there is a change and updatedNode is not null, update the value
        if (state.isChange && updatedNode)
            updateValue(updatedNode);
    }, [updatedNode])

    // Function to update the node
    const onUpdate = useCallback(async (node) => {
        // Set the updated node state
        setUpdated({ ...node })
    }, []);

    // Function to handle form submission
    const onSubmit = async (previewMode) => {

        // If the state is loading, return to prevent multiple submissions
        if (state.loading)
            return;

        try {
            // If the page or type is not selected, throw an error
            if (!state.page || !state.type)
                throw new Error('Page or Type not selected!');

            // Start the submission process
            dispatch({ type: 'start' });

            const page = state.page;
            const type = state.type;

            // If preview mode is enabled, confirm before publishing the page
            if (previewMode) {
                Modal.confirm({
                    title: 'Publish Page',
                    content: 'Are you sure you want to publish this page?',
                    onOk: async () => {
                        try {
                            const res = await publishPage(page, type, dispatch);
                            message.success("Page Published.")
                        } catch (e) {
                            console.log(e)
                            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
                        }
                    },
                    onCancel: () => {
                        // Do nothing when the user cancels the confirmation
                    },
                });

            } else {
                // If not in preview mode, save the page
                if (state.node) {
                    await updateValue(state.node);
                }

                if (state.selector && state.isStyleChange) {
                    await onUpdateSelector(state.selector);
                }

                const res = await savePage(page, type, dispatch);

                dispatch({ type: 'savePage' });
            }

        } catch (e) {
            // Handle any errors that occur during the submission process
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Finally, after completing or encountering an error during the submission process, dispatch a 'finish' action
            dispatch({ type: 'finish' });
        }
    };



    // Function to fetch the iframe document
    const getIframeDocument = () => {
        const iframe = document.querySelector("#ac-editor-iframe-doc");
        const iframeDocument = iframe.contentDocument;
        if (!iframeDocument) {
            throw new Error('Iframe content document not found.');
        }
        return iframeDocument;
    }

    // Function to fetch the element data
    const getElementData = async (id) => {
        let element = await getData(state.page._id, id);
        if (!element) {
            throw new Error('Element data not found.');
        }
        return element;
    }

    // Function to handle the click event on an element
    const onClickElement = useCallback(async (iframeDocument, id) => {
        try {
            // Fetch the iframe document if not provided
            iframeDocument = iframeDocument || getIframeDocument();

            // Find the element in the iframe document using the provided id
            let node = iframeDocument.querySelector(`[data-id="${id}"]`);

            // If the node is not found, deselect the node and return
            if (!node) {
                dispatch({ type: 'selectNode', node: null });
                return;
            }

            // Fetch the element data
            let element = await getElementData(id);

            // Clear cursor style from any previously selected node
            if (state.node?.node) {
                state.node.node.style.cursor = null;
                state.node.node.style.outline = null;
            }

            // Remove outline from all elements
            const elements = iframeDocument.body.querySelectorAll("[data-id]");
            elements.forEach(element => {
                element.style.outline = null;
            });

            // Add outline to the selected node
            node.style.outline = '#2fc1ff dotted 3px';

            // Dispatch the selected node along with its data to the state
            dispatch({ type: 'selectNode', node: { node, ...element } });

            // Fetch the style data of the element
            let style = await getData(state.page._id, element.styleUid, 'id', STYLE_STORE_NAME);

            // If the style data exists, select the selector
            if (style) {
                const styleElement = style.style || {}
                const key = state.media || 'normal';
                styleElement[key] = styleElement[key] || {};
                styleElement[key]["root"] = styleElement[key]["root"] || {};

                const selector = {
                    _uid: style._uid,
                    selectorText: style.selectorText,
                    properties: styleElement[key]["root"].properties || {}
                }

                await onSelectSelector(selector, "")
            }
        } catch (error) {
            // Handle any errors that occur during the execution of the function
            dispatch({ type: 'error', error: error.message });
        }
    }, [state, state.page]);

    // Function to get the CSS rule
    const getCssRule = (cssRules, selectorText, elementstate) => {
        let rule = null;
        for (let i = 0; i < cssRules.length; i++) {
            let tempRule = cssRules[i];
            if (tempRule.selectorText === selectorText + elementstate) {
                rule = tempRule;
                break;
            }
        }
        return rule;
    }

    // Function to insert a new CSS rule
    const insertNewRule = (sheet, cssRules, selectorText, elementstate, properties) => {
        const newIndex = cssRules.length;
        let cssText = '';
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                const value = properties[property].value;
                cssText += `${property}: ${value}; `;
            }
        }
        sheet.insertRule(`${selectorText + elementstate} {${cssText}}`, newIndex);
        return cssRules[newIndex];
    }

    const onSelectSelector = async (newSelector, elementstate = '', STORE = UNDO_STORE_NAME, isRedo = false) => {
        try {
            // Check if the newSelector is valid
            if (!newSelector) {
                throw new Error('Selector not found.');
            }

            // If there is a change in style, update the selector
            if (state.selector && state.isStyleChange) {
                await onUpdateSelector(state.selector);
            }

            // Start the process
            dispatch({ type: 'start' });

            let { selectorText, properties = {}, store, _uid } = newSelector;

            // Get the iframe document
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            // Get the stylesheets of the iframe document
            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            // Find the global stylesheet
            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }

            let cssRules = sheet.cssRules || sheet.rules;
            let rule = null;

            // If media state exists, handle media rules
            if (state.media) {
                let cssMediaRule = null;

                // Find the media rule
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.conditionText === state.media) {
                        cssMediaRule = tempRule;
                        break;
                    }
                }

                // If media rule doesn't exist, create a new one
                if (!cssMediaRule) {
                    const mediaIndex = cssRules.length;
                    sheet.insertRule(`@media ${state.media} {}`, mediaIndex);
                    cssMediaRule = cssRules[mediaIndex];
                }

                let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;

                // Get the CSS rule
                rule = getCssRule(mediaRules, selectorText, elementstate);

                // If rule doesn't exist, insert a new rule
                if (!rule) {
                    rule = insertNewRule(cssMediaRule, mediaRules, selectorText, elementstate, properties);
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                // Get the CSS rule
                rule = getCssRule(cssRules, selectorText, elementstate);

                // If rule doesn't exist, insert a new rule
                if (!rule) {
                    rule = insertNewRule(sheet, cssRules, selectorText, elementstate, properties);
                }
            }

            // Prepare the selector data
            const selector = {
                style: rule.style,
                properties,
                selectorText: selectorText,
                selectorType: elementstate,
                key: state.media || 'normal',
                _uid,
                store
            };

            // Dispatch the selector data
            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            // Handle any errors
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Finish the process
            dispatch({ type: 'finish' });
        }
    };



    // Function to update the node value
    const updateNodeValues = useCallback(async () => {
        if (state.node) {
            await updateValue(state.node);
        }
    }, [state.node]);

    // Function to update the selector
    const updateSelectorValue = useCallback(async () => {
        if (state.selector && state.isStyleChange) {
            await onUpdateSelector(state.selector);
        }
    }, [state.selector, state.isStyleChange]);

    // Function to dispatch media changes
    const dispatchMediaChanges = useCallback((minMax, orientation, windowWidth) => {
        if (!windowWidth || windowWidth == '100%') {
            dispatch({ type: 'media', media: '' });
        } else {
            dispatch({ type: 'media', media: `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}` });
        }
    }, []);

    // Function to handle media changes
    const onChangeMedia = useCallback(async (minMax, orientation, windowWidth) => {
        // Update node value
        await updateNodeValues();

        // Update selector value
        await updateSelectorValue();

        // Dispatch media changes
        dispatchMediaChanges(minMax, orientation, windowWidth);

    }, [updateNodeValue, updateSelectorValue, dispatchMediaChanges]);

    // Function to get the global stylesheet
    const getGlobalStyleSheet = (styleSheets) => {
        let sheet = null;
        for (let i = 0; i < styleSheets.length; i++) {
            sheet = styleSheets[i];
            if (sheet.ownerNode.id === 'ac-stylesheet-global')
                break;
        }
        return sheet;
    }

    // Function to delete the CSS rule
    const deleteCssRule = (sheet, selectorText) => {
        for (var i = 0; i < sheet.cssRules.length; i++) {
            var rule = sheet.cssRules[i];
            if (rule.selectorText === selectorText) {
                sheet.deleteRule(i);
                break;
            }
        }
    }

    // Function to update the style data
    const updateStyleData = async (pageId, elementId, selector) => {
        const currentElement = await getData(pageId, elementId, 'id', STYLE_STORE_NAME);
        if (currentElement) {
            const style = currentElement.style || {};
            const selectorType = selector.selectorType || 'root';
            if (style[selector.key]) {
                delete style[selector.key][selectorType];
                await updateData(pageId, currentElement, STYLE_STORE_NAME);
            }
        }
    }

    const onDeleteSelector = async (selector) => {
        try {
            // Check if the selector is valid
            if (!selector)
                throw new Error('Selector not found!');

            // Get the iframe document
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            // Get the global stylesheet
            const sheet = getGlobalStyleSheet(iframeDocument.styleSheets);

            // Delete the CSS rule
            deleteCssRule(sheet, selector.selectorText);

            // Remove outline from all elements
            const elements = iframeDocument.body.querySelectorAll("[data-id]");
            elements.forEach(element => {
                element.style.outline = '1px dotted #bdbdbd';
            });

            // Update the style data
            if (selector.selectorType) {
                await updateStyleData(state.page._id, selector._uid, selector);
            } else {
                await deleteData(state.page._id, selector._uid, STYLE_STORE_NAME);
            }

            // Prepare the selector data
            const currSelector = {
                _uid: state.node._uid,
                selectorText: state.node.selector,
                store: PAGE_STORE_NAME,
            }

            // Select the current selector
            await onSelectSelector(currSelector, "")

            // Dispatch the update style action
            dispatch({ type: 'updateStyle' });

        } catch (e) {
            // Handle any errors
            dispatch({ type: 'error', error: e?.message || "Something was wrong." });
        }
    }

   

    
    // Function to insert a new CSS rule
    const insertUpdatedNewRule = (sheet, cssRules, selectorText, properties) => {
        const newIndex = cssRules.length;
        let cssText = '';
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                const value = properties[property].value;
                cssText += `${property}: ${value}; `;
            }
        }
        sheet.insertRule(`${selectorText} {${cssText}}`, newIndex);
        return cssRules[newIndex];
    }

   

    // Function to update the CSS rule
    const updateCssRule = (rule, properties) => {
        // Remove existing properties
        const styleDeclaration = rule.style;
        const propertiesList = Array.from(styleDeclaration);
        propertiesList.forEach(property => {
            styleDeclaration.removeProperty(property);
        });

        // Add new properties
        Object.keys(properties).forEach(key => {
            if (key) {
                const value = properties[key]?.value;
                const priority = properties[key]?.priority;
                rule.style.setProperty(key, value, priority);
            }
        });
    }

    // Function to update the style data
    const updateStylesData = async (selector, currentElement) => {
        const style = currentElement.style || {};
        const selectorType = selector.selectorType || 'root';

        if (!style[selector.key])
            style[selector.key] = { [selectorType]: {} }

        if (!style[selector.key][selectorType])
            style[selector.key][selectorType] = {}

        if (Object.keys(selector.properties).length <= 0)
            delete style[selector.key][selectorType];
        else
            style[selector.key][selectorType].properties = selector.properties || {};

        currentElement.style = style;

        await updateData(state.page._id, currentElement, STYLE_STORE_NAME);
    }

    const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
        // Check if the selector is valid
        if (!selector) {
            throw new Error('Selector not found!');
        }

        dispatch({ type: 'start' });

        try {
            const selectorText = selector.selectorText + selector.selectorType;
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = getGlobalStyleSheet(styleSheets);

            let cssRules = sheet.cssRules || sheet.rules;
            let rule = getCssRule(cssRules, selectorText, '');

            // If rule doesn't exist, insert a new rule
            if (!rule) {
                rule = insertUpdatedNewRule(sheet, cssRules, selectorText, selector.properties);
            } else {
                // If rule exists, update the rule
                updateCssRule(rule, selector.properties);
            }

            const currentElement = await getData(
                state.page._id,
                selector._uid, "id",
                STYLE_STORE_NAME);

            // Update the style data
            await updateStylesData(selector, currentElement);

            // Add a 'updateStyle' action to the undo/redo store
            onAddAction({
                action: 'updateStyle',
                selector: {
                    properties: currentElement.style[selector.key][selector.selectorType].properties || {},
                    key: selector.key,
                    selectorText: selector.selectorText,
                    selectorType: selector.selectorType,
                    _uid: selector._uid,
                    store: selector.store
                },
            }, STORE, isRedo);

            dispatch({ type: 'updateElement', style: false });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }
    };

    // Function to add an action to the store
    const onAddAction = async (action, STORE, isRedo) => {
        // If the action is not a redo action, delete all actions from the redo store
        if (!isRedo) {
            await deleteAllActions(REDO_STORE_NAME);
        }
        // Store the action in the specified store
        await storeAction(action, STORE);
    };

    // Function to perform an action based on the action type
    const performAction = async (STORE1, STORE2) => {
        // Get the action from the first store
        const action = await getAction(STORE1);

        // If no action is found, return
        if (!action)
            return;

        // Perform the action based on the action type
        switch (action.action) {
            case 'delete':
                await onDelete({ dataset: { id: action.newId, pos: action.pos } }, STORE2, true);
                break;
            case 'add':
                await onAddRevert(action.parentUid, action.currentUid, action.index, action.pos, STORE2, true);
                break;
            case 'move':
                await onMoveRevert(
                    action.targetParentUid,
                    action.targetIndex,
                    action.currentParentUid,
                    action.currentIndex,
                    action.newId,
                    action.dragPos,
                    action.pos,
                    STORE2, true);
                break;
            case 'update':
                await onUpdateRevert(
                    action.orignal,
                    action.pos,
                    STORE2, true);
                break;
            case 'updateStyle':
                await onUpdateSelector(
                    action.selector,
                    STORE2, true);
                break;
            default:
                break;
        }

        // Delete the action from the first store
        await deleteAction(STORE1);
    };

    // Function to undo an action
    const undo = async () => {
        await performAction(UNDO_STORE_NAME, REDO_STORE_NAME);
    };

    // Function to redo an action
    const redo = async () => {
        await performAction(REDO_STORE_NAME, UNDO_STORE_NAME);
    };

    // Function to handle changes
    const onChange = useCallback(async (style = false) => {
        // If style is true, update the element with style
        // Else, update the element with the current style change state
        if (style)
            dispatch({ type: 'updateElement', style });
        else
            dispatch({ type: 'updateElement', style: state.isStyleChange });

    }, [state.isStyleChange]);

    // Function to update states
    const onUpdateStates = useCallback(async (_id, states, setStates) => {
        // Dispatch an 'updateStates' action with the new states
        dispatch({ type: 'updateStates', states: { [_id]: { states, setStates } } });
    }, []);

    // Return the context provider with the state and functions
    return <>
        <pageContext.Provider value={{
            state,
            onSubmit,
            onSelectSelector,
            onUpdateSelector,
            onDeleteSelector,
            onChangeMedia,
            onUpdateStates,
            onAdd,
            onMove,
            onUpdate,
            onPreview,
            previewMode,
            setPreviewMode,
            onCopy,
            onChange,
            onDelete,
            onEdit,
            onClickElement,
            undo,
            redo,
        }}>
            <DndProvider backend={HTML5Backend}>
                {children}
            </DndProvider>
        </pageContext.Provider>
    </>

}


// Function to use page states
export function usePageStates() {
    // Use the context of the page
    const {
        state,
        onAddTemplate,
        onEdit,
        onClickElement,
        onAdd,
        onCopy,
        onDelete,
        onSelectSelector,
        onDeleteSelector,
        onUpdateSelector,
        onUpdateStates,
        previewMode,
        setPreviewMode,
        onChange,
        onChangeMedia,
        onMove,
        onPreview,
        onSubmit,
        onUpdate,
        undo,
        redo } = React.useContext(pageContext);

    // Return the state and functions
    return {
        state, 
        onEdit, 
        onAdd,
        onClickElement, 
        onMove, 
        onDelete,
        onSelectSelector,
        onDeleteSelector,
        previewMode,
        setPreviewMode,
        onUpdateStates,
        onPreview,
        onUpdateSelector,
        onChange,
        onChangeMedia,
        onAddTemplate, 
        onCopy, 
        onSubmit, 
        onUpdate, 
        undo, 
        redo
    }
}

