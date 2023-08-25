import { Button, Modal, Card, Spin, Alert, ColorPicker } from "antd";
import { useState, useReducer, useEffect } from "react";
import { ExclamationCircleFilled } from '@ant-design/icons';

import { IFrame } from "../../Iframe";
import Fuse from "fuse.js";


import Editor from "./Editor";
import PreviewEditorNav from './Editor/PreviewEditorNav';
import CanvasEditor from '../Canvas';

import ThemeServices from "../../../lib/services/theme";

import Elements from "./Elements";


import {
    loadGlobalStyles, saveStyle,
    deleteData, clearStore, getData, updateData,
    deleteAllActions, updateStyleData,
    storeAction, getAction, searchSelector, getAllData,
    deleteAction, UNDO_STORE_NAME, REDO_STORE_NAME, STYLE_STORE_NAME, PAGE_STORE_NAME
} from '../../../lib/db';

const { confirm } = Modal;

const reducer = (state, action) => {




    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, page: action.page }
        case "edit":
            return {
                ...state,
                elementType: action.elementType,
                selector: null,

                error: '',
            }
        case "addSelector":
            return {
                ...state,
                selector: action.selector,
                selectorDeleted: null,
                error: ''
            }
        case "deleteSelector":
            return { ...state, selector: null, error: '', selectorDeleted: action.selectorDeleted }
        case "media":
            return { ...state, media: action.media, error: '' }
        case "clearError":
            return { ...state, error: '' }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function Style({ children, onBack }) {

    const [backgroundColor, setBackgroundColor] = useState('#fff');
    const [windowWidth, setWindowWidth] = useState("100%");


    const [minMax, setMinMax] = useState('');
    const [orientation, setOrientation] = useState("");

    const [classNames, setClassNames] = useState([]);

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        elementType: 'default',
        selector: null,
        page: {},
        error: ''
    });

    const [isChange, setIsChange] = useState(false);
    const [isStyleChange, setIsStyleChange] = useState(false);

    useEffect(() => {
        async function promptBeforeClose(event) {


            if (isChange) {
                event.preventDefault();

                const shouldSave = await window.autocode.checkUnsavedChanges(isChange);

                if (shouldSave) {
                    await onSubmit();
                }

                setTimeout(() => {
                    window.close();
                }, 100);
            }

            setIsChange(false);

        }

        window.addEventListener('beforeunload', promptBeforeClose);

        return () => {
            window.removeEventListener('beforeunload', promptBeforeClose);
        };
    }, [isChange]);


    const saveIsChange = (callback) => {

        if (isStyleChange) {
            confirm({
                title: 'Please remember to update first?',
                icon: <ExclamationCircleFilled />,
                okText: 'Update',
                okType: 'danger',
                cancelText: 'No',
                async onOk() {
                    if (state.selector)
                        await onUpdateSelector(state.selector);

                    callback();
                },
                onCancel() {
                    callback();
                    setIsStyleChange(false)

                },
            });
        } else
            callback();
    }

    const onLoad = async (_id) => {
        dispatch({ type: 'load', page: { _id } });

    }

    const onEdit = async (elementType) => {



        if (!elementType || !state.page?._id)
            return;

        saveIsChange(() => {
            dispatch({ type: 'edit', elementType });
            const fetchData = async () => {
                const res = await getAllData(state.page?._id, STYLE_STORE_NAME);
                const data = res?.elements ? res.elements : {};
                const classNames = new Set();
                Object.values(data).filter(element => element.type === elementType).forEach((element) => {
                    const className = element.selectorText.substr(1);

                    if (className) {
                        classNames.add(className.trim());
                    }
                });
                setClassNames([...classNames]);
            }
            fetchData();
        });


    }


    useEffect(() => {


        const fetchData = async () => {
            try {
                dispatch({ type: 'start' });

                await clearStore(UNDO_STORE_NAME);
                await clearStore(REDO_STORE_NAME);
                await loadGlobalStyles(dispatch, true)
            } finally {
                dispatch({ type: 'finish' });
            }
        }

        fetchData();

    }, [])

    useEffect(() => {

        if (!windowWidth || windowWidth == '100%')
            saveIsChange(() => {
                dispatch({ type: 'media', media: '' })
            });
        else {
            const media = `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}`;
            dispatch({ type: 'media', media })

        }

    }, [minMax, orientation, windowWidth])


    useEffect(() => {
        dispatch({ type: 'addSelector', selector: null });
    }, [state.media])



    const onSelectEditorSelector = async (elementType, selectorText) => {
        const res = await getAllData(state.page._id, STYLE_STORE_NAME);
        const data = res?.elements ? res.elements : {};

        const filteredElements = Object.values(data)
            .filter((element) => element.type === elementType);

        const selector = filteredElements.find((element) => element.selectorText === selectorText);
        if (selector) {

            const key = state.media || 'normal';


            if (!selector.style[key])
                selector.style[key] = {}

            if (!selector.style[key][selector.selectorType || 'root'])
                selector.style[key][selector.selectorType || 'root'] = {}

            const properties = selector.style[key][selector.selectorType || 'root'].properties;

            selector.properties = properties;
            selector.store = STYLE_STORE_NAME;
            onSelectSelector(selector);
        }
    }

    const onSubmit = async () => {

        dispatch({ type: 'start' });


        try {

            if (isStyleChange)
                await onUpdateSelector(state.selector);

            const page = state.page;
            await saveStyle(page, 'style');
            setIsChange(false)

            dispatch({
                type: 'clearError'
            })


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onSelectSelector = async (newSelector, elementstate = '', STORE = UNDO_STORE_NAME, isRedo = false) => {

        saveIsChange(() => {

            try {



                if (!newSelector) {
                    throw new Error('Selector not found.');
                }




                dispatch({ type: 'start' });

                let { selectorText, properties = {}, store = STYLE_STORE_NAME, _uid } = newSelector;

                const key = state.media || 'normal';



                if (!validatClass(selectorText))
                    throw new Error('Please Enter Valid Classname.');

                const className = selectorText.substr(1);

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
                    selectorText: selectorText,
                    selectorType: elementstate,
                    className,
                    key,
                    _uid,
                    store
                };


                setClassNames((prevClassNames) => new Set([...prevClassNames, className]));

                dispatch({ type: 'addSelector', selector });

            } catch (e) {
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {
                dispatch({ type: 'finish' });
            }

        });

    };


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
                className,
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



            if (!selectorType) {
                await deleteData(state.page._id, _uid, STYLE_STORE_NAME);
                classNames.delete(className);

            }
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



            setIsChange(true)
            dispatch({ type: 'deleteSelector', selectorDeleted: _uid });

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
                    if (tempRule.selectorText ===  selector.selectorText + selector.selectorType) {
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


            await updateData(state.page._id, currentElement, STYLE_STORE_NAME);


            setIsStyleChange(false);
            setIsChange(true)

            dispatch({ type: 'updateStyle' });


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



    const validatClass = (inputValue) => {
        const regex = /^\.[a-zA-Z][\w-]*$/;
        const isValid = regex.test(inputValue);
        return isValid;
    };



    const onChange = async (val) => {
        // let otherProperties = {}
        // if (others)
        //     Object.keys(others).forEach((key) => {
        //         otherProperties[key] = others[key];
        //     })

        // state.selector.properties[key] = { value, ...otherProperties }
        setIsChange(true)
        setIsStyleChange(true);

    }

    const LeftTools = () => <span>Style: &nbsp;&nbsp;

        <ColorPicker value={backgroundColor}
            allowClear={true}
            format={"hex"}
            onChangeComplete={(color, hex) => {
                const metaColor = color.metaColor;
                const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;
                setBackgroundColor(rgbColor)
            }} />


    </span>

    const RightTools = () => <span></span>

    const handleBackClick = async (e) => {
        e.preventDefault();
        if (isChange) {
            const shouldSave = await window.autocode.checkUnsavedChanges(isChange);

            if (shouldSave) {
                await onSubmit();
            }
        }

        // Navigate back
        onBack();
    };


    return <>
        <div style={{ textAlign: 'center', padding: 10 }}>
            <img src="./images/logo/nav-logo.png" width="50" alt="autocode-logo" />
        </div>
        <Card loading={state.loading && !document}
            headStyle={{ padding: 10 }}
            bodyStyle={{ padding: 0 }}
            extra={<>  <Button type="dashed" style={{ marginRight: 10 }}
                loading={state.loading}
                onClick={handleBackClick}>Back</Button> <Button type="primary" onClick={onSubmit} disabled={!isChange} loading={state.loading}> Save </Button></>}
            title={<><PreviewEditorNav
                undoStyle={undo}
                redoStyle={redo}
                windowWidth={windowWidth}
                setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation}
                LeftTools={LeftTools}
                RightTools={RightTools}
            /></>}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            <Editor
                onDelete={onDeleteSelector}
                state={state}
                onSubmit={onUpdateSelector}
                onEdit={onEdit}
                onSelect={onSelectSelector}
                onChange={onChange}
                isChange={isStyleChange}
                onLoad={onLoad}
            >

                <CanvasEditor windowWidth={windowWidth} setWindowWidth={setWindowWidth}>
                    <Spin tip="Loading" size="small" spinning={state.loading}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                    </Spin>
                    <IFrame onLoad={onLoad}>
                        <div style={{ backgroundColor, width: '100%', height: '100%' }}>

                            <Elements
                                onSelect={onSelectEditorSelector}
                                className={state.selector?.className}
                                classNames={classNames}
                                elementType={state.elementType}
                            />
                        </div>
                    </IFrame>

                </CanvasEditor>

            </Editor>

        </Card>
    </>
}

