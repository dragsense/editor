import React, { useState, useEffect, useRef } from 'react';
import { useNodeStates, useComponentsStates } from "@/components/Editor/PageProvider";

import { PlusOutlined } from '@ant-design/icons';

import { Form, Input, Tag, Checkbox, Tooltip, AutoComplete, InputNumber } from "antd";
const { TextArea } = Input;




export default function NodeSetting({  }) {


    const { node } = useNodeStates();
    const { component } = useComponentsStates();

    const [name, setName] = useState('unnamed');
    const [id, setId] = useState('');
    const [href, setHref] = useState('');

    const [colSpan, setColSpan] = useState(null);
    const [rowSpan, setRowSpan] = useState(null);

    const [isTableCols, setTabeCols] = useState(false);

    const [isForm, setIsForm] = useState(false);

    const [isInput, setIsInput] = useState(false);

    const [inputName, setInputName] = useState('');
    const [inputPlaceHolder, setInputPlaceHolder] = useState('');
    const [isRequired, setIsRequired] = useState(false);

    const [formAction, setFormAction] = useState('');
    const [formMethod, setFormMethod] = useState('');

    const [formRedirect, setFormRedirect] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const [loadingId, setLoadingId] = useState('');
    const [errorId, setErrorId] = useState('');
    const [messageId, setMessageId] = useState('');


    const input = useRef();
    const editInput = useRef();

    const [state, setState] = useState({
        tags: [],
        inputVisible: false,
        inputValue: '',
    });


    useEffect(() => {

        if (!node)
            return;



        setName(node.element.name);



        if (node.element.tagName == 'a')
            setHref('#');
        else
            setHref('');

        if (node.element.tagName == 'td' || node.element.tagName == 'th')
            setTabeCols(true);
        else
            setTabeCols(false);

            if (node.element.tagName == 'input' || node.element.tagName == 'option') 
            setIsInput(true);
        else
            setIsInput(true);

        if (node.element.tagName == 'form') {
            setIsForm(true);

            setFormAction(node.element.setting?.action);
            setFormMethod(node.element.setting?.method);
            setFormRedirect(node.element.setting?.redirect);
            setSuccessMessage(node.element.setting?.successMessage);
            setErrorMessage(node.element.setting?.errorMessage);

            setLoadingId(node.element.setting?.laodingId);
            setErrorId(node.element.setting?.errorId);
            setMessageId(node.element.setting?.messageId);
        }
        else
            setIsForm(false);


        if (node.element.attributes) {
            let foundIndex = node.element.attributes.findIndex(x => x.key == 'id');

            if (foundIndex !== -1)
                setId(node.element.attributes[foundIndex].nodeValue);

            if (node.element.tagName == 'a') {
                let foundIndex = node.element.attributes.findIndex(x => x.key == 'href');

                if (foundIndex !== -1)
                    setHref(node.element.attributes[foundIndex].nodeValue);
            }

            if (node.element.tagName == 'td' || node.element.tagName == 'th') {
                let foundIndex = node.element.attributes.findIndex(x => x.key == 'colspan');

                if (foundIndex !== -1)
                    setColSpan(node.element.attributes[foundIndex].nodeValue);

                foundIndex = node.element.attributes.findIndex(x => x.key == 'rowspan');

                if (foundIndex !== -1)
                    setRowSpan(node.element.attributes[foundIndex].nodeValue);
            }


            if (node.element.tagName == 'input' || node.element.tagName == 'option') {
                let foundIndex = node.element.attributes.findIndex(x => x.key == 'name');

                if (foundIndex !== -1)
                    setInputName(node.element.attributes[foundIndex].nodeValue);

                    foundIndex = node.element.attributes.findIndex(x => x.key == 'placeholder');

                if (foundIndex !== -1)
                    setInputPlaceHolder(node.element.attributes[foundIndex].nodeValue);

                    foundIndex = node.element.attributes.findIndex(x => x.key == 'required');

                    if (foundIndex !== -1)
                        setIsRequired(node.element.attributes[foundIndex].nodeValue);
            }


        }



        if (!node.element.classes)
            node.element.classes = [];


        setState({ ...state, tags: node.element.classes });


    }, [node]);

    const onChangeName = (e) => {
        e.preventDefault();

        setName(e.target.value);
    }


    const onChangeId = (e) => {
        e.preventDefault();

        setId(e.target.value);
    }

    const onChangeHref = (e) => {
        e.preventDefault();

        setHref(e.target.value);
    }

    const onChangeColSpan = (value) => {

        setColSpan(value);
    }

    const onChangeRowSpan = (value) => {


        setRowSpan(value);
    }

    const onChangeFormAction = (e) => {
        e.preventDefault();


        setFormAction(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), action: e.target.value }
    }

    const onChangeFormMethod = (e) => {
        e.preventDefault();

        setFormMethod(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), method: e.target.value }
    }

    const onChangeFormRedirect = (e) => {
        e.preventDefault();

        setFormRedirect(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), redirect: e.target.value }
    }

    const onChangeSuccessMessage = (e) => {
        e.preventDefault();

        setSuccessMessage(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), successMessage: e.target.value }
    }

    const onChangeErrorMessage = (e) => {
        e.preventDefault();

        setErrorMessage(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), errorMessage: e.target.value }
    }

    const onChangeLoadingID = (e) => {
        e.preventDefault();
        setLoadingId(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), loadingId: e.target.value }
    }

    const onChangeMessageID = (e) => {
        e.preventDefault();
        setMessageId(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), messageId: e.target.value }
    }

    const onChangeErrorID = (e) => {
        e.preventDefault();
        setErrorId(e.target.value);
        node.element.setting = { ...(node.element.setting || {}), errorId: e.target.value }
    }

    const onChangeInputName = (value) => {


        setInputName(value);
    }

    const onChangeInputPlaceholder = (value) => {


        setInputPlaceHolder(value);
    }


    const handleClose = removedTag => {
        const tags = state.tags.filter(tag => tag !== removedTag);
        node.element.classes = tags.map(tag => tag);
        modify();
        setState({ ...state, tags });
    };


    const showInput = () => {

        setState({ ...state, inputVisible: !state.inputVisible });
    };

    const handleInputChange = e => {
        setState({ ...state, inputValue: e.target.value });
    };

    const handleInputConfirm = () => {
        const { inputValue } = state;
        let { tags } = state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, { value: inputValue, condition }];
            node.element.classes.push({ value: inputValue, condition });

            if (classes.indexOf(inputValue) === -1)
                classes.push({ value: inputValue });
            modify();
        }

        setState({
            ...state,
            tags,
            inputVisible: false,
            inputValue: '',
        });




    };



    const { tags, inputVisible, inputValue } = state;


    return <div className="wrapper">
        <Form.Item label="Element Name">
            <Input value={name} placeholder="Name" onChange={onChangeName} />
        </Form.Item>

        <Form.Item label="Element ID">
            <Input value={id} placeholder="ID" onChange={onChangeId} />
        </Form.Item>


        {href && <Form.Item label="Element Link">
            <Input value={href} placeholder="href" onChange={onChangeHref} />
        </Form.Item>
        }

        {isTableCols && <Form layout='inline'>
            <Form.Item label="Column Span">
                <InputNumber value={colSpan} placeholder="colspan" onChange={onChangeColSpan} />
            </Form.Item>
            <Form.Item label="Row Span">
                <InputNumber value={rowSpan} placeholder="colspan" onChange={onChangeRowSpan} />
            </Form.Item>
        </Form>
        }

        {isInput && 
            <Form >
            <Form.Item label="Input Name">
                <Input value={inputName} placeholder="name" onChange={onChangeInputName} />
            </Form.Item>
            <Form.Item label="Input Placeholder">
                <Input value={inputPlaceHolder} placeholder="placeholder" onChange={onChangeInputPlaceholder} />
            </Form.Item>
            <Form.Item label="Is Required">
            <Checkbox checked={isRequired} onChange={() => setIsRequired(!isRequired)}/> 
            </Form.Item>
        </Form>
        }

            {isForm  && <Form>

                {component.form && <><Form.Item label="Action">
                    <Input  value={formAction} placeholder="action" onChange={onChangeFormAction} />
                </Form.Item>

                <Form.Item label="Method">
                    <Input  value={formMethod} placeholder="method" onChange={onChangeFormMethod} />
                </Form.Item>

                <Form.Item label="Redirect">
                    <Input value={formRedirect} placeholder="redirect" onChange={onChangeFormRedirect} />
                </Form.Item>

                <Form.Item label="successMessage">
                    <TextArea rows={4} value={successMessage} placeholder="message" name='successMessage' onChange={onChangeSuccessMessage} />
                </Form.Item>

                <Form.Item label="errorMessage">
                    <TextArea rows={4} value={successMessage} placeholder="message" name='errorMessage' onChange={onChangeErrorMessage} />
                </Form.Item>
                </>}

                <Form.Item label="Message ID">
                    <Input value={messageId} placeholder="message element ID" onChange={onChangeMessageID} />
                </Form.Item>


                <Form.Item label="Loading ID">
                    <Input value={loadingId} placeholder="loadind element ID" onChange={onChangeLoadingID} />
                </Form.Item>

                <Form.Item label="Error ID">
                    <Input value={errorId} placeholder="error element ID" onChange={onChangeErrorID} />
                </Form.Item>



            </Form>
            }

            <br />

            <>
                {tags.map((tag, index) => {
                    const isLongTag = tag.value.length > 20;

                    const tagElem = (
                        <Tag
                            className="edit-tag"
                            key={tag.value}
                            closable={index !== -1}
                            onClose={() => handleClose(tag)}
                            color={tag.condition ? '#19274b' : '#bdbdbd'}
                        >
                            <span >
                                {isLongTag ? `${tag.value.slice(0, 2)}...` : tag.value}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={<span>{tag.value} <br />
                            {tag.condition && <> cond: <b>{tag.condition.key} </b>
                                <em>{tag.condition.type}</em>
                                {tag.condition.value} </>}</span>} key={tag.value}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        <Tooltip title={<span>
                            {tag.condition && <> cond: <b>{tag.condition.key} </b>
                                <em>{tag.condition.type}</em>
                                {tag.condition.value} </>}</span>} key={tag.value}>
                            {tagElem}
                        </Tooltip>
                    );
                })}
                {inputVisible && <>

                    <AutoComplete
                        options={classes}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        disabled={showCondition}
                    >
                        <Input
                            ref={input}
                            type="text"
                            size="small"
                            style={{ width: '100%', marginBottom: 10 }}
                            className="tag-input"
                            value={inputValue}

                            onChange={handleInputChange}
                            onPressEnter={handleInputConfirm}
                        />
                    </AutoComplete>


                </>
                }
                {node && !inputVisible && (
                    <Tag className="site-tag-plus" onClick={showInput}>
                        <PlusOutlined /> New Class
                    </Tag>
                )}
            </>



        </div>

        };

