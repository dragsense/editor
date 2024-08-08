import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Button, Tooltip, AutoComplete, Typography, Popconfirm, Alert, Space, theme, Cascader, message, Form } from 'antd';
import ElementCondition from "../Condition";

import { PlusOutlined, CloseOutlined, MinusCircleOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';

// Initial state
const initial = {
    cKey: '', key: null, value: [], type: ''
}
const { Text } = Typography;

// Array to hold classes
const classes = [];

// Main function
export default function ClassManager({
    element,
    cascaderStates,
    setIsChange }) {

    // Theme tokens
    const {
        token: { colorText,colorError, colorBgLayout, colorWarning },
    } = theme.useToken();

    // State variables
    const [validationResult, setValidationResult] = useState(null);
    const [current, setCurrent] = useState(null);
    const input = useRef();
    const [state, setState] = useState({
        _uid: undefined,
        stateValue: undefined,
        inputVisible: false,
        inputValue: ''
    });
    const [currentClasses, setCurrentClasses] = useState([]);

    // Effect to update current classes
    useEffect(() => {
        if (!cascaderStates) return;
        // setCurrentClasses(
        //     cascaderStates
        //         .map(state => ({
        //             ...state,
        //             children: state.children?.filter(childState => ['classes'].includes(childState.type))
        //         }))
        // );
       
    }, [cascaderStates]);

    // Function to validate search input
    const validateSearchInput = (inputValue, option) => {
        const regex = /^(?!.*\d\.{2,})(?=.*[a-zA-Z\[\]_-]).*$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        const lengthInvalid = inputValue.length < 3 || inputValue.length > 20;
        if (isValid && !lengthInvalid) {
            setValidationResult('valid');
        } else {
            setValidationResult('invalid');
        }
        return isValid && !lengthInvalid;
    };

    // Function to handle close
    const handleClose = uid => {
        try {
            if (!element.classes)
                element.classes = {};
            delete element.classes[uid];
            setState({ ...state });
            setIsChange(true);
        } catch (e) {
            message.error("class not found.")
        }
    };

    // Function to show input
    const showInput = () => {
        setState({ ...state, inputVisible: !state.inputVisible });
        setCurrent({});
    };

    // Function to handle input change
    const handleInputChange = e => {
        validateSearchInput(e.target.value)
        setState({ ...state, inputValue: e.target.value });
    };

    // Function to handle select change
    const handleSelectChange = value => {
        validateSearchInput(value)
        setState({ ...state, inputValue: value });
    };

    // Function to handle input confirm
    const handleInputConfirm = () => {
        let { inputValue, stateValue, _uid } = state;
         _uid = _uid ? _uid : nanoid(3);
        if (!element.classes)
            element.classes = {};
        element.classes[_uid] = { _uid, stateValue, name: inputValue, conditions: current?.conditions };
        setIsChange(true);
        const value = inputValue;
        if (classes.findIndex(clas => clas.value == value) === -1 && !stateValue)
            classes.push({ value });
        setState({
            _uid: undefined,
            inputVisible: false,
            inputValue: '',
            stateValue: undefined,
        });
        setCurrent(null);
    };

    // Function to handle close
    const onClose = () => {
        setValidationResult('')
    };

    // Function to handle key change
    const onChangekey = (keys) => {
        if (keys === undefined || keys[0] === undefined) {
            state.stateValue = undefined
        } else {
            const value = [...keys];
            const stateValue = state.stateValue ?? {};
            stateValue.type = value[0];
            value.shift();
            stateValue.key = value;
            state.stateValue = stateValue
        }
        setState({
            ...state
        });
        setIsChange(true);
    }

    // Render
    const { tags, inputVisible, inputValue, stateValue } = state;
    return (
        <>
            {Object.values(element.classes || {}).map((tag, index) => {
                const isLongTag = tag.name.length > 20;
                const name = tag.name;
                const tagElem = (
                    <Tag
                        key={index}
                        color={Array.isArray(tag.conditions) ? colorWarning : colorBgLayout}
                    >
                        <span style={{ color: colorText }}>
                            {isLongTag ? `${name.slice(0, 2)}...` : name} &nbsp;&nbsp;
                           <EditOutlined size="small" onClick={(e) => {
                                e.preventDefault();
                                setState({
                                    _uid: tag._uid,
                                    inputVisible: !state.inputVisible, 
                                    inputValue: name,
                                    stateValue: tag.stateValue
                                });
                                setCurrent({ conditions: tag.conditions })
                            }} />  &nbsp;&nbsp; 
                            <Popconfirm
                                title="Delete"
                                description="Are you sure to delete this class?"
                                onConfirm={() => handleClose(tag._uid)}
                                onCancel={() => { }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined  style={{color: colorError}}/>
                            </Popconfirm>
                        </span>
                    </Tag>
                );
                return tagElem;
            })}
            {inputVisible && <>
                {validationResult === 'invalid' && <>
                    <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message="Please enter a valid CSS class name (e.g. my-class).">
                    </Alert>
                </>}
                <>State <Tooltip title={"Select the state whose value can be used in the class name."
                }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>
                    <Text disabled>
                        Optional
                    </Text>
                <Cascader style={{ width: '100%', margin: '5px 0'  }}
                    allowClear
                    options={cascaderStates}
                    value={state.stateValue
                        ?
                        [state.stateValue.type, ...(Array.isArray(state.stateValue.key) ?
                            state.stateValue.key : [])] : [undefined]}
                    onChange={onChangekey}>
                </Cascader>
                <Text disabled>
                        e.g [state], [state]-class OR hero-class
                    </Text>
                <Space style={{ paddingTop: 10 }}>
                    <AutoComplete
                        options={classes}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        status={validationResult === 'invalid' ? 'error' : ''}
                        onSelect={handleSelectChange}
                        value={inputValue}
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
            <div style={{ paddingTop: 10 }}>
                {element && !inputVisible && (
                    <Tag onDoubleClick={showInput}>
                        <PlusOutlined /> New Class
                    </Tag>
                )}
            </div>
        </>
    );
}
