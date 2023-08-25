import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from 'prop-types';


import { Button, Modal, message } from "antd";
import { CodeEditor } from "@/components/dashboard/JS/CodeEditor";

import SyntaxHighlighter from "@/components/dashboard/JS/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"

export default function HtmlEditor({ content, code, setCode }) {


    const [textRef, setTextRef] = useState(null);


    useEffect(() => {

        if (!textRef)
            return

        try {
            textRef.value = content;

            let _status = true;
            let _code = content;

            if (!_code) {
                _code = 'Please Write the Code Here...'
                _status = false;
            }
            setCode({ code: _code, status: _status });
            textRef.value = content;


        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {

        }

    }, [textRef, content]);


   


    return (
        <>
            <CodeEditor
                placeHolder="Type your code here..."
                onChange={(e) => {
                    const value = e.target.value;
                    if (value == '') {
                        setCode({ code: 'Please Write the Code Here...', status: false });
                    }
                    else
                        setCode({ code: value, status: true });
                }}
                setTextRef={setTextRef}
            />
            <SyntaxHighlighter language={"html"} theme={dark} className="syntax-highlighter">
                {code.code}
            </SyntaxHighlighter>
        </>


    );
};




