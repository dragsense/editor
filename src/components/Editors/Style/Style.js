import { Button, Modal, Card, Spin, Alert, ColorPicker } from "antd";
import { useState, useReducer, useEffect } from "react";
import { ExclamationCircleFilled } from '@ant-design/icons';

// Importing necessary components and hooks
import { IFrame } from "../../Iframe";
import Editor from "./Editor";
import PreviewEditorNav from './Editor/PreviewEditorNav';
import CanvasEditor from '../Canvas';
import Elements from "./Elements";

// Importing necessary functions from the database library
import {
    loadGlobalStyles, saveStyle,
    deleteData, clearStore, getData, updateData,
    deleteAllActions, updateStyleData,
    storeAction, getAction, searchSelector, getAllData,
    deleteAction, UNDO_STORE_NAME, REDO_STORE_NAME, STYLE_STORE_NAME, PAGE_STORE_NAME
} from '../../../lib/db';

// Using Modal from antd for confirmation dialogs
const { confirm } = Modal;

// Reducer function for managing state transitions
const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            // Start loading
            return { ...state, loading: true }
        case "load":
            // Load page
            return { ...state, page: action.page }
        case "edit":
            // Edit element type and reset selector and error
            return {
                ...state,
                elementType: action.elementType,
                selector: null,
                error: '',
            }
        case "addSelector":
            // Add selector and reset error and deleted selector
            return {
                ...state,
                selector: action.selector,
                selectorDeleted: null,
                error: ''
            }
        case "deleteSelector":
            // Delete selector and reset error
            return { ...state, selector: null, error: '', selectorDeleted: action.selectorDeleted }
        case "media":
            // Update media and reset error
            return { ...state, media: action.media, error: '' }
        case "clearError":
            // Clear error
            return { ...state, error: '' }
        case "error":
            // Update error
            return { ...state, error: action.error }
        case "finish":
            // Finish loading
            return { ...state, loading: false }
        default:
            // Return current state for unknown action types
            return state;
    }
};

