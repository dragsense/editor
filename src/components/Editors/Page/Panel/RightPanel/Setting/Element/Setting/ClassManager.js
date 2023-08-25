import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Button, Tooltip, AutoComplete, Popconfirm, Alert, Space, theme } from 'antd';
import ElementCondition from "../Condition";

import { PlusOutlined, CloseOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const initial = {
    cKey: '', key: null, value: [], type: ''
}

const classes = [];

export default function ClassManager({ element, cascaderStates, setIsChange }) {

    const {
        token: { colorBgBase, colorWarning },
    } = theme.useToken();


    const [validationResult, setValidationResult] = useState(null);

    const [current, setCurrent] = useState(null);

    const input = useRef();

    const [state, setState] = useState({
        tags: [],
        inputVisible: false,
        inputValue: ''
    });



    useEffect(() => {


        if (!Array.isArray(element.classes))
            element.classes = [];

        const classes = element.classes;

        setState({ ...state, tags: classes })


    }, [element]);


    const validateSearchInput = (inputValue, option) => {
        const regex = /^\.[a-zA-Z][\w-]*$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        return isValid;
    };


    const handleClose = removedTag => {

        const tags = state.tags.filter(tag => tag !== removedTag);
        element.classes = tags.map(tag => tag);
        setState({ ...state, tags });
        setIsChange(true);


    };

    const showInput = () => {

        setState({ ...state, inputVisible: !state.inputVisible });
        setCurrent({});
    };

    const handleInputChange = e => {
        validateSearchInput(e.target.value)
        setState({ ...state, inputValue: e.target.value });
    };


    const handleSelectChange = value => {
        validateSearchInput(value)
        setState({ ...state, inputValue: value });
    };

    const handleInputConfirm = () => {

        let { tags, inputValue } = state;
        inputValue = inputValue.substring(1);
        if (inputValue && tags.findIndex(tag => tag.name == inputValue) == -1) {
            tags = [...tags, { name: inputValue, conditions: current?.conditions }];
            element.classes.push({ name: inputValue, conditions: current?.conditions });
            setIsChange(true);

            const value = "." + inputValue;
            if (classes.findIndex(clas => clas.value == value) === -1)
                classes.push({ value });

        }

        setState({
            ...state,
            tags,
            inputVisible: false,
            inputValue: '',
        });

        setCurrent(null);


    };

    const onClose = () => {
        setValidationResult('')
    };


    const { tags, inputVisible, inputValue } = state;
    return (
        <>
            {tags.map((tag, index) => {
                const isLongTag = tag.name.length > 20;

                const tagElem = (
                    <Tag
                        key={tag.name}


                        color={Array.isArray(tag.conditions) ? colorWarning : colorBgBase}
                    >
                        <span >
                            {isLongTag ? `${tag.name.slice(0, 2)}...` : tag.name} &nbsp;&nbsp;
                            <Popconfirm
                                title="Delete"
                                description="Are you sure to delete this class?"
                                onConfirm={() => handleClose(tag)}
                                onCancel={() => { }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                        </span>
                    </Tag>
                );
                return tagElem;

            })}
            {inputVisible && <>

                {validationResult === 'invalid' && <>
                    <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message="Please enter a valid CSS class name (e.g. .my-class).">

                    </Alert>
                </>}
                <Space style={{ paddingTop: 10 }}>

                    <AutoComplete
                        options={classes}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

                        }
                        status={validationResult === 'invalid' ? 'error' : ''}
                        onSelect={handleSelectChange}
                    >
                        <>


                            <Input
                                ref={input}
                                type="text"
                                size="small"
                                placeholder='Enter Class Name'
                                style={{ width: '100%' }}
                                value={inputValue}

                                onChange={handleInputChange}
                            />
                        </>
                    </AutoComplete>

                    <Button disabled={validationResult === 'invalid' || !inputValue} onClick={handleInputConfirm}><PlusOutlined /></Button>
                    <Button onClick={(e) => {

                        e.preventDefault();
                        setState({ ...state, inputVisible: false });
                        setCurrent({});

                    }}><CloseOutlined /></Button>

                </Space>

                {current && <ElementCondition setIsChange={setIsChange} cascaderStates={cascaderStates} state={current} setState={setCurrent} />

                }
            </>

            }
           <div style={{paddingTop: 10}}>
            {element && !inputVisible && (
                <Tag onDoubleClick={showInput}>
                    <PlusOutlined /> New Class
                </Tag>
            )}
            </div>
        </>
    );

}
