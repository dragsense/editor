import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, theme, Space, message, Cascader } from "antd";
import ContentEditor from "../../../../Element/ContentEditor";
import SyntaxHighlighter from "../../../../Element/Content/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { EditOutlined } from "@ant-design/icons";

// Splitting the logic into smaller functions for better readability and performance
// Function to handle the initialization of the Content Editor
const initializeContentEditor = (contentRef, html, type) => {
    if (!contentRef.current)
        return;
    ContentEditor.destroy(null);
    if (type === 0) {
        contentRef.current.innerHTML = html;
        ContentEditor.start(contentRef.current, document.querySelector('body'));
    }
}

// Function to handle the changes in the modal state
const handleModalStateChange = (state, contentRef, type, setHtml) => {
    if(!state.node) {
        message.error("node not selected.")
    }
    if (state.visible && contentRef.current) {
        
        let existingChildren = state?.node.querySelector(`[data-child="child-${state._uid}"]`);
  
        ContentEditor.destroy(null);
        if (type === 0) {
            contentRef.current.innerHTML = existingChildren ? existingChildren.innerHTML : state.nodeValue;
            ContentEditor.start(contentRef.current, document.querySelector('body'));
        } else
            setHtml(existingChildren ? existingChildren.innerHTML : state.nodeValue)
    } else {
        ContentEditor.destroy(null);
    }
}

// Function to handle the changes in the keys
const handleKeysChange = (type, contentRef, keys, textareaRef, setHtml) => {
    if (type === 0) {
        const contentEditable = contentRef.current;
        if (!contentEditable || !keys) return;
        contentEditable.focus();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const keysNode = document.createTextNode(`{{${keys.join("/")}}}`);
        range.deleteContents();
        range.insertNode(keysNode);
        range.setStartAfter(keysNode);
        range.setEndAfter(keysNode);
        selection.removeAllRanges();
        selection.addRange(range);
        contentEditable.focus();
    }
    else {
        const textarea = textareaRef.current;
        if (!textarea || !keys) return;
        textarea.focus();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        const newValue = `{{${keys.join("/")}}}`;
        const newText = currentText.substring(0, start) + newValue + currentText.substring(end);
        setHtml(newText)
        textarea.selectionStart = textarea.selectionEnd = start + newValue.length;
        textarea.focus();
    }
}

export default function RichTextEditor({
    disabled,
    state,
    onChange,
    cascaderStates }) {

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const contentRef = useRef();
    const textareaRef = useRef();
    const [html, setHtml] = useState('');
    const [type, setType] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        initializeContentEditor(contentRef, html, type);
    }, [type]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (e) => {
        e.stopPropagation();
        if (!state.node)
            return;
        if (type === 1) {
            onChange(html)
        }
        else {
            onChange(contentRef.current.innerHTML)
        }
        setIsModalOpen(false);
        ContentEditor.destroy(null);
    };

    const handleCancel = () => {
        ContentEditor.destroy(null);
        setIsModalOpen(false);
    };

    const handleAfterOpenChange = (visible) => {
        handleModalStateChange({node: state.node, _uid: state._uid, visible}, contentRef, type, setHtml);
    };

    const onChangeKeys = (keys) => {
        handleKeysChange(type, contentRef, keys, textareaRef, setHtml);
    };

    return (
        <>
            <Button disabled={disabled || !state.node} onClick={showModal}>
                Edit Content <EditOutlined style={{ color: colorPrimary }} />
            </Button>
            <Modal width="90%" afterOpenChange={handleAfterOpenChange}
                title={<>
                    Edit Contents &nbsp;&nbsp;
                    <Cascader
                        options={cascaderStates}
                        onChange={onChangeKeys}
                        placeholder="Select State"
                    />
                </>} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Space wrap>
                    <Button disabled={type === 0}
                        style={type === 0 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                        onClick={(e) => {
                            e.preventDefault();
                            setType(0)
                        }}
                    > Visual </Button> <></>
                    <Button disabled={type === 1}
                        style={type === 1 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                        onClick={(e) => {
                            e.preventDefault();
                            if (contentRef.current)
                                setHtml(contentRef.current.innerHTML)
                            setType(1);
                        }}
                    > html </Button>
                </Space>
                <br />
                <br />
                <div style={{ overflowY: 'auto', overflowX: 'clip', maxHeight: '50vh' }}>
                    {type === 0 && <div key={0} ref={contentRef} index={0}>
                    </div>}
                    {type === 1 && <div key={1} style={{ position: 'relative' }} index={1}>
                        <textarea
                            ref={textareaRef}
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
                            value={html}
                            spellcheck="false"
                            className="code-text-editor"
                            onChange={(e) => {
                                e.preventDefault();
                                setHtml(e.target.value);
                            }}
                        >
                        </textarea>
                        <SyntaxHighlighter language={"html"} theme={dark} className="syntax-highlighter">
                            {html}
                        </SyntaxHighlighter>
                    </div>}
                </div>
            </Modal>
        </>
    );
};
