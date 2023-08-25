import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fetcher } from "../../../../lib/fetch";
import React, { useEffect, useReducer, useState, useCallback } from "react";
import HTMLTags from '../Panel/LeftPanel/Tag/htmlTags.json'

import {
    loadPage, savePage, loadWithoutStyle,
    storeData, getAllActions, storeActions, deletePageData,
    deleteAllActions, updateStyleData, deleteData, updateData, getData,
    storeAction, getAction, searchSelector,
    deleteAction, getAllData, storePage, clearStore, UNDO_STORE_NAME, REDO_STORE_NAME
} from '../../../../lib/db';
import { message } from 'antd';

import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import ThemeServices from '../../../../lib/services/theme';


import addCSS from '../../../../lib/element/addCSS';
import addElement from '../../../../lib/element/addElement';

export const pageContext = React.createContext({});


const initial = {
    elements: [],
    page: null,
    node: null,
    selector: null,

    element: null,
    document: null,
    error: '',
    loading: true
}



const reducer = (state, action) => {

    const deleteSelector = async () => {
        const selectorText = action.selectorText;
        if (selectorText) {
            const key = state.selector.key;
            await updateStyleData({ type: key[0], elementType: key[1], selectorText }, key, true);
        }
    }


    const addSelector = async () => {

        const selectorText = action.selector.selectorText;

        if (selectorText) {
            let selector = { ...action.selector, key: undefined, style: undefined };
            const key = action.selector.key;
            await updateStyleData({ type: key[0], elementType: key[1], ...selector }, key);
        }

    }


    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "laod":
            return {
                ...state, document: action.document,
                error: ''
            }
        case "updatePage":
            return {
                ...state, innerHTML: undefined, pageUpdated: action.pageUpdated,
                isChange: true,
                error: ''
            }
        case "updateElement":
            return {
                ...state, innerHTML: action.innerHTML, isUpdate: !state.isUpdate,
                error: ''
            }
        case "selectNode":
            return {
                ...state, node: action.node,
                error: ''
            }
        case "addSelector":
            addSelector();
            return {
                ...state,
                selector: action.selector,
                error: ''
            }
        case "deleteSelector":
            deleteSelector();
            return { ...state, selector: null, error: '' }
        case "media":
            return { ...state, media: action.media, error: '' }
        case "edit":
            return {
                ...state,
                page: action.page,
                type: action.pageType,
                error: '',
                isChange: false,
            }
        case "add":
            return {
                ...state, updatedKeys: action.updatedKeys, isChange: true,
            }
        case "move":
            return {
                ...state, updatedKeys: action.updatedKeys, isChange: true,
            }
        case "delete":
            return {
                ...state, pageUpdated: action.pageUpdated, selector: null, isChange: true,
            }
        case "change":

            return {
                ...state,
                error: '',
                isChange: true,
            }
        case "error":
            return { ...state, error: action.error }
        case "finish":

            return { ...state, loading: false, isUpdate: false }
        default:
            return state;
    }
};

