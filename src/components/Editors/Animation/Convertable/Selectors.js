import React, { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { nanoid } from "nanoid";

import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { STYLE_STORE_NAME, getData, updateData } from '../../../../lib/db';

const CSSModal = ({ state, getIframeAndDocument, animation, setIsConverted }) => {
    const [visible, setVisible] = useState(false);
    const [cssString, setCssString] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isChange, setIsChange] = useState(false);


    const showModal = () => {
        setVisible(true);
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

    const handleOk = async () => {
        try {
            setIsLoading(true);
            if (!state.page?._id || !animation) {
                message.error('Project or Animation Not Found.');
                return;
            }


            let cssObject = {};
            let cssArray = cssString.split('}');
            cssArray.pop();
            if (cssArray.length > 20) {
                message.error('CSS array length should be less than 10');
                return;
            }
            cssArray.forEach(cssRule => {
                let [selector, rules] = cssRule.split('{');
                selector = selector.trim();
                const regex = /^(100|[1-9][0-9]?|0)%|from|to$/;
                if (regex.test(selector)) {
                    cssObject[selector] = cssObject[selector] || {};
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
                    cssObject[selector]['properties'] = properties;
                    cssObject[selector]['selectorText'] = selector;
                } else {
                    message.error("Invalid selector format! Please provide a single step selectors.");
                    return
                }
            });
            animation.style = {
                ...animation.style,
                ...cssObject
            }
            const { iframe, iframeDocument } = getIframeAndDocument();
            const styleSheets = iframeDocument.styleSheets;
            const sheet = getStyleSheet(styleSheets);

            if (!sheet) {
                throw new Error('Styel Sheet not found!');
            }

            let cssRules = sheet.cssRules || sheet.rules;
            let ruleIndex = Array.from(cssRules).findIndex(rule => rule.type === 7 && rule.name === animation.name);
            if (ruleIndex < 0) {
                throw new Error('Animation not found!');
            }
            const keyframesRules = cssRules[ruleIndex];
            for (const key in cssObject) {
                if (cssObject.hasOwnProperty(key)) {
                    let index = Array.from(keyframesRules.cssRules).findIndex(sel => sel.keyText === key);
                    let rule;
                    if (index < 0) {
                        const ruleText = `${key} {}`;
                        index = keyframesRules.appendRule(ruleText);
                        rule = keyframesRules.cssRules[keyframesRules.cssRules.length - 1];
                    } else {
                        rule = keyframesRules.cssRules[index];
                    }

                    const properties = cssObject[key].properties || {};
                    const cssText = Object.entries(properties)
                        .map(([property, details]) => {
                            return `${property}: ${details.value}${details.priority ? ' !' + details.priority : ''}`;
                        })
                        .join('; ');

                    rule.style.cssText = cssText;
                }
            }

            updateData(state.page._id, animation, STYLE_STORE_NAME)
            setIsConverted((prev) => !prev);
        } catch (e) {
            message.error("Something went wrong. " + e?.message)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Convert CSS
            </Button>
            <Modal title="CSS Converter (Warning: This action will replace the values.)" open={visible} width="50vw"
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

