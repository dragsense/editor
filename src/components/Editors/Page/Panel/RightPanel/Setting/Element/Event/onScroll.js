import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Cascader, Divider, Form, Input, Modal, Typography, Select, Tooltip } from "antd";
import { useState, useCallback } from "react";

const { TextArea } = Input;
const { Text } = Typography;

// Main function for handling onScroll event
export default function OnScrollEvent({
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
        let newState = { ...state };
        if (keys === undefined || keys[0] === undefined) {
            newState.stateValueX = { type: undefined, key: [] };
        } else {
            const value = [...keys];
            value.shift();
            newState.stateValueX = { type: keys[0], key: value };
        }
        setState(newState);
        setIsChange(true);
    }, [setState, state]);

    // Function to handle change in input for Y value
    const onChangeY = useCallback((event) => {
        event.preventDefault();
        const valueY = event.target.value;
        setState(prevState => ({ ...prevState, valueY }));
        setIsChange(true);
    }, [setState]);

    // Function to handle change in state for Y value
    const onChangeStateY = useCallback((keys) => {
        let newState = { ...state };
        if (keys === undefined || keys[0] === undefined) {
            newState.stateValueY = { type: undefined, key: [] };
        } else {
            const value = [...keys];
            value.shift();
            newState.stateValueY = { type: keys[0], key: value };
        }
        setState(newState);
        setIsChange(true);
    }, [setState, state]);

    // Render the form
    return <>
        <Form.Item label={<>KeyLeft <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Cascader options={states}
                value={[state?.stateValueX?.type, ...(Array.isArray(state?.stateValueX?.key) ? state.stateValueX.key : [])]}
                onChange={onChangeStateX}>
            </Cascader>
        </Form.Item>
        <Form.Item label={<>valueX <Tooltip title={"/* left/top indicates scrollLeft/scrollTop */"
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Text disabled>
                e.g. [left] OR [left] * [delta]
            </Text>
            <TextArea placeholder="Expression" name="valueX"
                onChange={onChangeX}
                value={state?.valueX}
            />
        </Form.Item>
        <Form.Item label={<>KeyTop <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Cascader options={states}
                value={[state?.stateValueY?.type, ...(Array.isArray(state?.stateValueY?.key) ? state.stateValueY.key : [])]}
                onChange={onChangeStateY}>
            </Cascader>
        </Form.Item>
        <Form.Item label={<>valueY <Tooltip title={"/* left/top indicates scrollLeft/scrollTop */"
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Text disabled>
                e.g. [top] OR [top] * [delta]
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
                name="delta"
                placeholder="0.2"
                value={state?.delta}
                onChange={(e) => {
                    setState(prevState => ({ ...prevState, delta: e.target.value }));
                    setIsChange(true);
                }}
            />
        </Form.Item>
        <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
            <Button
                style={{ margin: '10px 10px' }}
                size="small"
                onClick={(e) => {
                    e.preventDefault();
                    Modal.confirm({
                        title: 'Reset Event',
                        content: 'Are you sure you want to reset this event?',
                        onOk: () => {
                            onSubmit(state.eventType || state.uid, undefined)
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
                    onSubmit(state.eventType || state.uid, state)
                    setIsChange(false);
                }}>Save</Button>
        </div>
    </>
};
