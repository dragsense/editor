import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, theme, Space } from "antd";
import ContentEditor from "../ContentEditor";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { EditOutlined } from "@ant-design/icons";
import { ToolBarButton } from "../ToolBar";

// Initialize the colorPrimary from theme
const {
    token: { colorPrimary },
} = theme.useToken();

// Initialize the contentRef and states
const contentRef = useRef();
const [html, setHtml] = useState('');
const [type, setType] = useState(0);
const [isModalOpen, setIsModalOpen] = useState(false);
const [change, setChange] = useState(false);

// Function to handle the content editor
const handleContentEditor = () => {
    if (!contentRef.current)
        return;

    ContentEditor.destroy(null);
    if (type == 0) {
        contentRef.current.innerHTML = html;
        ContentEditor.start(contentRef.current, document.querySelector('body'), onChange);
    }
}

// Use effect to handle the content editor
useEffect(handleContentEditor, [type]);

// Function to show the modal
const showModal = () => {
    setIsModalOpen(true);
};

// Function to handle the OK button
const handleOk = () => {
    if (type == 1) {
        node.nodeValue = html;
        onSave(html);
    }
    else {
        node.nodeValue =  contentRef.current.innerHTML;
        onSave(contentRef.current.innerHTML);
    }
    setIsModalOpen(false);
    ContentEditor.destroy(null);
};

// Function to handle the cancel button
const handleCancel = () => {
    ContentEditor.destroy(null);
    setIsModalOpen(false);
};

// Function to handle the after open change
const handleAfterOpenChange = (visible) => {
    if (visible && contentRef.current) {
        ContentEditor.destroy(null);
        if (type == 0) {
            contentRef.current.innerHTML = node.nodeValue;
            ContentEditor.start(contentRef.current, document.querySelector('body'), onChange);
        } else
            setHtml(node.nodeValue)
    } else {
        ContentEditor.destroy(null);
    }
};

// Function to handle the HTML change
const handleHtmlChange = (e) => {
    e.preventDefault();
    setHtml(e.target.value);
    setChange(true);
}

// Function to handle the type change
const handleTypeChange = (newType) => {
    e.preventDefault();
    if (contentRef.current)
        setHtml(contentRef.current.innerHTML)
    setType(newType);
}

return (
    <>
        <ToolBarButton onClick={showModal}>
            <EditOutlined style={{ color: colorPrimary }} />
        </ToolBarButton>
        <Modal width="60%" afterOpenChange={handleAfterOpenChange} title="Edit Content" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

            <Space wrap>
                <Button disabled={type == 0 || !change}
                    style={type == 0 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                    onClick={(e) => handleTypeChange(0)}
                > Visual </Button> <></>
                <Button disabled={type == 1 || !change}
                    style={type == 1 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                    onClick={(e) => handleTypeChange(1)}
                > html </Button>
            </Space>

            <br />
            <br />

            <div style={{ padding: 10, overflow: 'auto', maxHeight: '50vh' }}>

                {type == 0 && <div ref={contentRef} index={0}>
                </div>}
                {type == 1 && <div style={{ position: 'relative' }} index={1}>
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
                        value={html}
                        spellcheck="false"
                        className="code-text-editor"
                        onChange={handleHtmlChange}
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