export default function Style({ children, onBack }) {

    // State variables for various UI elements and data
    const [backgroundColor, setBackgroundColor] = useState('#fff');
    const [windowWidth, setWindowWidth] = useState("100%");
    const [minMax, setMinMax] = useState('');
    const [orientation, setOrientation] = useState("");
    const [classNames, setClassNames] = useState([]);

    // Reducer for managing state transitions
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        elementType: 'default',
        selector: null,
        page: {},
        error: ''
    });

    // State variables for tracking changes
    const [isChange, setIsChange] = useState(false);
    const [isStyleChange, setIsStyleChange] = useState(false);

    // Effect hook for handling unsaved changes
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

    // Function to handle style changes
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

    // Function to load page data
    const onLoad = async (_id) => {
        dispatch({ type: 'load', page: { _id } });
    }

    // Function to handle editing of elements
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

    // Effect hook to load global styles
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

    // Effect hook to Construct media string
    useEffect(() => {
        // Check if windowWidth is not set or equals to '100%'
        if (!windowWidth || windowWidth === '100%') {
            saveIsChange(() => {
                // Dispatch 'media' action with empty media
                dispatch({ type: 'media', media: '' })
            });
        } else {
            // Construct media string based on minMax, windowWidth and orientation
            const media = `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}`;
            // Dispatch 'media' action with constructed media string
            dispatch({ type: 'media', media })
        }
    }, [minMax, orientation, windowWidth]) // Re-run effect when minMax, orientation or windowWidth changes

    // Effect hook to set selector null if media change
    useEffect(() => {
        dispatch({ type: 'addSelector', selector: null });
    }, [state.media])


    // Function to handle selection of editor
    const onSelectEditorSelector = async (elementType, selectorText) => {
        // Fetch all data from the STYLE_STORE
        const response = await getAllData(state.page._id, STYLE_STORE_NAME);
        const elementsData = response?.elements ? response.elements : {};

        // Filter elements based on the provided element type
        const filteredElements = Object.values(elementsData)
            .filter((element) => element.type === elementType);

        // Find the selector with the provided selector text
        const foundSelector = filteredElements.find((element) => element.selectorText === selectorText);
        if (foundSelector) {

            // Determine the key based on the state media or default to 'normal'
            const mediaKey = state.media || 'normal';

            // Initialize style object for the mediaKey if it doesn't exist
            if (!foundSelector.style[mediaKey])
                foundSelector.style[mediaKey] = {}

            // Initialize style object for the selectorType or 'root' if it doesn't exist
            const selectorTypeKey = foundSelector.selectorType || 'root';
            if (!foundSelector.style[mediaKey][selectorTypeKey])
                foundSelector.style[mediaKey][selectorTypeKey] = {}

            // Extract properties from the style object
            const properties = foundSelector.style[mediaKey][selectorTypeKey].properties;

            // Update the found selector with the extracted properties and store name
            foundSelector.properties = properties;
            foundSelector.store = STYLE_STORE_NAME;

            // Call onSelectSelector with the updated selector
            onSelectSelector(foundSelector);
        }
    }

    // Function to handle form submission
    const onSubmit = async () => {
        // Start loading
        dispatch({ type: 'start' });

        try {
            // If there are style changes, update the selector
            if (isStyleChange) {
                await updateSelectorStyles(state.selector);
            }

            // Save the page style
            await savePageStyle(state.page, 'style');

            // Reset the change state
            setIsChange(false);

            // Clear any existing errors
            dispatch({ type: 'clearError' });

        } catch (error) {
            // Dispatch error
            dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });

        } finally {
            // Finish loading
            dispatch({ type: 'finish' });
        }
    };

    // Helper function to update selector styles
    const updateSelectorStyles = async (selector) => {
        if (!selector) {
            throw new Error('Selector not found.');
        }
        await onUpdateSelector(selector);
    };

    // Helper function to save page style
    const savePageStyle = async (page, styleType) => {
        if (!page || !styleType) {
            throw new Error('Page or style type not found.');
        }
        await saveStyle(page, styleType);
    };

    // Function to handle selection of a new selector
    const onSelectSelector = async (newSelector, elementState = '', STORE = UNDO_STORE_NAME, isRedo = false) => {

        // Save any changes before proceeding
        saveIsChange(() => {

            try {
                // Validate the new selector and start the dispatch
                validateAndStart(newSelector);
                // Destructure the newSelector object to get the selectorText, properties, store and _uid
                let { selectorText, properties = {}, store = STYLE_STORE_NAME, _uid } = newSelector;
                // Get the media key from the state or default to 'normal'
                const key = state.media || 'normal';
                // Validate the class of the selector text
                validateClassName(selectorText);
                // Extract the class name from the selector text
                const className = selectorText.substr(1);
                // Get the iframe and its document
                const { iframe, iframeDocument } = getIframeAndDocument();
                // Get the stylesheets from the iframe document
                const styleSheets = iframeDocument.styleSheets;
                // Get the stylesheet from the stylesheets
                let sheet = getStyleSheet(styleSheets);
                // Get the CSS rules from the stylesheet
                let cssRules = sheet.cssRules || sheet.rules;
                let rule = null;
                // If media is set in the state, get the CSS media rule and the rule from the media rules
                if (state.media) {
                    let cssMediaRule = getCssMediaRule(cssRules);
                    let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;
                    rule = getRule(mediaRules, selectorText, elementState);
                    sheet = cssMediaRule;
                    cssRules = mediaRules;
                } else {
                    // If media is not set in the state, get the rule from the CSS rules
                    rule = getRule(cssRules, selectorText, elementState);
                }
                // If the rule does not exist, create a new rule
                if (!rule) {
                    rule = createRule(sheet, cssRules, selectorText, elementState, properties);
                }
                // Get all elements with the attribute data-id from the iframe document
                const elements = iframeDocument.body.querySelectorAll("[data-id]");
                // Get the selector text from the rule
                const ruleSelector = rule.selectorText;
                // Highlight elements that match the rule selector
                highlightElements(elements, ruleSelector);
                // Construct a selector with the given parameters
                const selector = constructSelector(rule, properties, selectorText, elementState, className, key, _uid, store);
                // Add the class name to the set of class names
                setClassNames((prevClassNames) => new Set([...prevClassNames, className]));
                // Dispatch the addSelector action with the constructed selector
                dispatch({ type: 'addSelector', selector });

            } catch (e) {
                // Dispatch the error action with the error message
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {
                // Dispatch the finish action to indicate that the process is done
                dispatch({ type: 'finish' });
            }

        });

    };

    // Function to validate the new selector and start the dispatch
    const validateAndStart = (newSelector) => {
        if (!newSelector) {
            throw new Error('Selector not found.');
        }
        dispatch({ type: 'start' });
    };

    // Function to validate the class of the selector text
    const validateClassName = (selectorText) => {
        if (!validateClass(selectorText))
            throw new Error('Please Enter Valid Classname.');
    };

    // Function to get the iframe and its document
    const getIframeAndDocument = () => {
        const iframe = document.querySelector("#ac-editor-iframe-doc");
        let iframeDocument = iframe.contentDocument;
        return { iframe, iframeDocument };
    };

    // Function to get the stylesheet from the styleSheets
    const getStyleSheet = (styleSheets) => {
        let sheet = null;
        for (let i = 0; i < styleSheets.length; i++) {
            sheet = styleSheets[i];
            if (sheet.ownerNode.id === 'ac-stylesheet-global')
                break;
        }
        return sheet;
    };

    // Function to get the CSS media rule from the cssRules
    const getCssMediaRule = (cssRules, conditionText) => {
        let cssMediaRule = null;
        for (let i = 0; i < cssRules.length; i++) {
            let tempRule = cssRules[i];
            if (tempRule.conditionText === conditionText) {
                cssMediaRule = tempRule;
                break;
            }
        }
        if (!cssMediaRule) {
            const mediaIndex = cssRules.length;
            sheet.insertRule(`@media ${state.media} {}`, mediaIndex);
            cssMediaRule = cssRules[mediaIndex];
        }
        return cssMediaRule;
    };

    // Function to get the rule from the rules, selectorText, and elementState
    const getRule = (rules, selectorText, elementState) => {
        let rule = null;
        for (let i = 0; i < rules.length; i++) {
            let tempRule = rules[i];
            if (tempRule.selectorText === selectorText + elementState) {
                rule = tempRule;
                break;
            }
        }
        return rule;
    };

    // Function to create a new rule with the given parameters
    const createRule = (sheet, cssRules, selectorText, elementState, properties) => {
        const newIndex = cssRules.length;
        let cssText = '';
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                const value = properties[property].value;
                cssText += `${property}: ${value}; `;
            }
        }
        sheet.insertRule(`${selectorText + elementState} {${cssText}}`, newIndex);
        return cssRules[newIndex];
    };

    // Function to highlight elements that match the ruleSelector
    const highlightElements = (elements, ruleSelector) => {
        elements.forEach(element => {
            element.style.outline = null;
            if (element.matches(ruleSelector)) {
                element.style.outline = '1px solid red';
            }
        });
    };

    // Function to construct a selector with the given parameters
    const constructSelector = (rule, properties, selectorText, elementState, className, key, _uid, store) => {
        return {
            style: rule.style,
            properties,
            selectorText: selectorText,
            selectorType: elementState,
            className,
            key,
            _uid,
            store
        };
    };


    // Function to handle deletion of a selector
    const onDeleteSelector = async (selector) => {

        // Start the dispatch
        dispatch({ type: 'start' });

        try {

            // Validate the selector
            validateAndStart(selector);

            // Get the iframe and its document
            const { iframe, iframeDocument } = getIframeAndDocument();

            // Get the stylesheet
            let sheet = getStyleSheet(iframeDocument.styleSheets);

            // Delete the rule from the stylesheet
            deleteRuleFromSheet(sheet, selector);

            // Reset the outline style for each element
            resetOutlineStyle(iframeDocument);

            // Handle the selector type
            await handleSelectorType(selector);

            // Set isChange to true to indicate that changes have been made
            setIsChange(true)

            // Dispatch the deleteSelector action with the _uid of the deleted selector
            dispatch({ type: 'deleteSelector', selectorDeleted: selector._uid });

        } catch (e) {

            // Dispatch the error action with the error message
            dispatch({ type: 'error', error: e?.message || "Something went wrong." });

        } finally {
            // Dispatch the finish action to indicate that the process is done
            dispatch({ type: 'finish' });
        }

    }



    // Function to delete the rule from the stylesheet
    const deleteRuleFromSheet = (sheet, selector) => {
        for (let i = 0; i < sheet.cssRules.length; i++) {
            let rule = sheet.cssRules[i];
            if (rule.selectorText === selector.selectorText) {
                sheet.deleteRule(i);
                break;
            }
        }
    };

    // Function to reset the outline style for each element
    const resetOutlineStyle = (iframeDocument) => {
        const elements = iframeDocument.body.querySelectorAll("[data-id]");
        elements.forEach(element => {
            element.style.outline = '1px dotted #bdbdbd';
        });
    };

    // Function to handle the selector type
    const handleSelectorType = async (selector) => {
        const { _uid, className, selectorType } = selector;
        if (!selectorType) {
            await deleteData(state.page._id, _uid, STYLE_STORE_NAME);
            classNames.delete(className);
        } else {
            await updateSelectorData(selector);
        }
    };

    // Function to update the selector data
    const updateSelectorData = async (selector) => {
        const currentElement = await getData(state.page._id, selector._uid, 'id', STYLE_STORE_NAME);
        if (currentElement) {
            const style = currentElement.style || {};
            const selectorTypeKey = selector.selectorType || 'root';
            if (!style[selector.key])
                style[selector.key] = { [selectorTypeKey]: {} }
            if (!style[selector.key][selectorTypeKey])
                style[selector.key][selectorTypeKey] = {}
            delete style[selector.key][selectorTypeKey];
            await updateData(state.page._id, currentElement, STYLE_STORE_NAME);
        }
    };

    // Function to update the selector
    const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
        try {
            // Validate the selector and start the dispatch
            validateAndStart(selector);
            // Get the iframe and its document
            const { iframe, iframeDocument } = getIframeAndDocument();
            // Get the stylesheet from the iframe document
            let sheet = getStyleSheet(iframeDocument.styleSheets);
            // Get the CSS rules from the stylesheet
            let cssRules = sheet.cssRules || sheet.rules;
            // Get the rule from the CSS rules and the selector
            let rule = getRuleFromSheet(cssRules, selector);
            // If the rule does not exist, create a new rule
            if (!rule) {
                rule = createRuleInSheet(sheet, cssRules, selector);
            }
            // Update the properties of the rule
            updateRuleProperties(rule, selector);
            // Get the current element from the STYLE_STORE
            const currentElement = await getData(state.page._id, selector._uid, "id", STYLE_STORE_NAME);
            // Update the style of the current element
            updateElementStyle(currentElement, selector);
            // Update the data of the current element in the STYLE_STORE
            await updateData(state.page._id, currentElement, STYLE_STORE_NAME);
            // Reset the style change state
            setIsStyleChange(false);
            // Set the change state to true
            setIsChange(true)
            // Dispatch the updateStyle action
            dispatch({ type: 'updateStyle' });
        } catch (e) {
            // Dispatch the error action with the error message
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            // Dispatch the finish action to indicate that the process is done
            dispatch({ type: 'finish' });
        }
    };

    // Function to get the rule from the CSS rules and the selector
    const getRuleFromSheet = (cssRules, selector) => {
        let rule = null;
        // If the key of the selector is not 'normal', get the rule from the media rules
        if (selector.key !== 'normal') {
            let cssMediaRule = getCssMediaRule(cssRules, selector.key);
            let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;
            rule = getRule(mediaRules, selector.selectorText, selector.selectorType);
        } else {
            // If the key of the selector is 'normal', get the rule from the CSS rules
            rule = getRule(cssRules, selector.selectorText, selector.selectorType);
        }
        return rule;
    };

    // Function to create a new rule in the stylesheet
    const createRuleInSheet = (sheet, cssRules, selector) => {
        // Get the index of the new rule
        const newIndex = cssRules.length;
        // Insert the new rule into the stylesheet
        sheet.insertRule(`${selector.selectorText + selector.selectorType} {}`, newIndex);
        // Return the new rule
        return cssRules[newIndex];
    };

    // Function to update the properties of the rule
    const updateRuleProperties = (rule, selector) => {
        // Get the style declaration of the rule
        const styleDeclaration = rule.style;
        // Get the properties of the style declaration
        const properties = Array.from(styleDeclaration);
        // Remove each property from the style declaration
        properties.forEach(property => {
            styleDeclaration.removeProperty(property);
        });
        // If the properties of the selector do not exist, initialize them
        if (!selector.properties)
            selector.properties = {};
        // Set each property of the selector in the style declaration
        Object.keys(selector.properties).forEach(key => {
            if (key) {
                const value = selector.properties[key]?.value;
                const priority = selector.properties[key]?.priority;
                rule.style.setProperty(key, value, priority);
            }
        });
    };

    // Function to update the style of the current element
    const updateElementStyle = (currentElement, selector) => {
        // Get the style of the current element or initialize it
        const style = currentElement.style || {};
        // Get the selector type or default to 'root'
        const selectorType = selector.selectorType || 'root';
        // Initialize the style object for the key of the selector if it doesn't exist
        if (!style[selector.key])
            style[selector.key] = { [selectorType]: {} }
        // Initialize the style object for the selector type if it doesn't exist
        if (!style[selector.key][selectorType])
            style[selector.key][selectorType] = {}
        // Dispatch the add action with the updated selector
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
    };


    // Function to add an action to the store
    const onAddAction = async (action, STORE, isRedo) => {
        // If the action is not a redo action, delete all actions from the redo store
        if (!isRedo) {
            await deleteAllActions(REDO_STORE_NAME);
        }
        // Store the action in the store
        await storeAction(action, STORE);
    };

    // Function to perform an action
    const performAction = async (STORE1, STORE2) => {
        // Get the action from the store
        const action = await getAction(STORE1);

        // If there is no action, return
        if (!action)
            return;

        // Perform the action based on its type
        switch (action.action) {
            case 'updateStyle':
                await onUpdateSelector(
                    action.selector,
                    STORE2, true);
                break;
            default:
                break;
        }

        // Delete the action from the store
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

    // Function to validate a class
    const validateClass = (inputValue) => {
        const regex = /^\.[a-zA-Z][\w-]*$/;
        const isValid = regex.test(inputValue);
        return isValid;
    };

    // Function to handle changes
    const onChange = async (val) => {
        setIsChange(true)
        setIsStyleChange(true);
    }

    // Function to render the left tools
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

    // Function to render the right tools
    const RightTools = () => <span></span>

    // Function to handle back click
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

    // Render the component
    return <React.Fragment>
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
    </React.Fragment>
}

