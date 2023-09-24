import React, { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { nanoid } from "nanoid";

import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { STYLE_STORE_NAME, updateData } from '../../../../lib/db';

const CSSModal = ({ state, getIframeAndDocument, setClassNames,setIsConverted }) => {
    const [visible, setVisible] = useState(false);
    const [cssString, setCssString] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isChange, setIsChange] = useState(false);


    const showModal = () => {
        setVisible(true);
    };


    


  

    const handleOk = async () => {

        try {

            setIsLoading(true);

            if (!state.page?._id) {
                message.error('Project Not Found.');
                return;
            }

            let cssObject = {};
            let cssArray = cssString.split('}');
            cssArray.pop();
            if (cssArray.length > 20) {
                message.error('CSS array length should be less than 20');
                return;
            }
            const cssArrayPromises = cssArray.map(cssRule => new Promise((resolve, reject) => {
                let [selector, rules] = cssRule.split('{');
                selector = selector.trim();
                const regex = /^\.[a-z0-9_-]+(?::hover|::before|::after)?$/i;
                if (regex.test(selector)) {
                    let pseudoClass = 'root';
                    if (selector.includes(':hover')) {
                        pseudoClass = ':hover';
                    } else if (selector.includes('::before')) {
                        pseudoClass = '::before';
                    } else if (selector.includes('::after')) {
                        pseudoClass = '::after';
                    }
                    selector = selector.replace(/:hover|::before|::after/, '').trim();
                    if (!cssObject[selector]) {
                        cssObject[selector] = {};
                    }
                    if (!cssObject[selector][pseudoClass]) {
                        cssObject[selector][pseudoClass] = {};
                    }
                    rules = rules.split(';');
                    rules.pop();
                    const properties = {}
                    rules.forEach(rule => {
                        let [property, value] = rule.split(':');
                        let [val, unit, priority] = value.trim().split(/(?<=\d)(?=[a-z!]+)/i);
                        let propertyObject = { value: val };
                        if (unit !== undefined) propertyObject['unit'] = unit;
                        if (priority === '!') propertyObject['priority'] = 'important';
                        properties[property.trim()] = propertyObject;
                    });
                    cssObject[selector][pseudoClass]['properties'] = properties;
                    resolve();
                } else {
                    reject("Invalid selector format! Please provide a single class selectors.");
                }
            }));

            await Promise.all(cssArrayPromises);

        

            const classNames = [];
            const updatePromises = []; // Collecting promises to use Promise.all later
            
            for (const key in cssObject) {
                if (cssObject.hasOwnProperty(key)) { // To ensure only own properties are processed
                    const selector = cssObject[key];
                    const mediaKey = state.media || 'normal';
                    const id = nanoid(8);
                    const style = {
                        _uid: id,
                        selectorText: key,
                        type: state.elementType,
                        style: {
                            [mediaKey]: selector
                        }
                    }
                    classNames.push(key.slice(1));

                    updatePromises.push(updateData(state.page._id, style, STYLE_STORE_NAME));
                }
            }
            
            // Wait for all updates to finish
            await Promise.all(updatePromises);
            
            setClassNames((prevClassNames) => {
                const updatedSet = new Set([...prevClassNames, ...classNames]);
                return [...updatedSet]; // Convert the set back to an array
            });
            

            const { iframe, iframeDocument } = getIframeAndDocument();
    
            const styleElement = iframeDocument.createElement('style');
            styleElement.textContent = cssString;
            iframeDocument.head.appendChild(styleElement);

            setIsConverted((prev) => !prev);

        } catch (e) {
            message.error("Something went wrong. " + e)
        } finally {
            setIsLoading(false);
        }

        //setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Convert CSS
            </Button>
            <Modal title="CSS Converter" open={visible} width="50vw"
                footer={
                    <Button type='dashed' style={{ margin: 10 }}
                        isLoading={isLoading}
                        disabled={!isChange}
                        onClick={handleOk}>Convert</Button>
                }
                onCancel={handleCancel}>

                <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                    <div style={{ maxHeight: 450, overflow: 'auto' }}>

                        {<div key={1} style={{ position: 'relative' }} index={1}>
                            <textarea
                                style={{
                                    caretColor: 'white',
                                    margin: '0px',
                                    border: '0px',
                                    background: 'none',
                                    boxSizing: 'inherit',
                                    display: 'inherit',
                                    fontSize: '1em',
                                    fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
                                    fontStyle: 'inherit',
                                    fontVariantLigatures: 'inherit',
                                    fontWeight: 'inherit',
                                    letterSpacing: 'inherit',
                                    lineHeight: 'inherit',
                                    tabSize: 'inherit',
                                    textIndent: 'inherit',
                                    textRendering: 'inherit',
                                    textTransform: 'inherit',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'keep-all',
                                    overflowWrap: 'break-word',
                                    position: 'absolute',
                                    top: '0px',
                                    left: '0px',
                                    width: '100%',
                                    height: '100%',
                                    resize: 'none',
                                    color: 'inherit',
                                    overflow: 'hidden',
                                    '-webkit-font-smoothing': 'antialiased',
                                    '-webkit-text-fill-color': 'transparent',
                                    padding: '0.5rem',
                                }}
                                placeholder="Type your code here..."
                                value={cssString}
                                spellcheck="false"
                                className="code-text-editor"
                                onChange={e => {
                                    setCssString(e.target.value)
                                    setIsChange(true);
                                }

                                }
                            >
                            </textarea>
                            <SyntaxHighlighter
                                language={"css"}
                                style={dark}
                                className="syntax-highlighter"
                            >
                                {cssString}
                            </SyntaxHighlighter>
                        </div>}


                    </div>


                </div>

            </Modal>
        </>
    );
};

export default CSSModal;

