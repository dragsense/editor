// import { message } from "antd";
// import React, { useState, useEffect } from "react";
// import PageServices from "@/lib/services/pages";
// import ComponentServices from "@/lib/services/components";
// import CollectionServices from "@/lib/services/collections";
// import ThemeServices from "@/lib/services/theme";
// import { createCSS } from "@/lib/utils/cssNode";

// import DocumentServices from "@/lib/services/documnets";
// import { v4 as uuid } from 'uuid';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import useNodes from "@/lib/hooks/useNodes";
// import useUndos from "@/lib/hooks/useUndos";
// import { addRule, getCssSelector, laodSelecters } from '@/lib/utils/cssNode'
// import { fetcher } from "@/lib/fetch";
// import FormServices from "@/lib/services/forms";
// export const pageContext = React.createContext({ page: {}, toolBar: {}, setToolBar: () => { } });
// const componentsContext = React.createContext();
// const nodesContext = React.createContext();
// const cssNodesContext = React.createContext();


// export function PageProvider({ children }) {

//     const [_isLoading, setIsLoading] = useState(false);
//     const [setting, setSetting] = useState([]);

//     const [page, setPage] = useState(null);
//     const [component, setCompoent] = useState(null);
//     const [node, setNode] = useState(null);
//     const [refresh, setRefresh] = useState(false);
//     const [toolBar, setToolBar] = useState({ full: () => { } });
//     const [body, setBody] = useState([]);
//     const [components, setCompenents] = useState([]);
//     const [window, setIframeWindow] = useState(null);
//     const [editorSelector, setEditorSelector] = useState('');
//     const [selector, setSelector] = useState(null);
//     const { CssNodes, document, isLoading, laodCssNodes, setIframeDocumnet } = useNodes();

//     const {
//         setState: setUState,
//         goBack: undoStyle,
//         goForward: redoStyle
//     } = useUndos();



//     useEffect(async () => {
//         try {

//             setIsLoading(true);
//             const id = localStorage.getItem("project");
//             const response = await fetcher('/api/projects/' + id, {
//                 method: 'GET'
//             });

//             const _setting = await fetcher(`http://${response.project.domain}:${response.project.port}/api/setting`, {
//                 method: 'GET',
//                 headers: { 'x-api-key': response.project.apikey },
//             });

//             setSetting(_setting.images)
//         } catch (e) {
//             message.error(e?.message || 'Something went wrong');
//         } finally {
//             setIsLoading(false);
//         }

//     }, [])


//     useEffect(async () => {


//         if (!page)
//             return;

//         const id = localStorage.getItem("project");
//         const response = await fetcher('/api/projects/' + id, {
//             method: 'GET'
//         });

//         const url = `http://${response.project.domain}:${response.project.port}`;
//         const apikey = response.project.apikey;

//         const _id = page._id;
//         const type = page.type;
//         let _page = null;
//         try {
//             setCompenents([]);
//             setBody([]);
//             setIsLoading(true);
//             if (type === 'component') {
//                 _page = await ComponentServices.get(_id, url, apikey);

//                 setCompoent(_page)
//                 setBody([_page]);
//             } else
//                 if (type === 'form') {
//                     _page = await FormServices.get(_id, url, apikey);

//                     setCompoent(_page)
//                     setBody([_page]);
//                 } else
//                     if (type === 'collection') {
//                         _page = await CollectionServices.get(_id, url, apikey);

//                         setCompoent(_page)
//                         setBody([_page]);

//                     }
//                     if (type === 'template') {

//                         _page = await ThemeServices.getTemplate(_id, url, apikey);
//                         setBody(_page.body);
//                     }
//                     else {
//                         _page = await PageServices.get(_id, url, apikey);


//                         _page.body[0].states = { ..._page.states, ...setting };

//                         setBody(_page.body);
//                     }


//         } catch (e) {

//             message.error(e?.message, 10);
//         } finally {
//             setIsLoading(false);
//         }

//     }, [page, refresh]);



//     const save = async () => {s

//         if (!page)
//             return;

//         const type = page.type;
//         try {

//             const id = localStorage.getItem("project");
//             const response = await fetcher('/api/projects/' + id, {
//                 method: 'GET'
//             });

//             const url = `http://${response.project.domain}:${response.project.port}`;
//             const apikey = response.project.apikey;

//             if (type === 'collection')
//                 await CollectionServices.save(page._id, { body: body[0] }, url, apikey);
//             else
//                 if (type === 'form')
//                     await FormServices.save(page._id, { body: body[0] }, url, apikey);
//                 else
//                     if (type === 'component') {

//                         await ComponentServices.save(page._id, { body: body[0] }, url, apikey);
//                     }
//                     else  if (type === 'template') {

//                         await ThemeServices.saveBlock({ block: body[0], _id: page._id }, url, apikey);
//                     }else
//                         await PageServices.save(page._id, { body }, url, apikey);

//             const sheet = document.styleSheets[0];
//             const cssRules = sheet.cssRules || sheet.rules;

//             //const CssNodes = await laodCssNodes();
//             const css = await createCSS(cssRules);
//             //console.log(CssNodes, "CssNodes")
//             await ThemeServices.saveStyle({ name: 'global', content: css }, url, apikey);


//             setBody([]);
//             setRefresh(!refresh);
//         } catch (e) {
//             message.error(e?.message, 10);
//         } finally {
//         }

//     }

