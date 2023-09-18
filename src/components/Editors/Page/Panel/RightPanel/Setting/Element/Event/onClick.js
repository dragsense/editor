import { QuestionCircleOutlined } from "@ant-design/icons";
import { Cascader, Button, Form, Input, Typography, Modal, Tooltip } from "antd";
import { useState, useCallback } from "react";

const { TextArea } = Input;
const { Text } = Typography;

// Main function for handling onClick event
export default function OnClickEvent({
    states,
    state, setState,
    onSubmit }) {

    // State to track if there is any change
    const [isChange, setIsChange] = useState(false);

    // Function to handle change in input
    const onChange = useCallback((event) => {
        event.preventDefault();
        const value = event.target.value;
        setState(prevState => ({ ...prevState, value }));

        setIsChange(true);
    }, [setState]);

    // Function to handle change in state
    const onChangeState = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined) {
            setState(prevState => ({ ...prevState, type: undefined, key: [] }));
        } else {
            const value = [...keys];
            value.shift();
            setState(prevState => ({ ...prevState, type: keys[0], key: value }));
        }

        setIsChange(true);
    }, [setState]);

    // Function to handle change with key state
    const onChangeWithKeyState = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined) {
            setState(prevState => ({ ...prevState, withtype: undefined, withkey: [] }));
        } else {
            const value = [...keys];
            value.shift();
            setState(prevState => ({ ...prevState, withtype: keys[0], withkey: value }));
        }

        setIsChange(true);
    }, [setState]);

    // Function to handle reset event
    const handleReset = useCallback((e) => {
        e.preventDefault(); 

        Modal.confirm({
            title: 'Reset Event',
            content: 'Are you sure you want to reset?',
            onOk: () => {
                onSubmit(state.eventType, undefined);
                setIsChange(false);
                setState(null);
            },
            onCancel: () => {
                // Do nothing when the user cancels the confirmation
            },
        });
    }, [state, onSubmit, setState]);

    // Function to handle save event
    const handleSave = useCallback((e) => {
        e.preventDefault();
        onSubmit(state.eventType,state);
        setIsChange(false);
    }, [state, onSubmit]);

    return <>
        <Form.Item label={<>* Key <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Cascader options={states}
                value={[state?.type, ...(Array.isArray(state?.key) ? state.key : [])]}
                onChange={onChangeState}>
            </Cascader>
        </Form.Item>
        <Form.Item label={<>With Key <Tooltip title={"Select the state key that can be used as an additional value in the expression."
        }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Cascader options={states}
                value={[state?.withtype, ...(Array.isArray(state?.withkey) ? state.withkey : [])]}
                onChange={onChangeWithKeyState}>
            </Cascader>
        </Form.Item>
        <Form.Item label="value" className="font-500">
            <Text disabled>
                e.g [key] + 1 OR ![key] OR [withkey]
            </Text>
            <TextArea placeholder="Expression" name="value"
                onChange={onChange}
                value={state?.value}
            />
        </Form.Item>
        <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
            <Button
                style={{ margin: '10px 10px' }}
                size="small"
                onClick={handleReset}>Reset</Button>
            <Button
                style={{ margin: '10px 0' }}
                size="small"
                type="primary"
                disabled={!isChange}
                onClick={handleSave}>Save</Button>
        </div>
    </>
};
