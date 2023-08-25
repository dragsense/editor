import { Form, Radio, Divider, Input, Button, Cascader, Select, } from "antd";
import { useState, useCallback, useEffect } from "react";

export default function AddCondition({ current, setCurrent, onAdd, states }) {


    const [newState, setNewState] = useState(current);

   


    const onChangeValue = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        setNewState({ ...newState, [name]: value })
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
            onAdd({...newState, name: values.name, value: values.value});

    }


    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set Condition: </Divider>



            <Form
                layout="vertical"
                initialValues={newState}
                onFinish={onSubmit} // Use onFinish instead of onClick
            >
                <Form.Item
                    label="Name"
                    className="font-500"
                    name="name"
                    rules={[{ required: true, message: "Please enter a name" }]}
                >
                    <Input
                        placeholder="Name"
                        onChange={onChangeValue}
                        value={newState.name}
                    />
                </Form.Item>


                <Form.Item label="Key" className="font-500"
               

                >
                    <Cascader options={states}
                        placeholder="Select Key"

                        value={[newState.type, ...(Array.isArray(newState.key) ? newState.key : [])]}
                        onChange={onChangekey} style={{ width: '100%' }}>
                    </Cascader>
                </Form.Item>



                <Form.Item label="Relation" className="font-500">
                    <Radio.Group value={newState.relation} onChange={onChangeRelation}>
                        <Radio value="AND">AND</Radio>
                        <Radio value="OR">OR</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Value" className="font-500">

                    <Cascader
                        options={states}
                        onChange={onChangeState}
                        value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]}
                        placeholder="Select Value"
                        expandTrigger="click"
                        style={{ marginBottom: 10, width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Condition" className="font-500" name="value"
                    rules={[{ required: true, message: "Please enter a condition" }]}

                >

                    <Input placeholder="Condition" name="value"
                        onChange={onChangeValue}
                        value={newState.value}

                         />
                </Form.Item>





                <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
                    <Button type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" htmlType="submit" disabled={!newState.key}>
                        {current?.key ? 'Update Cond' : 'Add Cond'}
                    </Button>
                </div>
            </Form>
        </>

    );
};

