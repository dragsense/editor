import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { Modal, Button, Input, message } from 'antd';
import { v4 as uuid } from 'uuid';
import SyntaxHighlighter from "../../../Element/Content/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"

import HTMLTags from '../Tag/htmlTags.json';

const acceptedAttributes = ["classes", "disabled", "action", "method", "placeholder", "target", "hidden", "value", "type", "name", "rows", "checked", "id", "href", "src", "style", "width", "height", "title", "alt"];

const layoutTags = {
    'header': 'header',
    'nav': 'nav',
    'aside': 'aside',
    'main': 'main',
    'section': 'section',
    'div': 'div',
    'article': 'article',
    'hr': 'hr',
    'footer': 'footer'
};

const mediaTags = {
    'img': 'img',
    'video': 'video',
    'audio': 'audio'
};

const textTags = {
    'h1': 'text',
    'h2': 'text',
    'h3': 'text',
    'h4': 'text',
    'h5': 'text',
    'h6': 'text',
    'p': 'text',
    'a': 'link',
    'li': 'text',
    'ul': 'list',
    'ol': 'list',
    'span': 'text',
    'label': 'text',
    'blockquote': 'text'
};

const inputTags = {
    'button': 'button',
    'input': 'input',
    'textarea': 'input',
    'select': 'select',
    'multiselect': 'multiselect',
    'checkbox': 'inputgroup',
    'radio': 'inputgroup'
};

const decideLayout = (tagName, attributes) => {
    if (attributes['type']?.value === 'checkbox' || attributes['type']?.value === 'checkbox')
        return inputTags[attributes['type']?.value];

    if (attributes['multiselect']?.value === true)
        return inputTags['multiselect'];

    if (layoutTags[tagName]) return layoutTags[tagName];
    if (mediaTags[tagName]) return mediaTags[tagName];
    if (textTags[tagName]) return textTags[tagName];
    if (inputTags[tagName]) return inputTags[tagName];
    return 'unknown';
};

const getAttributes = (node) => {
    let attributes = {};
    for (let i = 0; i < node.attributes.length; i++) {
        let attr = node.attributes[i];
        if (acceptedAttributes.includes(attr.name)) {
            attributes[attr.name] = { key: attr.name, value: `'${attr.value}'` };
        }
    }
    return attributes;
};

const getClasses = (node) => {
    let classes = {};
    if (node.classList.length > 0) {
        for (let i = 0; i < node.classList.length; i++) {
            let _uid = nanoid(3);
            classes[_uid] = {
                _uid: _uid,
                name: node.classList[i]
            };
        }
    }
    return classes;
};

const decideType = (tagName) => {
    if (layoutTags[tagName]) return 'layouts';
    if (mediaTags[tagName]) return 'media';
    if (textTags[tagName]) return 'texts';
    if (inputTags[tagName]) return 'inputs';
    return null;
};


const convertHtmlToObject = async (htmlString) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const rootNode = htmlDoc.body.firstChild; // Skip body tag
    let elements = []; // Initialize results as an array
    const root = await traverseNode(rootNode, null, elements, true); // Pass results array to traverseNode
    return { root, elements }; // Return all results
};



const traverseNode = async (node, parentUid, results, root = false) => {
    let result = {};

    result.type = decideType(node.tagName.toLowerCase());

    if (!result.type || node.nodeType === 8)
        return null;

    result._uid = uuid();

    const randomId = nanoid(8);
    // Define the class name for the new element
    const className = "ac-elem-" + randomId;
    result.parent = parentUid;
    result.tag = node.tagName.toLowerCase();



    result.attributes = getAttributes(node);
    result.layout = decideLayout(result.tag, result.attributes);
    // Get only first textnode if it exists for nodeValue
    result.nodeValue = node.childNodes.length > 0 && node.childNodes[0].nodeType === 3 ? node.childNodes[0].nodeValue : '';
    result.childNodes = [];
    result.classes = getClasses(node);
    result.className = className;
    result.selector = "." + result.className;

    if (result.layout === 'text') {
        result.nodeValue = node.innerHTML;
    } else if (result.type === 'media') {
        if (result.tagName === 'video' || result.tagName === 'audio') {
            result.srcs = Array.from(node.getElementsByTagName('source')).map(source => ({ mimetype: source.type, src: source.src }));
            result.nodeValue = node.textContent
        } else {
            result.nodeValue = node.src;
        }
    } else {
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];
            if (childNode.nodeType === 1) {
                const _uid = await traverseNode(childNode, result._uid, results);
                if (_uid)
                    result.childNodes.push(_uid);
            }
        }
    }

    if (!root) {
        result.tagName = node.tagName.toLowerCase();
        delete result.tag;

        results.push(result); // Push each result into the results array
        return result._uid;
    } else return result;
};





const HtmlConvertComponent = ({ onSelect }) => {
    const [htmlInput, setHtmlInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const handleInputChange = (event) => {
        setHtmlInput(event.target.value);
        setIsChange(true);
    };

    const handleConvertClick = async () => {
        setIsLoading(true);
        try {
            const { root, elements } = await convertHtmlToObject(htmlInput);
            onSelect(root, elements);
            setIsChange(false);
        } catch (error) {
            message.error(error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
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
                        value={htmlInput}
                        spellcheck="false"
                        className="code-text-editor"
                        onChange={handleInputChange}
                    >
                    </textarea>
                    <SyntaxHighlighter language={"html"} theme={dark} className="syntax-highlighter">
                        {htmlInput}
                    </SyntaxHighlighter>
                </div>}

            </div>
            <Button type='dashed' style={{ marginTop: 10 }}
                isLoading={isLoading}
                block
                disabled={!isChange}
                onClick={handleConvertClick}>Convert</Button>

        </div>
    );
};

export { HtmlConvertComponent };
