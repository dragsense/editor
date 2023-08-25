import React, { useReducer, useState, useEffect, useCallback } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
    loadPage, getData, updateData, updateStyleData, searchSelector,
    clearStore, UNDO_STORE_NAME, REDO_STORE_NAME, savePage, getAction, deleteAction, deleteAllActions, storeAction, STYLE_STORE_NAME, PAGE_STORE_NAME, deleteData, getAllData, loadWithoutStyle, storePage
} from '../../../../lib/db';
import addElement from '../../../../lib/element/addElement';
import addCSS from '../../../../lib/element/addCSS';

import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import ThemeServices from "../../../../lib/services/theme";
import HTMLTags from '../Panel/LeftPanel/Tag/htmlTags.json'
import { message } from "antd";

export const pageContext = React.createContext({});

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



const reducer = (state, action) => {



    switch (action.type) {
        case "start":
            return { ...state, loading: true, error: '' }
        case "laod":
            return {
                ...state, pageUpdated: action.pageUpdated,
            }
        case "edit":
            return {
                ...state,
                page: action.page,
                type: action.pageType,
                isChange: false,
            }
        case "updatePage":
            return {
                ...state, pageUpdated: action.pageUpdated,
                isChange: true,
            }

        case "updateStates":
            return {
                ...state, states: { ...state.states, ...action.states },
            }

        case "styleChange":
            return {
                ...state,
                isStyleChange: true,
            }
        case "updateElement":
            return {
                ...state,
                isChange: true,
                isStyleChange: action.style

            }
        case "close":
            return {
                ...state,
                isChange: false,

            }
        case "media":
            return { ...state, media: action.media, selector: null, node: null }
        case "savePage":
            return {
                ...state,
                isChange: false,
            }
        case "addSelector":
            return {
                ...state,
                selector: action.selector,
            }
        case "selectNode":
            return {
                ...state, node: action.node,

            }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;

    }
}

const getStyle = async (child) => {
    const style = {};
    for (const key of Object.keys(child.style)) {
        if (child.style[key]) {
            for (const ruleKey of Object.keys(child.style[key])) {
                if (Object.hasOwnProperty.call(child.style[key], ruleKey)) {
                    // Check if the ruleKey contains :hover, ::before, or ::after selector
                    const hasHoverSelector = /:hover/.test(ruleKey);
                    const hasBeforeSelector = /::before/.test(ruleKey);
                    const hasAfterSelector = /::after/.test(ruleKey);

                    // Update the selectorText based on the presence of :hover, ::before, or ::after selector
                    let selectorText = child.selector;
                    if (hasHoverSelector) {
                        selectorText += ":hover";
                    } else if (hasBeforeSelector) {
                        selectorText += "::before";
                    } else if (hasAfterSelector) {
                        selectorText += "::after";
                    }

                    if (!style[key]) {
                        style[key] = {};
                    }

                    style[key][selectorText] = {
                        ...child.style[key][ruleKey],
                        selectorText,
                    };
                }
            }
        }
    }
    return style;
};
const onAddElement = async (currentUid, tag, _id, level = 0) => {


    if (currentUid) {

        const element = await getData(_id, currentUid);
        const parentTag = HTMLTags[element.type]?.find(val => val.tag == element.tagName);



        if (parentTag && (parentTag.notaccept?.includes(tag.tag) || parentTag.notaccept?.includes(tag.type))) {
            message.error("This tag is not allowed within this element.")
            return false;
        }

        if (element.tagName == tag.tag)
            level = level + 1;
        else
            level = 0;

        if (level > 10) {
            message.error("This tag reached maximum level within this element.")
            return false;
        }


        return await onAddElement(element.parent, tag, _id, level);

    }


    return true;
}