export default function Pages({ children }) {

    const [state, dispatch] = useReducer(reducer, initial);


    useEffect(() => {

        if (!state.isUpdate)
            return;

        const updateValue = async (STORE = UNDO_STORE_NAME) => {


            if (!state.node) {
                dispatch({ type: 'error', error: 'Element not selected.' });
                return;
            }
            const node = state.node.node;

            const currentUid = node.dataset.id;
            const pos = node.dataset.pos;

            dispatch({ type: 'start' });

            let updated = { ...state.node }

            if (!updated) {
                dispatch({ type: 'error', error: 'Element not found.' });
                return;
            }



            try {



                if (state.innerHTML)
                    updated.nodeValue = state.innerHTML;

                delete updated.node;

                const orignal = await getData(state.page._id, updated._uid)

                await updateData(state.page._id, updated);

                const pageUpdated = { pos: pos, currentId: currentUid };

                onAddAction({ action: 'update', ...pageUpdated, orignal }, STORE);


                dispatch({ type: 'updatePage', pageUpdated });

            } catch (e) {

                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

            } finally {
                dispatch({ type: 'finish' });
            }
        }

        updateValue();

    }, [state.isUpdate])

    const onChange = async (name, value, priority) => {

        dispatch({
            type: 'change',

        })

    }

    const onEdit = async (page, type) => {

        try {

            dispatch({ type: 'start' });

            if (!page || !type)
                throw new Error('Page or Type not selected!');



            dispatch({ type: 'edit', page: page, pageType: type });

            await clearStore(UNDO_STORE_NAME);
            await clearStore(REDO_STORE_NAME);

            dispatch({ type: 'updatePage', pageUpdated: 0 });
            await loadPage(page, type, dispatch);
            setTimeout(() => dispatch({ type: 'updatePage', pageUpdated: 1 }));


        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }

    };


    const onSubmit = async () => {

        try {

            if (!state.page || !state.type)
                throw new Error('Page or Type not selected!');

            dispatch({ type: 'start' });

            const page = state.page;
            const type = state.type;

            if (state.selector) {
                const selector = { ...state.selector, key: undefined, style: undefined }
                const key = state.selector.key;
                await updateStyleData({ type: key[0], elementType: key[1], ...selector }, key);
            }

            const res = await savePage(page, type);

            onEdit(res[type], type);


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };



    const onAddTemplateElements = async (currentElement, elements = []) => {

        const unique_id = uuid();
        currentElement._uid = unique_id;

        if (Array.isArray(currentElement.childNodes)) {
            const newChilds = await Promise.all(currentElement.childNodes.map(async (_uid) => {
                const child = await elements.find(elem => elem._uid == _uid);
                await onAddTemplateElements(child, elements);
                const unique_id = uuid();
                child._uid = unique_id;
                child.parent = currentElement._uid;
                return unique_id;
            }));
            currentElement.childNodes = newChilds;
        }
    }

    const onLoadTemplate = async (template, position, currentElement, type = 'template') => {


        try {

            dispatch({ type: 'start' });

            if (!template || !type)
                throw new Error('Template not selected!');


            const projectId = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + projectId, {
                method: 'GET'
            });

            const project = response.project;


            const res = await fetcher(`${project.url}/api/${type}s/${template._id}`, {
                method: 'Get',
                headers: { 'x-api-key': project.apikey },
            });


            const data = Array.isArray(res.elements) ? res.elements : [];

            if (data[1]) {

                let index = -1;
                let parentElemet = currentElement;
                if (position !== undefined) {
                    parentElemet = await getData(state.page._id, currentElement.parent);

                    index = parseInt(currentElement.index) + position;

                    if (index <= -1)
                        index = 0;
                }


                if (!parentElemet)
                    return false;


                data.shift();

                if (!await onAddElement(parentElemet._uid, { tag: data[0].tagName }))
                    return false;


                await onAddTemplateElements(data[0], data);

                data[0].parent = parentElemet._uid;

                await storeData(state.page._id, data);


                if (index <= -1)
                    parentElemet.childNodes.push(data[0]._uid);
                else
                    parentElemet.childNodes.splice(index, 1, data[0]._uid);
                await updateData(state.page._id, parentElemet);

                dispatch({ type: 'add', refreshUid: parentElemet._uid });

                if (state.node)
                    state.node.enabled = false;
            }


        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }

    };
    const onDeleteElement = async (currentElement, elements = []) => {

        if (Array.isArray(currentElement.childNodes))
            await Promise.all(
                currentElement.childNodes.map(async element => {
                    const child = await getData(state.page._id, element)
                    if (child) {
                        elements.push(child)
                        await onDeleteElement(child, elements);
                        await deleteData(state.page._id, element);
                    }
                }));


        currentElement.childNodes = [];
    }

    const onCopyElement = async (currentElement) => {
        if (Array.isArray(currentElement.childNodes)) {
            const newChilds = await Promise.all(currentElement.childNodes.map(async (_uid) => {
                const child = await getData(state.page._id, _uid);
                const unique_id = uuid();
                child._uid = unique_id;
                child.parent = currentElement._uid;
                await onCopyElement(child);
                await updateData(state.page._id, child);
                return unique_id;
            }));
            currentElement.childNodes = newChilds;
        }
    }

    const onAddElement = async (currentUid, tag, level = 0) => {


        if (currentUid) {

            const element = await getData(state.page._id, currentUid);
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


            return await onAddElement(element.parent, tag, level);

        }


        return true;
    }

    const loadComponent = async (tag) => {

        let newTag = {};

        if (tag.page._id == state.page._id) {
            throw new Error(`This ${tag.page.pageType} is Not Allowed.`);
        }



        let rootElement = await getData(tag.page._id, 0);

        if (!rootElement) {
            await loadWithoutStyle(tag.page, tag.page.pageType, dispatch, false);
            const res = await ThemeServices.getPageStyle(tag.page.pageType, tag.page._id);
            const iframe = document.querySelector("#ac-editor-iframe-doc")
            if (iframe) {
                const iframeDocument = iframe.contentDocument;;
                let style = iframeDocument.createElement('style');
                style.textContent = res.css;
                iframeDocument.head.appendChild(style);
            }
            let data = await getAllData(tag.page._id);
            console.log(data);
            rootElement = await data.elements[0];


            addComponent(tag);
        }



        newTag = { ...rootElement, ...tag };


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
            message.error("Target element not found.")
            return false;
        }


        if (!await onAddElement(parentElemet._uid, tag))
            return false;

        // if (!tag.addmenu && parentElemet.layout == 'menu') {
        //     message.error("This tag is not allowed within this element.")
        //     return;
        // }

        // if (tag.addmenu) {
        //     const childNodes = parentElemet.childNodes;
        //     await childNodes.forEach(async (_uid) => {
        //         let currentElement = await getData(state.page._id, _uid);
        //         await onDeleteElement(currentElement, []);
        //         await deleteData(state.page._id, _uid);

        //     });

        // }


        let status = false;
        try {
            dispatch({ type: 'start' });

            if (!iFramedocument) {
                const iframe = document.querySelector("#ac-editor-iframe-doc")
                iFramedocument = iframe.contentDocument;;
            }


            // if (tag.page)
            //     tag = await loadComponent(tag);

            const pageUpdated = await addElement(
                tag,
                parentElemet,
                addToAbove,
                currentUid,
                pos,
                state,
                iFramedocument);



            onAddAction({ action: 'delete', newId: pageUpdated.newId, pos: pos._uid }, STORE);

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


        let status = false;

        try {
            dispatch({ type: 'start' });



            parentElemet.childNodes.splice(index, 0, newId);
            await updateData(state.page._id, parentElemet);


            // elements.forEach(async (element) => {

            //     if (element.page)
            //         addComponent(element);

            //     await updateData(state.page._id, element);
            // })



            // await onAddSelectors(selectors);

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


    const onAddTemplate = useCallback(async (template, targetIndex, currentElement) => {

        if (template) {
            await onLoadTemplate(template, targetIndex, currentElement);
        } else {

            if (!state.element) {
                dispatch({ type: 'error', error: 'Element not selected.' });
                return;
            }


        }
    }, [state.page])

    const onCopy = useCallback(async (node, STORE = UNDO_STORE_NAME) => {

        try {

            if (!node)
                return;

            const currentUid = node.dataset.id;
            const pos = node.dataset.pos;

            let currentElement = await getData(state.page._id, currentUid);


            if (!currentElement) {
                message.error('Element not selected.');

                throw new Error('Element not selected.');
            }

            if (currentElement._uid == '0') {
                message.error("Body can not be clone.");
                throw new Error('Body can not be clone.');
            }


            dispatch({ type: 'start' });

            let id = nanoid(8);
            const unique_id = uuid();

            currentElement._uid = unique_id;
            await onCopyElement(currentElement);
            currentElement.className = "ac" + "-elem-" + id;
            currentElement.selector = ".ac" + "-elem-" + id;

            const iframe = document.querySelector("#ac-editor-iframe-doc")
            let iFramwDocument = iframe.contentDocument;

            await addCSS(iFramwDocument, currentElement);

            const parentElemet = await getData(state.page._id, currentElement.parent);

            const index = parentElemet.childNodes.indexOf(currentUid);
            parentElemet.childNodes.splice(index + 1, 0, unique_id);



            await updateData(state.page._id, parentElemet);
            await updateData(state.page._id, currentElement);

            const pageUpdated = {
                pos: pos.slice(0, -1),
                parentId: parentElemet._uid,
                newId: unique_id
            }
            onAddAction({ action: 'delete', ...pageUpdated, }, STORE);


            dispatch({
                type: 'updatePage',
                pageUpdated
            });


        } catch (e) {


            dispatch({ type: 'error', error: 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }

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


            // const elements = [];
            //  elements.push(currentElement);
            // await onDeleteElement(currentElement, elements);
            //  if (currentElement.page)
            //   deleteComponent(currentElement);

            //  await deleteData(state.page._id, currentUid);

            // const selectors = [];

            // await onDeleteSelectors(elements, selectors);

            parent.childNodes.splice(index, 1);
            await updateData(state.page._id, parent);

            const pageUpdated = {
                pos: pos,
                parentId: parent._uid,
            }


            onAddAction({
                action: 'add',
                index,
                pos,
                currentUid,
                parentUid
            }, STORE, isRedo);

            dispatch({
                type: 'delete', pageUpdated
            });


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
            message.error("Target Element not found.");
            throw new Error('Target Element not found.');

        }

        if (addToAbove)
            parentElemet = await getData(state.page._id, parentElemet.parent);


        if (!parentElemet || !currentElement) {
            message.error("Target Element Or Element not found.");
            throw new Error('Target Element Or Element not found.');
        }


        if (!await onAddElement(parentElemet._uid, parentElemet.tagName)) {
            message.error("Element not valid.");
            throw new Error('Element not valid.');

        }


        try {
            dispatch({ type: 'start' });

            let parentUid = currentElement.parent;

            const currentParent = await getData(state.page._id, parentUid);
            const currentIndex = currentParent.childNodes.indexOf(currentUid);


            if (currentIndex <= -1) {
                message.error("Element not found.");

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


    const onClickElement = useCallback(async (iframeDocument, _uid, newId = false) => {


        if (!iframeDocument) {
            const iframe = document.querySelector("#ac-editor-iframe-doc")
            iframeDocument = iframe.contentDocument;;
        }

        if (newId && !state.pageUpdated?.newId) {
            dispatch({ type: 'selectNode', node: null });
            return;
        }


        if (newId) _uid = state.pageUpdated?.newId;
        const node = iframeDocument.querySelector(`[data-id="${_uid}"]`);
        const element = await getData(state.page._id, _uid);

        if (!node)
            return;

        if (node && element) {

            if (state.node?.node)
                state.node.node.style.cursor = null;


            dispatch({ type: 'selectNode', node: { node, ...element } });

        } else {
            dispatch({ type: 'selectNode', node: null });

        }

    }, [state.page, state.pageUpdated]);


    const onUpdate = useCallback(async (innerHTML) => {
        dispatch({ type: 'updateElement', innerHTML })

    }, [state.page]);

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




    const onSelectSelector = async (newSelector, elementstate = '', STORE = UNDO_STORE_NAME) => {



        try {

            if (!newSelector || !state.node) {
                throw new Error('Element || Selector not found.');
            }

            dispatch({ type: 'start' });


            let { selectorText, properties, index, type } = newSelector;

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
                    if (tempRule.selectorText === selectorText) {
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

            const tagName = state.node.layout === 'root' ? 'root' : state.node.tagName;

            if (!rule) {
                const newIndex = cssRules.length;
                sheet.insertRule(`${selectorText + elementstate} {}`, newIndex);
                rule = cssRules[newIndex];


                // onAddAction({
                //     action: 'deleteSelector',
                //     newSelector: {
                //         properties,
                //         selectorText
                //     },
                //     key: [state.media || 'normal', tagName]
                // }, STORE);


            }

            const elements = iframeDocument.body.querySelectorAll("[data-id]");
            const ruleSelector = rule.selectorText;

            elements.forEach(element => {
                element.style.outline = null;

                if (element.matches(ruleSelector)) {
                    element.style.outline = '1px solid red';
                }
            });

            const selector = {
                style: rule.style,
                properties,
                selectorText: rule.selectorText,
                key: [state.media || 'normal', tagName]
            };




            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }



    };

    const onRevertSelector = async (newSelector, key, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });

        try {
            let { selectorText, properties, index, type } = newSelector;

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
                rule = mediaRules[index];

                for (let i = 0; i < mediaRules.length; i++) {
                    let tempRule = mediaRules[i];
                    if (tempRule.selectorText === selectorText) {
                        rule = tempRule;
                        break;
                    }
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.selectorText === selectorText) {
                        rule = tempRule;
                        break;
                    }
                }
            }

            if (!rule) {
                const newIndex = cssRules.length;
                sheet.insertRule(`${selectorText} {}`, newIndex);
                rule = cssRules[newIndex];
            }

            const selector = {
                style: rule.style,

                properties,
                selectorText: rule.selectorText,
                key
            };


            onAddAction({
                action: 'deleteSelector',
                newSelector: {

                    properties,
                    selectorText
                },
                key
            }, STORE, isRedo);

            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }



    };

    const onDeleteSelectors = async (elements, selectors = []) => {


        const iframe = document.querySelector("#ac-editor-iframe-doc");
        let iframeDocument = iframe.contentDocument;

        const styleSheets = iframeDocument.styleSheets;
        let sheet = null;

        for (let i = 0; i < styleSheets.length; i++) {
            sheet = styleSheets[i];
            if (sheet.ownerNode.id === 'ac-stylesheet-global')
                break;
        }

        if (!sheet) throw new Error("Stylesheet not found.")

        let cssRules = sheet.cssRules || sheet.rules;

        let elementType = '';
        let res = null;

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const tagName = element.layout === 'root' ? 'root' : element.tagName;

            if (elementType !== tagName) {
                res = await searchSelector(['normal', tagName]);
            }
            const data = res?.selectors ? res.selectors : {};
            const selector = data[element.selector];

            if (selector) {
                const selectorText = selector.selectorText;
                let ruleDeleted = false;

                for (var j = 0; j < sheet.cssRules.length; j++) {
                    var rule = sheet.cssRules[j];
                    if (rule.selectorText === selectorText) {
                        sheet.deleteRule(j);
                        ruleDeleted = true;
                        break;
                    }
                }

                if (ruleDeleted) {
                    const key = ['normal', tagName];
                    selectors.push({ ...selector, key });
                    await updateStyleData(
                        {
                            type: key[0],
                            elementType: key[1],
                            selectorText
                        },
                        key,
                        true
                    );
                }
            }

            elementType = tagName;
        }

    };


    const onAddSelectors = async (selectors = []) => {



        if (!selectors)
            throw new Error('Selectors not found!');

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


        for await (const selector of selectors) {

            let cssText = '';
            const properties = selector.properties || {}
            for (const property in properties) {
                if (selector.properties.hasOwnProperty(property)) {
                    const value = properties[property].value;
                    cssText += `${property}: ${value}; `;
                }
            }


            const index = sheet.insertRule(`${selector.selectorText} {${cssText}}`, cssRules.length);

            let sel = { ...selector, index, key: undefined, style: undefined };
            const key = selector.key;
            await updateStyleData({ type: key[0], elementType: key[1], ...sel }, key);

        }


    }

    const onDeleteSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
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


            const { index, mediaIndex,
                properties,
                selectorText,
                key } = selector;


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

            await updateStyleData(
                {
                    type: key[0],
                    elementType: key[1],
                    selectorText
                },
                key,
                true
            );

            onAddAction({
                action: 'addSelector',
                newSelector: {

                    properties,
                    selectorText
                },
                key
            }, STORE, isRedo);

            dispatch({
                type: 'deleteSelector',
                selector: state.selector
            })


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        }
        finally {
        }
    };


    const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });

        try {

            if (!selector) {
                throw new Error('Selector not found!');
            }

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

            const sel = { ...selector, key: undefined, style: undefined }
            const key = selector.key;

            const res = await searchSelector(key);
            const data = res?.selectors ? res.selectors : {};
            let savedSelector = data[selector.selectorText];


            let rule = null;
            for (let i = 0; i < cssRules.length; i++) {
                let tempRule = cssRules[i];
                if (tempRule.selectorText === selector.selectorText) {
                    rule = tempRule;
                    break;
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


            if (savedSelector)
                onAddAction({
                    action: 'updateStyle',
                    savedSelector: {
                        ...savedSelector,
                    },
                    key: key
                }, STORE, isRedo);

            await updateStyleData({ type: key[0], elementType: key[1], ...sel }, key);


        } catch (e) {
            console.log(e?.message)
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        }
        finally {
            dispatch({ type: 'finish' });

        }


    };

    const onChangeMedia = (minMax, orientation, windowWidth) => {

        if (!windowWidth || windowWidth == '100%')
            dispatch({ type: 'media', media: '' })
        else {
            dispatch({ type: 'media', media: `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}` })

        }

    }
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
            case 'addSelector':
                await onRevertSelector(
                    action.newSelector,
                    action.key,
                    STORE2, true);
                break;
            case 'deleteSelector':
                await onDeleteSelector(
                    { ...action.newSelector, key: action.key },
                    STORE2, true);
                break;
            case 'updateStyle':
                await onUpdateSelector(
                    { ...action.savedSelector, key: action.key },
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




    return <>
        <pageContext.Provider value={{
            state,
            onEdit,
            onAddTemplate,
            onAdd,
            onCopy,
            onDelete,
            onMove,
            onSubmit,
            onChange,
            onUpdate,
            onClickElement,
            onSelectSelector,
            onDeleteSelector,
            onUpdateSelector,
            onChangeMedia,
            undo,
            redo,
        }}>
            <DndProvider backend={HTML5Backend}>

                {children}
            </DndProvider>
        </pageContext.Provider>
    </>

};




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
        onChangeMedia,
        onMove,
        onSubmit,
        onChange,
        onUpdate,
        undo,
        redo } = React.useContext(pageContext);
    return {
        state, onEdit, onAdd,
        onClickElement, onMove, onDelete,
        onSelectSelector,
        onDeleteSelector,
        onUpdateSelector,
        onChangeMedia,
        onAddTemplate, onCopy, onSubmit, onChange, onUpdate, undo, redo
    }
}
