import { QuestionCircleOutlined } from "@ant-design/icons";
import { Cascader, Divider, Form, Input, Typography, Radio, Button, Modal, Tooltip } from "antd";
import { useState, useCallback } from "react";

const { TextArea } = Input;
const { Text } = Typography;

// Main function for handling onMove event
export default function OnMoveEvent({
    states,
    state, setState,
    onSubmit }) {

    // State to track if there is any change
    const [isChange, setIsChange] = useState(false);

    // Function to handle change in input for X value
    const onChangeX = useCallback((event) => {
        event.preventDefault();
        const valueX = event.target.value;
        setState(prevState => ({ ...prevState, valueX }));
        setIsChange(true);
    }, [setState]);

    // Function to handle change in state for X value
    const onChangeStateX = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined) {
            setState(prevState => ({ ...prevState, stateValueX: { type: undefined, key: [] } }));
        } else {
            const value = [...keys];
            value.shift();
            setState(prevState => ({ ...prevState, stateValueX: { type: keys[0], key: value } }));
        }
        setIsChange(true);
    }, [setState]);

    // Function to handle change in input for Y value
    const onChangeY = useCallback((event) => {
        event.preventDefault();
        const valueY = event.target.value;
        setState(prevState => ({ ...prevState, valueY }));
        setIsChange(true);
    }, [setState]);

    // Function to handle change in state for Y value
    const onChangeStateY = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined) {
            setState(prevState => ({ ...prevState, stateValueY: { type: undefined, key: [] } }));
        } else {
            const value = [...keys];
            value.shift();
            setState(prevState => ({ ...prevState, stateValueY: { type: keys[0], key: value } }));
        }
        setIsChange(true);
    }, [setState]);

    // Render the component
    return (
        <>
            <Form.Item label={<>KeyX <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Cascader options={states}
                    value={[state?.stateValueX?.type, ...(Array.isArray(state?.stateValueX?.key) ? state.stateValueX.key : [])]}
                    onChange={onChangeStateX}>
                </Cascader>
            </Form.Item>
            <Form.Item label={<>valueX <Tooltip title={"/* X/Y indicates mouseX/mouseY */ /* left/top indicates scrollLeft/scrollTop */"
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Text disabled>
                    e.g. [X] OR [X] * [delta]
                </Text>
                <TextArea placeholder="Expression" name="valueX"
                    onChange={onChangeX}
                    value={state?.valueX}
                />
            </Form.Item>
            <Form.Item label={<>KeyY <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Cascader options={states}
                    value={[state?.stateValueY?.type, ...(Array.isArray(state?.stateValueY?.key) ? state.stateValueY.key : [])]}
                    onChange={onChangeStateY}>
                </Cascader>
            </Form.Item>
            <Form.Item label={<>valueY <Tooltip title={"/* X/Y indicates mouseX/mouseY */ /* left/top indicates scrollLeft/scrollTop */"
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Text disabled>
                    e.g. [Y] OR [Y] * [delta]
                </Text>
                <TextArea placeholder="Expression" name="valueY"
                    onChange={onChangeY}
                    value={state?.valueY}
                />
            </Form.Item>
            <Divider />
            <Form.Item label="Delta">
                <Input
                    type="number"
                    placeholder="0.2"
                    name="delta"
                    value={state?.delta}
                    onChange={(e) => {
                        setState(prevState => ({ ...prevState, delta: e.target.value }));
                        setIsChange(true);
                    }}
                />
            </Form.Item>
            <Form.Item label={<>Client Type <Tooltip title={"Select 'Page' to get mouse coordinates relative to the page. Select 'Client' to get mouse coordinates relative to the client area."
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Radio.Group
                    onChange={(e) => {
                        setState(prevState => ({ ...prevState, mouseType: e.target.value }));
                        setIsChange(true);
                    }}
                    value={state?.mouseType}
                >
                    <Radio value="page">Page</Radio>
                    <Radio value="client">Client</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={<>Scroll Type <Tooltip title={"Select 'Page' for page-level scrolling. Select 'Self' for element-level scrolling."
            }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
                <Radio.Group
                    onChange={(e) => {
                        setState(prevState => ({ ...prevState, scrollType: e.target.value }));
                        setIsChange(true);
                    }}
                    value={state?.scrollType}
                >
                    <Radio value="pageScroll">Page</Radio>
                    <Radio value="selfScroll">Self</Radio>
                </Radio.Group>
            </Form.Item>
            <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
                <Button
                    style={{ margin: '10px 10px' }}
                    size="small"
                    onClick={(e) => {
                        e.preventDefault();
                        Modal.confirm({
                            title: 'Reset Event',
                            content: 'Are you sure you want to reset?',
                            onOk: () => {
                                onSubmit(state.eventType, undefined)
                                setIsChange(false);
                                setState(null);
                            },
                            onCancel: () => {
                                // Do nothing when the user cancels the confirmation
                            },
                        });
                    }}>Reset</Button>
                <Button
                    style={{ margin: '10px 0' }}
                    size="small"
                    type="primary"
                    disabled={!isChange}
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit(state.eventType, state)
                        setIsChange(false);
                    }}>Save</Button>
            </div>
        </>
    );
}