const createCss = (key, style, selectorText, iFrameDocument) => {

    const styleSheets = iFrameDocument.styleSheets;
    let sheet = null;

    for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
            break;
    }

    let cssRules = sheet.cssRules || sheet.rules;


    const styleElement = style.style;

    if (!styleElement[key])
        styleElement[key] = { ['root']: {} }

    const properties = styleElement[key]['root'].properties || {}

    let cssText = '';
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const value = properties[property].value;
            cssText += `${property}: ${value}; `;
        }
    }

    sheet.insertRule(`${selectorText} {${cssText}}`, cssRules.length);

}

const onCopyElement = async (currentElement, state, deep = false, iFrameDocument) => {
    if (Array.isArray(currentElement.childNodes)) {
        const newChilds = await Promise.all(currentElement.childNodes.map(async (_uid) => {
            const child = await getData(state.page._id, _uid);
            const unique_id = uuid();
            let id = nanoid(8);
            child._uid = unique_id;

            if (deep) {

                const mainClass = child.mainClass || "ac" + "-elem-";

                child.className = mainClass + "-" + id;
                const selectors = child.selector.split(" ");
                selectors[selectors.length - 1] = "." + mainClass + id;
                child.selector = selectors.join(" ");

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

            child.parent = currentElement._uid;


            await onCopyElement(child, state, deep, iFrameDocument);
            await updateData(state.page._id, child);
            return unique_id;
        }));
        currentElement.childNodes = newChilds;
    }
}

export const onDeleteElement = async (currentElement, _id) => {

    if (Array.isArray(currentElement.childNodes))
        await Promise.all(
            currentElement.childNodes.map(async _uid => {
                const child = await getData(_id, _uid)
                if (child) {
                    child.deleted = true;
                    await onDeleteElement(child, _id);

                    await updateData(_id, child);

                    const style = await getData(_id, child.styleUid, 'id', STYLE_STORE_NAME);

                    if (style) {
                        style.deleted = true;
                        await updateData(_id, style, STYLE_STORE_NAME);
                    }


                }
            }));
}

export default function PageManger({ children }) {

    const [state, dispatch] = useReducer(reducer, initial);


    useEffect(() => {
        async function promptBeforeClose(event) {

            if (state.isChange) {
                event.preventDefault();

                const shouldSave = await window.autocode.checkUnsavedChanges(state.isChange);

                if (shouldSave) {
                    await onSubmit();
                }

                setTimeout(() => {
                    window.close();
                }, 100);


            }

            dispatch({ type: 'close' });

        }

        window.addEventListener('beforeunload', promptBeforeClose);

        return () => {
            window.removeEventListener('beforeunload', promptBeforeClose);
        };
    }, [state.isChange]);


    const onEdit = async (page, type) => {
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
            dispatch({ type: 'laod', pageUpdated: 0 });

            // Load the selected page data asynchronously and update the state with the loaded data.
            await loadPage(page, type, dispatch);

            // After loading the page data, update the 'pageUpdated' flag to indicate that the update is completed.
            setTimeout(() => dispatch({ type: 'laod', pageUpdated: 1 }));
        } catch (e) {
            // If an error occurs during the edit process, dispatch an 'error' action with the error message.
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Finally, after completing or encountering an error during the edit process, dispatch a 'finish' action.
            dispatch({ type: 'finish' });
        }
    };

    const updateValue = async (updatedElement, STORE = UNDO_STORE_NAME) => {

        if (!updatedElement) {
            dispatch({ type: 'error', error: 'Element not selected.' });
            return;
        }

        dispatch({ type: 'start' });

        const iframe = document.querySelector("#ac-editor-iframe-doc");
        const iframeDocument = iframe.contentDocument;
        if (!iframeDocument) {
            throw new Error('Iframe content document not found.');
        }

        let node = iframeDocument.querySelector(`[data-id="${updatedElement._uid}"]`);

        if (!node) {
            dispatch({ type: 'error', error: 'Node not found.' });
            return;
        }

        const currentUid = node.dataset.id;
        const pos = node.dataset.pos;



        try {


            let childNode = node.querySelector(`[data-child="child-${currentUid}"]`);

            if (!childNode)
                childNode = node.querySelector(`[data-child="child-muted"]`);

            console.log(updatedElement.updateHTML)

            if (childNode && updatedElement.updateHTML) {
                updatedElement.nodeValue = childNode.innerHTML;
            }


            if (updatedElement.mainClass !== updatedElement.className && updatedElement.mainClass) {


                const iframe = document.querySelector("#ac-editor-iframe-doc")
                const iFrameDocument = iframe.contentDocument;

                updatedElement.className = updatedElement.mainClass;
                const selectors = updatedElement.selector.split(" ");
                selectors[selectors.length - 1] = "." + updatedElement.mainClass;
                updatedElement.selector = selectors.join(" ");

                const style = await getData(state.page._id, updatedElement.styleUid, 'id', STYLE_STORE_NAME);
                if (style) {
                    style.selectorText = updatedElement.selector;
                    createCss('normal', style, style.selectorText, iFrameDocument)

                    if (state.media)
                        createCss(state.media, style, style.selectorText, iFrameDocument)

                    await updateData(state.page._id, style, STYLE_STORE_NAME);

                }

            }

            delete updatedElement.updateHTML;
            delete updatedElement.mainClass;

            const orignal = await getData(state.page._id, updatedElement._uid)

            await updateData(state.page._id, {
                ...updatedElement, updateHTML: undefined,
                node: undefined, mainClass: undefined
            });

            const pageUpdated = { pos: pos, currentId: currentUid };

            onAddAction({ action: 'update', ...pageUpdated, orignal }, STORE);


            dispatch({ type: 'updatePage', pageUpdated });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }
    }


    const onUpdateRevert = useCallback(async (orignalNode, pos, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });


        if (!orignalNode) {
            dispatch({ type: 'error', error: 'Element not found.' });
            return;
        }

        try {

            const orignal = await getData(state.page._id, orignalNode._uid)

            await updateData(state.page._id, orignalNode);

            const pageUpdated = { pos: pos, currentId: orignalNode._uid };

            onAddAction({ action: 'update', ...pageUpdated, orignal }, STORE, isRedo);


            dispatch({ type: 'updatePage', pageUpdated });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

    const loadComponent = async (tag, iFramedocument) => {

        let newTag = {};

        if (tag.page._id == state.page._id) {
            throw new Error(`This ${tag.page.pageType} is Not Allowed.`);
        }



        let page = await getAllData(tag.page._id);

        if (!page) {
            await loadWithoutStyle(tag.page, tag.page.pageType, dispatch, false);
            const res = await ThemeServices.getPageCss(tag.page.pageType, tag.page._id);
            if (iFramedocument) {
                let style = iFramedocument.createElement('style');
                style.textContent = res.css;
                iFramedocument.head.appendChild(style);
            }

            page = await getAllData(tag.page._id);

            await addComponent(tag);


        }



        newTag = { ...tag, name: page.name };


        return newTag;

    }

    const addComponent = async (tag) => {
        const page = await getAllData(state.page._id);
        if (!Array.isArray(page[`${tag.page.pageType}s`]))
            page[`${tag.page.pageType}s`] = [];
        page[`${tag.page.pageType}s`] = [...(new Set([...page[`${tag.page.pageType}s`], tag.page._id]))]
        await storePage(page);
    }

    const deleteComponent = async (tag) => {
        const page = await getAllData(state.page._id);

        if (page) {
            if (Array.isArray(page[`${tag.page.pageType}s`])) {
                page[`${tag.page.pageType}s`] = page[`${tag.page.pageType}s`].filter(
                    (id) => id !== tag.page._id
                );
                await storePage(page);
            }
        }
    };


    const onAdd = useCallback(async (
        tag,
        currentUid,
        addToAbove,
        pos,
        iFramedocument,
        STORE = UNDO_STORE_NAME) => {


        if (!tag || !currentUid) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }


        let parentElemet = await getData(state.page._id, currentUid);
        if (addToAbove)
            parentElemet = await getData(state.page._id, parentElemet.parent);


        if (!parentElemet) {
            dispatch({ type: 'error', error: "Target element not found." });
            return false;
        }

        if (!await onAddElement(parentElemet._uid, tag, state.page._id))
            return false;


        let status = false;
        try {
            dispatch({ type: 'start' });

            if (!iFramedocument) {
                const iframe = document.querySelector("#ac-editor-iframe-doc")
                iFramedocument = iframe.contentDocument;;
            }

            if (tag.page)
                tag = await loadComponent(tag, iFramedocument);

            const pageUpdated = await addElement(
                tag,
                parentElemet,
                addToAbove,
                currentUid,
                pos,
                state,
                iFramedocument);

            dispatch({
                type: 'updatePage', pageUpdated
            });

            if (!tag.addmenu)
                onAddAction({ action: 'delete', newId: pageUpdated.newId, pos: pos }, STORE);

            status = true;

        } catch (e) {


            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            status = false;


        } finally {
            dispatch({ type: 'finish' });

        }

        return status;

    }, [state.page]);

    const onAddRevert = useCallback(async (parentId, newId, index, pos, STORE = UNDO_STORE_NAME, isRedo) => {


        if (!parentId) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        let parentElemet = await getData(state.page._id, parentId);

        if (!parentElemet) {
            dispatch({ type: 'error', error: 'Target not found.' });

            return false;
        }

        let currentElement = await getData(state.page._id, newId);

        if (!currentElement) {
            dispatch({ type: 'error', error: 'Element not found.' });

            return false;
        }


        let status = false;

        try {
            dispatch({ type: 'start' });

            parentElemet.childNodes.splice(index, 0, newId);
            await updateData(state.page._id, parentElemet);
            currentElement.deleted = false;
            await updateData(state.page._id, currentElement);

            let style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);
            if (style) {
                style.deleted = false;
                await updateData(state.page._id, style, STYLE_STORE_NAME);
            }


            const pageUpdated = {
                pos: pos,
                parentId: parentElemet._uid,
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

    const onDelete = useCallback(async (node, STORE = UNDO_STORE_NAME, isRedo) => {

        try {

            if (!node)
                return;

            const currentUid = node.dataset.id;
            const pos = node.dataset.pos;

            let currentElement = await getData(state.page._id, currentUid);


            if (!currentElement) {

                throw new Error('Element not selected.');
            }

            if (currentUid == '0') {
                throw new Error('Body can not be deleted.');
            }

            dispatch({ type: 'start' });


            let parentUid = currentElement.parent;

            const parent = await getData(state.page._id, parentUid);
            const index = parent.childNodes.indexOf(currentUid);

            if (index <= -1)
                throw new Error('Element not found.');

            parent.childNodes.splice(index, 1);
            await updateData(state.page._id, parent);
            currentElement.deleted = true;
            await updateData(state.page._id, currentElement);

            const style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);

            if (style) {
                style.deleted = true;
                await updateData(state.page._id, style, STYLE_STORE_NAME);
            }

            onDeleteElement(currentElement, state.page._id);

            if (currentElement.page)
                deleteComponent(currentElement);


            const pageUpdated = {
                pos: pos,
                parentId: parent._uid,
            }


            dispatch({
                type: 'updatePage', pageUpdated
            });

            onAddAction({
                action: 'add',
                index,
                pos,
                currentUid,
                parentUid
            }, STORE, isRedo);


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

    const onCopy = useCallback(async (node, deep = false, STORE = UNDO_STORE_NAME) => {

        try {

            if (!node)
                return;

            const currentUid = node.dataset.id;
            const targetUid = node.dataset.targetId;
            const addToAbove = node.dataset.addToAbove;
            const copy = node.dataset.copy;
            const pageId = node.dataset.pageId || state.page._id;
            let pos = node.dataset.pos;

            let currentElement = await getData(pageId, currentUid);




            let parentElemet = await getData(state.page._id, targetUid);

            if (!parentElemet) {
                throw new Error('Target Element not found.');
            }

            if (addToAbove || !copy)
                parentElemet = await getData(state.page._id, parentElemet.parent);

            if (!parentElemet) {
                throw new Error('Target Element not found.');
            }

            if (!currentElement) {
                throw new Error('Element not selected.');
            }

            if (currentElement._uid == '0') {
                throw new Error('Body can not be clone.');
            }

            if (!await onAddElement(parentElemet._uid, { tag: currentElement.tagName }, state.page._id))
                return false;


            dispatch({ type: 'start' });

            let id = nanoid(8);
            const unique_id = uuid();

            currentElement._uid = unique_id;


            const iframe = document.querySelector("#ac-editor-iframe-doc")
            let iFrameDocument = iframe.contentDocument;

            if (deep) {
                const mainClass = currentElement.mainClass || "ac" + "-elem";

                currentElement.className = mainClass + "-" + id;
                const selectors = currentElement.selector.split(" ");
                selectors[selectors.length - 1] = "." + mainClass + "-" + id;
                currentElement.selector = selectors.join(" ");

                const style = await getData(state.page._id, currentElement.styleUid, 'id', STYLE_STORE_NAME);
                if (style) {
                    let id = nanoid(8);
                    style._uid = id;
                    style.selectorText = currentElement.selector;
                    currentElement.styleUid = id;


                    createCss('normal', style, style.selectorText, iFrameDocument)

                    if (state.media)
                        createCss(state.media, style, style.selectorText, iFrameDocument)

                    await updateData(state.page._id, style, STYLE_STORE_NAME);

                }

            }


            await onCopyElement(currentElement, { media: state.media, page: { _id: pageId } }, deep, iFrameDocument);


            if (copy) {

                if (addToAbove) {
                    let targetIndex = parentElemet.childNodes.indexOf(targetUid);
                    parentElemet.childNodes.splice(targetIndex, 0, unique_id);
                    pos = pos.slice(0, -1);

                }
                else {
                    parentElemet.childNodes.push(unique_id);
                }


            }
            else {
                const index = parentElemet.childNodes.indexOf(currentUid);
                parentElemet.childNodes.splice(index + 1, 0, unique_id);
                pos = pos.slice(0, -1);

            }


            await updateData(state.page._id, parentElemet);
            await updateData(state.page._id, currentElement);


            const pageUpdated = {
                pos,
                parentId: parentElemet._uid,
                newId: unique_id
            }


            dispatch({
                type: 'updatePage',
                pageUpdated
            });

            onAddAction({ action: 'delete', pos: pos.slice(0, -1), newId: unique_id }, STORE);



        } catch (e) {


            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

    const onMove = useCallback(async (targetUid, currentUid, addToAbove, pos, dragPos, document, STORE = UNDO_STORE_NAME) => {

        if (!targetUid || !currentUid) {
            dispatch({ type: 'error', error: 'Tag or Element not selected.' });
            return false;
        }

        let currentElement = await getData(state.page._id, currentUid);
        let parentElemet = await getData(state.page._id, targetUid);

        if (!parentElemet) {
            throw new Error('Target Element not found.');
        }

        if (addToAbove)
            parentElemet = await getData(state.page._id, parentElemet.parent);


        if (!parentElemet || !currentElement) {
            throw new Error('Target Element Or Element not found.');
        }


        try {
            dispatch({ type: 'start' });

            let parentUid = currentElement.parent;

            const currentParent = await getData(state.page._id, parentUid);
            const currentIndex = currentParent.childNodes.indexOf(currentUid);


            if (currentIndex <= -1) {
                throw new Error('Element not found.');
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


        } catch (e) {



            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.page]);

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

            let currentParent = await getData(state.page._id, currentParentUid);
            currentParent.childNodes.splice(currentIndex, 1);
            await updateData(state.page._id, currentParent);



            let targetParent = await getData(state.page._id, targetParentUid);
            targetParent.childNodes.splice(targetIndex, 0, newId);
            let currentElement = await getData(state.page._id, newId);

            currentElement.parent = targetParent._uid;
            await updateData(state.page._id, currentElement);
            await updateData(state.page._id, targetParent);


            const pageUpdated = {
                pos: pos,
                dragPos: dragPos,
                newId,
                parentId: targetParentUid,
                currentId: currentParentUid
            }

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


            dispatch({
                type: 'updatePage', pageUpdated
            });

        } catch (e) {



            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.page]);


    const [updatedNode, setUpdated] = useState(null);

    useEffect(() => {

        if (state.isChange && updatedNode)
            updateValue(updatedNode);

    }, [updatedNode])


    const onUpdate = useCallback(async (node) => {
        setUpdated({ ...node })
    }, []);




    const onSubmit = async () => {

        try {

            if (!state.page || !state.type)
                throw new Error('Page or Type not selected!');

            dispatch({ type: 'start' });

            const page = state.page;
            const type = state.type;


            if (state.node) {
                await updateValue(state.node);
            }

            if (state.selector && state.isStyleChange) {
                await onUpdateSelector(state.selector);
            }

            // if (state.selector) {
            //     const selector = { ...state.selector, key: undefined, style: undefined }
            //     const key = state.selector.key;
            //     await updateStyleData({ type: key[0], elementType: key[1], ...selector }, key);
            // }

            const res = await savePage(page, type);

            // onEdit(res[type], type);
            dispatch({ type: 'savePage' });


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };



    const onClickElement = useCallback(async (iframeDocument, id) => {




        try {
            // If iframeDocument is not provided, try to find it using the default selector
            if (!iframeDocument) {
                const iframe = document.querySelector("#ac-editor-iframe-doc");
                iframeDocument = iframe.contentDocument;
                if (!iframeDocument) {
                    throw new Error('Iframe content document not found.');
                }
            }

            // Find the element in the iframe document using the provided id
            let node = iframeDocument.querySelector(`[data-id="${id}"]`);


            if (!node) {
                dispatch({ type: 'selectNode', node: null });
                return;
            }

            // Fetch element data asynchronously
            let element = await getData(state.page._id, id);

            if (!element) {
                node = node.closest('div[data-name="disabled-component"]');
                if (node) {
                    node = node.firstElementChild;
                    const id = node.dataset.id;
                    element = await getData(state.page._id, id);

                }
            }

            if (!element) {
                throw new Error('Element data not found.');
            }

            // Clear cursor style from any previously selected node
            if (state.node?.node) {
                state.node.node.style.cursor = null;
                state.node.node.style.outline = null;

            }

            const elements = iframeDocument.body.querySelectorAll("[data-id]");

            elements.forEach(element => {
                element.style.outline = null;
            });


            node.style.outline = '#2fc1ff dotted 3px';
            // Dispatch the selected node along with its data to the state
            dispatch({ type: 'selectNode', node: { node, ...element } });

            if (state.selector && state.isStyleChange) {
                await onUpdateSelector(state.selector);
            }

            let style = await getData(state.page._id, element.styleUid, 'id', STYLE_STORE_NAME);


            if (style) {

                const styleELement = style.style || {}

                const key = state.media || 'normal';

                if (!styleELement[key])
                    styleELement[key] = {}

                if (!styleELement[key]["root"])
                    styleELement[key]["root"] = {}


                const selector = {
                    _uid: style._uid,
                    selectorText: style.selectorText,
                    properties: styleELement[key]["root"].properties || {}

                }


                await onSelectSelector(selector, "")
            }
        } catch (error) {
            // Handle any errors that occur during the execution of the function
            dispatch({ type: 'error', error: error.message });
        }
    }, [state]);

    const onSelectSelector = async (newSelector, elementstate = '', STORE = UNDO_STORE_NAME, isRedo = false) => {



        try {

            if (!newSelector) {
                throw new Error('Selector not found.');
            }

            dispatch({ type: 'start' });


            let { selectorText, properties = {}, store, _uid } = newSelector;


            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }

            let cssRules = sheet.cssRules || sheet.rules;

            let rule = null;

            if (state.media) {
                let cssMediaRule = null;

                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.conditionText === state.media) {
                        cssMediaRule = tempRule;
                        break;
                    }
                }

                if (!cssMediaRule) {
                    const mediaIndex = cssRules.length;
                    sheet.insertRule(`@media ${state.media} {}`, mediaIndex);
                    cssMediaRule = cssRules[mediaIndex];
                }

                let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;

                for (let i = 0; i < mediaRules.length; i++) {
                    let tempRule = mediaRules[i];
                    if (tempRule.selectorText === selectorText + elementstate) {
                        rule = tempRule;
                        break;
                    }
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.selectorText === selectorText + elementstate) {
                        rule = tempRule;
                        break;
                    }
                }
            }

            //const tagName = state.node.layout === 'root' ? 'root' : state.node.tagName;

            if (!rule) {
                const newIndex = cssRules.length;

                let cssText = '';
                for (const property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        const value = properties[property].value;
                        cssText += `${property}: ${value}; `;
                    }
                }



                sheet.insertRule(`${selectorText + elementstate} {${cssText}}`, newIndex);
                rule = cssRules[newIndex];
            }


            // const elements = iframeDocument.body.querySelectorAll("[data-id]");
            // const ruleSelector = rule.selectorText;

            // elements.forEach(element => {
            //     element.style.outline = null;

            //     if (element.matches(ruleSelector)) {
            //         element.style.outline = '#e89b49c2 dotted 1px';
            //         element.style.outlineOffset = '6px';


            //     }
            // });

            const selector = {
                style: rule.style,
                properties,
                selectorText: selectorText,
                selectorType: elementstate,
                key: state.media || 'normal',
                _uid,
                store
            };




            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }



    };



    const onChangeMedia = useCallback(async (minMax, orientation, windowWidth) => {

        if (state.node) {
            await updateValue(state.node);
        }

        if (state.selector && state.isStyleChange) {
            await onUpdateSelector(state.selector);
        }

        if (!windowWidth || windowWidth == '100%')
            dispatch({ type: 'media', media: '' })
        else {
            dispatch({ type: 'media', media: `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}` })

        }

    }, [state.node, state.selector, state.isStyleChange]);

    const onDeleteSelector = async (selector) => {
        try {

            if (!selector)
                throw new Error('Selector not found!');

            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }


            const { _uid,
                selectorType,
                selectorText } = selector;


            for (var i = 0; i < sheet.cssRules.length; i++) {
                var rule = sheet.cssRules[i];
                if (rule.selectorText === selectorText) {
                    sheet.deleteRule(i);
                    break;
                }
            }

            const elements = iframeDocument.body.querySelectorAll("[data-id]");
            elements.forEach(element => {
                element.style.outline = '1px dotted #bdbdbd';
            });

            if (!selectorType)
                await deleteData(state.page._id, _uid, STYLE_STORE_NAME);
            else {
                const currentElement = await getData(state.page._id, _uid, 'id', STYLE_STORE_NAME);

                if (currentElement) {

                    const style = currentElement.style || {};

                    const selectorType = selector.selectorType || 'root';

                    if (!style[selector.key])
                        style[selector.key] = { [selectorType]: {} }


                    if (!style[selector.key][selectorType])
                        style[selector.key][selectorType] = {}


                    delete style[selector.key][selectorType];
                    await updateData(state.page._id, currentElement, STYLE_STORE_NAME);
                }
            }


            const currSelector = {
                _uid: state.node._uid,
                selectorText: state.node.selector,
                store: PAGE_STORE_NAME,

            }
            await onSelectSelector(currSelector, "")


            dispatch({ type: 'updateStyle' });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || "Someting was wrong." });

        }
        finally {
        }

    }

    const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });

        try {

            if (!selector) {
                throw new Error('Selector not found!');
            }


            const selectorText = selector.selectorText + selector.selectorType;
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }

            let cssRules = sheet.cssRules || sheet.rules;

            let rule = null;

            if (selector.key !== 'normal') {
                let cssMediaRule = null;

                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.conditionText === selector.key) {
                        cssMediaRule = tempRule;
                        break;
                    }
                }

                if (!cssMediaRule) {
                    const mediaIndex = cssRules.length;
                    sheet.insertRule(`@media ${selector.key} {}`, mediaIndex);
                    cssMediaRule = cssRules[mediaIndex];
                }

                let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;

                for (let i = 0; i < mediaRules.length; i++) {
                    let tempRule = mediaRules[i];
                    if (tempRule.selectorText === selector.selectorText + selector.selectorType) {
                        rule = tempRule;
                        break;
                    }
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.selectorText === selector.selectorText + selector.selectorType) {
                        rule = tempRule;
                        break;
                    }
                }
            }

            if (rule) {
                // Remove existing properties

                const styleDeclaration = rule.style;
                const properties = Array.from(styleDeclaration);
                properties.forEach(property => {
                    styleDeclaration.removeProperty(property);
                });

                if (!selector.properties)
                    selector.properties = {};

                Object.keys(selector.properties).forEach(key => {

                    if (key) {

                        const value = selector.properties[key]?.value;

                        const priority = selector.properties[key]?.priority;
                        rule.style.setProperty(key, value, priority);
                    }

                });
            }

            const currentElement = await getData(
                state.page._id,
                selector._uid, "id",
                STYLE_STORE_NAME);
            const style = currentElement.style || {};

            const selectorType = selector.selectorType || 'root';

            console.log(selector.key)
            if (!style[selector.key])
                style[selector.key] = { [selectorType]: {} }


            if (!style[selector.key][selectorType])
                style[selector.key][selectorType] = {}


            onAddAction({
                action: 'updateStyle',
                selector: {
                    properties: style[selector.key][selectorType].properties || {},
                    key: selector.key,
                    selectorText: selector.selectorText,
                    selectorType: selector.selectorType,
                    _uid: selector._uid,
                    store: selector.store
                },
            }, STORE, isRedo);


            if (Object.keys(selector.properties).length <= 0)
                delete style[selector.key][selectorType];
            else
                style[selector.key][selectorType].properties = selector.properties || {};

            currentElement.style = style;

            await updateData(state.page._id, currentElement, STYLE_STORE_NAME);

            dispatch({ type: 'updateElement', style: false });


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        }
        finally {
            dispatch({ type: 'finish' });

        }


    };

    const onAddAction = async (action, STORE, isRedo) => {

        if (!isRedo) {
            // const actions = await getAllActions(REDO_STORE_NAME);
            await deleteAllActions(REDO_STORE_NAME);

            //await storeActions(actions, UNDO_STORE_NAME)
        }

        await storeAction(action, STORE);
    };

    const performAction = async (STORE1, STORE2) => {
        const action = await getAction(STORE1);

        if (!action)
            return;

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

        await deleteAction(STORE1);
    };

    const undo = async () => {
        await performAction(UNDO_STORE_NAME, REDO_STORE_NAME);
    };

    const redo = async () => {
        await performAction(REDO_STORE_NAME, UNDO_STORE_NAME);
    };


    const onChange = useCallback(async (style = false) => {

        if (style)
            dispatch({ type: 'updateElement', style });
        else
            dispatch({ type: 'updateElement', style: state.isStyleChange });

    }, [state.isStyleChange]);

    const onUpdateStates = useCallback(async (_id, states, setStates) => {



        dispatch({ type: 'updateStates', states: { [_id]: { states, setStates } } });


    }, []);

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


export function usePageStates() {
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
        onChange,
        onChangeMedia,
        onMove,
        onSubmit,
        onUpdate,
        undo,
        redo } = React.useContext(pageContext);
    return {
        state, onEdit, onAdd,
        onClickElement, onMove, onDelete,
        onSelectSelector,
        onDeleteSelector,
        onUpdateStates,
        onUpdateSelector,
        onChange,
        onChangeMedia,
        onAddTemplate, onCopy, onSubmit, onUpdate, undo, redo
    }
}
