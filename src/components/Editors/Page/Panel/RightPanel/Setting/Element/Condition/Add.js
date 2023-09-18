import { Form, Radio, Divider, Input, Button, Cascader, Typography, Tooltip } from "antd";
import { useState, useCallback, useEffect } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function AddCondition({ current, setCurrent, onAdd, states }) {

    // Initialize state
    const [newState, setNewState] = useState(current);

    // Initialize form
    const [form] = Form.useForm();

    // Function to handle value changes
    const onChangeValue = useCallback((event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        // Update state
        setNewState(prevState => ({ ...prevState, [name]: value }));
        form.setFieldsValue({[name]: value});
    }, []);

    // Function to handle key changes
    const onChangekey = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined)
            setNewState(prevState => ({ ...prevState, value: [], type: undefined }));
        else {
            const value = [...keys];
            const first = value.shift();
            setNewState(prevState => ({ ...prevState, key: value, type: first }));
        }
    }, []);

    // Function to handle state changes
    const onChangeState = useCallback((keys) => {
        if (keys === undefined || keys[0] === undefined)
            setNewState(prevState => ({ ...prevState, valueState: undefined }));
        else {
            const value = [...keys];
            const first = value.shift();
            setNewState(prevState => ({ ...prevState, valueState: { key: value, type: first } }));
        }
    }, []);

    // Function to handle relation changes
    const onChangeRelation = useCallback((e) => {
        setNewState(prevState => ({ ...prevState, relation: e.target.value }));
    }, []);

    // Function to handle form submission
    const onSubmit = useCallback((values) => {
        onAdd({ ...newState, name: values.name, value: values.value });
    }, [newState]);

    // Disable submit button if no input change
    const isSubmitDisabled = !newState.key;

    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set Condition: </Divider>

            <Form
                layout="vertical"
                initialValues={newState}
                form={form}
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Name"
                    className="font-500"
                    name="name"
                    rules={[{ required: true, message: "Please enter a name" }]}
                >
                    <Text disabled>
                        Some descriptive name.
                    </Text>
                    <Input
                        name="name"
                        maxLength={100}
                        placeholder="Name"
                        onChange={onChangeValue}
                        value={newState.name}
                    />
                </Form.Item>

                <Form.Item label={<>* Key <Tooltip title={"Select the state key that needs to be compared."
                }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} className="font-500"
                >

                    <Cascader options={states}
                        placeholder="Select Key"
                        value={[newState.type, ...(Array.isArray(newState.key) ? newState.key : [])]}
                        onChange={onChangekey} style={{ width: '100%' }}>
                    </Cascader>
                </Form.Item>

                <Form.Item label={<>Relation  <Tooltip title={" Realtion with other condtions."
                }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip></>} className="font-500">

                    <Radio.Group value={newState.relation} onChange={onChangeRelation}>
                        <Radio value="AND">AND</Radio>
                        <Radio value="OR">OR</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label={<>State <Tooltip title={"Select the state whose value can be used in the expression."
                }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} className="font-500">
                    <Text disabled>
                        Optional
                    </Text>
                    <Cascader
                        options={states}
                        onChange={onChangeState}
                        value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]}
                        placeholder="Select Value"
                        expandTrigger="click"
                        style={{ marginBottom: 10, width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label={<>Condition</>} className="font-500" name="value"
                    rules={[{ required: true, message: "Please enter a condition" }]}

                >
                    <Text disabled>
                        e.g [state] === true
                    </Text>
                    <Input placeholder="Condition"
                        maxLength={200}
                        name="value"
                        onChange={onChangeValue}
                        value={newState.value}

                    />
                </Form.Item>

                <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
                    <Button type="default" size="small" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" size="small" disabled={isSubmitDisabled} onClick={(e) => {
                        e.preventDefault();
                        form.submit();
                    }}>
                        {current?.key ? 'Update Cond' : 'Add Cond'}
                    </Button>
                </div>
            </Form>
        </>

    );
};

