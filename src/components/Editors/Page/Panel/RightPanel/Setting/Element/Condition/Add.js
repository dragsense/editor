import { Form, Radio, Divider, Input, Button, Cascader, Typography, Tooltip } from "antd";
import { useState, useCallback, useEffect } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function AddCondition({ current, setCurrent, onAdd, states }) {


    const [newState, setNewState] = useState(current);

    const [form] = Form.useForm();



    const onChangeValue = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        setNewState({ ...newState, [name]: value })
        form.setFieldsValue({[name]: value})
    }

    const onChangekey = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setNewState({ ...newState, value: [], type: undefined })
        else {
            const value = [...keys];

            const first = value[0];
            value.shift();
            setNewState({ ...newState, key: value, type: first })
        }
    }


    const onChangeState = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setNewState({ ...newState, valueState: undefined })
        else {
            const value = [...keys];
            const first = value[0];
            value.shift()



            setNewState({ ...newState, valueState: { key: value, type: first } })
        }
    }





    const onChangeRelation = (e) => {
        setNewState({ ...newState, relation: e.target.value });
    };

    const onSubmit = (values) => {
        onAdd({ ...newState, name: values.name, value: values.value });

    }


    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set Condition: </Divider>



            <Form
                layout="vertical"
                initialValues={newState}
                form={form} // Use onFinish instead of onClick
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
                    <Button type="primary" size="small" disabled={!newState.key} onClick={(e) => {
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