//     return <pageContext.Provider value={{ page, setPage, body, setBody, save, _isLoading, toolBar, setToolBar }}>
//         <DndProvider backend={HTML5Backend}>
//             <componentsContext.Provider value={{ components, setCompenents, component, setCompoent }}>
//                 <nodesContext.Provider value={{ node, setNode, setUState, undoStyle, redoStyle, document }}>
//                     <cssNodesContext.Provider value={{
//                         CssNodes,
//                         document, isLoading,
//                         editorSelector, setEditorSelector,
//                         laodCssNodes, setIframeDocumnet,
//                         setIframeWindow,
//                         selector, setSelector,
//                         window
//                     }}>
//                         {children}
//                     </cssNodesContext.Provider>
//                 </nodesContext.Provider>
//             </componentsContext.Provider>
//         </DndProvider>
//     </pageContext.Provider >
// }

// export default function usePageStates() {
//     const { page, setPage, body, setBody, save, _isLoading, toolBar, setToolBar } = React.useContext(pageContext);
//     const setCurrentPage = (page) => setPage(page);
//     const getCurrentPage = () => page;
//     const modify = () => setBody([...body])
//     const getBody = () => body;
//     const onSave = () => save();
//     const setToolBarValue = (other) => {
//         console.log(toolBar);
//         setToolBar({ ...toolBar, ...other })
//     }
//         ;
//     return {
//         setCurrentPage,
//         getCurrentPage,
//         modify,
//         getBody,
//         onSave,
//         _isLoading,
//         page,
//         setToolBarValue,
//         toolBar, setToolBar
//     }
// }


// export function useComponentsStates() {
//     const { components, setCompenents, component, setCompoent } = React.useContext(componentsContext);
//     const add = (component) => setCompenents([...components, component]);

//     const modify = () => {

//         const index = components.findIndex(comp => comp === component);
//         components[index] = component;
//         setCompenents([...components])
//     }
//     const get = async (id) => {
//         const component = components.find(comp => comp._id === id);

//         if (component)
//             return component;

//         const pId = localStorage.getItem("project");
//         const response = await fetcher('/api/projects/' + pId, {
//             method: 'GET'
//         });

//         const url = `http://${response.project.domain}:${response.project.port}`;
//         const apikey = response.project.apikey;

//         let comp = null;
//         try {
//             let comp = await ComponentServices.get(id, url, apikey);
//             if (comp) {
//                 setCompenents([...components, comp]);
//                 return comp;
//             }
//         } catch (e) {
//         }

//         try {
//             comp = await FormServices.get(id, url, apikey);


//             if (comp) {
//                 setCompenents([...components, comp]);
//                 return comp;
//             }
//         } catch (e) {
//         }


//         return null;

//     }
//     const getAll = () => components;
//     const setCurrentComponent = (component) => setCompoent(component);
//     const getCurrentComponent = () => component;
//     return {
//         add,
//         get,
//         getAll,
//         setCurrentComponent,
//         getCurrentComponent,
//         modify,
//         component
//     }
// }

// export function useNodeStates() {
//     const { node, setNode, setUState, undoStyle, redoStyle, document, window } = React.useContext(nodesContext);

//     const setCurrentNode = (node) => setNode(node);
//     const getCurrentNode = () => node;
//     const onCopy = () => { }
//     const onMove = () => { }
//     const onDelete = () => { }
//     return {
//         setUState, undoStyle, redoStyle,
//         setCurrentNode,
//         getCurrentNode,
//         node,
//         document,
//         window,
//         onCopy,
//         onDelete,
//         onMove,
//     }
// }


// export function useCssNodeStates() {
//     const { CssNodes, document,
//         editorSelector, setEditorSelector,
//         selector, setSelector,
//         isLoading,
//         laodCssNodes, setIframeDocumnet, setIframeWindow } = React.useContext(cssNodesContext);

//     const addCssRule = async (value, content = {}, type = 1, breakPoint, keyframe) => {

//         const selector = await addRule(document, CssNodes, value, type, content, breakPoint, keyframe);
//         if (selector)


//             return selector;
//     }

//     const getSelector = (element) => {

//         const sel = getCssSelector(document, element, 1);
//         return sel;
//     }

//     const getElementStyle = (element) => {

//         const el = document.querySelector(element);
//         if (el)
//             return window.getComputedStyle(el, null);
//     }

//     const setElementStyle = (element) => {


//         var all = document.querySelectorAll('.ac-000-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT');


//         all.forEach(item => {
//             item.style.outlineColor = "#bdbdbd";
//             item.style.outlineWidth = "1px";
//             item.style.outlineStyle = "dashed";

//         });

//         var body = document.querySelector('body >  :first-child');

//         body.style.outlineColor = "#bdbdbd";
//         body.style.outlineWidth = "1px";
//         body.style.outlineStyle = "dashed";


//         if (element) {
//             var selected = document.querySelectorAll(`${element} > :first-child`);
//             selected.forEach(item => {
//                 item.style.outlineColor = "rgb(243 68 58)";
//                 item.style.outlineWidth = "2px";
//                 item.style.outlineStyle = "dashed";
//             })
//         }
//     }

//     const getCssSelectors = async () => { return await laodSelecters(document) }
//     const getTags = () => { return CssNodes.filter(node => node.class === false && node.id === false) }
//     const getAnimations = () => { return CssNodes.filter(node => node.type === 7) }
//     const getClasses = () => { return CssNodes.filter(node => node.class === true) }
//     const getIds = () => { return laodSelecters("#", document) }

//     return {
//         CssNodes,
//         setIframeDocumnet,
//         setIframeWindow,
//         document,
//         laodCssNodes,
//         isLoading,
//         editorSelector, setEditorSelector,
//         selector, setSelector,
//         getCssSelectors,
//         getSelector,
//         addCssRule,
//         getAnimations,
//         getTags,
//         getClasses,
//         getIds,
//         setElementStyle
//     }
// }


//import Pages from "./Pages";

import PageManger, { usePageStates } from "./PageManager";

export default function PageProvider({ children }) {

    return <PageManger>{children}</PageManger>
}

export { usePageStates };