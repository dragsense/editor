import { Form, Input, Button, Select, Divider, Popconfirm, Checkbox, Cascader, } from "antd";

import { useEffect, useState } from "react";


import PageServices from "../../../../../../../../lib/services/pages";

import ElementCondition from "../Condition";

import properties from './properties.json'
import List from "./List";


const initialCondtion = {
    cKey: '', key: null, value: '', type: ''
}
const { Option } = Select;

export default function AddAttribute({ current, attributes, label, setCurrent, onAdd, states }) {


    const [newState, setNewState] = useState(current);



    const onChangeValue = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;


        setNewState({ ...newState, [name]: value })
    }

    const onChangeKey = (value) => {

        setNewState({ ...newState, key: value.trim() })
    }

    

    const onSubmit =
        async (e) => {
            e.preventDefault();
            await onAdd(newState);

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



    return (
        <>

            <Divider orientation="left" orientationMargin="0">Set {label}: </Divider>
            <ElementCondition setIsChange={() => { }} cascaderStates={states} state={newState} setState={setNewState} />
            <Divider orientation="left" orientationMargin="0"></Divider>

            <Form
                layout="vertical"
                initialValues={newState}
            >
                <Form.Item
                    label="Name"
                    className="font-500"
                    name="name"
                    rules={[{ required: true, message: "Please enter a name" }]}
                >

                    <Input
                        placeholder="Name"
                        name="name"

                        onChange={onChangeValue}
                        value={newState.name}
                        required
                    />
                </Form.Item>

                <Form.Item label={label} className="font-500">

                    <Select onChange={onChangeKey}
                        value={newState.key}
                        showSearch
                        style={{ width: '100%' }} placeholder={`Select ${label}`}>
                        <Option value="">None</Option>
                        {attributes.map(val =>
                            <Option value={val}>
                                {val}
                            </Option>
                        )}

                    </Select>
                </Form.Item>

                {newState.key === 'style' ?

                    <List
                        label={"Property"}
                        _attributes={properties}
                        cascaderStates={states}
                        state={newState}
                        setState={setNewState}
                        setIsChange={() => { }}

                    />

                    :

                    <Form.Item label="Value" className="font-500">

                        <Cascader
                            options={states}
                            onChange={onChangeState}
                            value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]}
                            placeholder="Select State"
                            style={{ marginBottom: 10, width: '100%' }}
                        />


                        <Input placeholder="Custom Value" 
                        name="value"
                            onChange={onChangeValue}
                            value={newState.value}
                        />
                    </Form.Item>}


                <div style={{ width: '100%', textAlign: 'end', marginTop: 10 }}>
                    <Button type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" onClick={onSubmit} disabled={!newState.key || !newState.name}>
                        {current?.key ? 'Update Attr' : 'Add Attr'}
                    </Button>
                </div>


            </Form>



        </>

    );
};

