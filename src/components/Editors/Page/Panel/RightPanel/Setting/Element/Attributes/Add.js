import { Form, Input, Button, Select, Divider, Typography, Checkbox, Cascader, Tooltip, } from "antd";
import { useEffect, useState } from "react";
import PageServices from "../../../../../../../../lib/services/pages";
import ElementCondition from "../Condition";
import properties from './properties.json'
import List from "./List";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Initial condition object
const initialCondtion = {
    cKey: '', key: null, value: '', type: ''
}
const { Option } = Select;

// Main function for adding attributes
export default function AddAttribute({
    isCondtions = true,
    current,
    attributes,
    label,
    setCurrent,
    onAdd,
    states }) {

    // State for new attribute
    const [newState, setNewState] = useState(current);

    // Function to handle value changes
    const onChangeValue = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        setNewState({ ...newState, [name]: value })
    }

    // Function to handle key changes
    const onChangeKey = (value) => {
        setNewState({ ...newState, key: value.trim() })
    }

    // Function to handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        await onAdd(newState);
    }

    // Function to handle state changes
    const onChangeState = (keys) => {
        if (keys === undefined || keys[0] === undefined)
            setNewState({ ...newState, valueState: undefined })
        else {
            const value = [...keys];
            value.shift()
            setNewState({ ...newState, valueState: { key: value, type: keys[0] } })
        }
    }

    // Check if input has changed to enable/disable button
    const isInputChanged = () => {
        return newState.key && newState.name;
    }

    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set {label}: </Divider>
            {isCondtions && <ElementCondition setIsChange={() => { }} cascaderStates={states} state={newState} setState={setNewState} />}
            <Divider orientation="left" orientationMargin="0"></Divider>
            <Form layout="vertical" initialValues={newState}>
                <Form.Item label="Name" className="font-500" name="name" rules={[{ required: true, message: "Please enter a name" }]}>
                    <Text disabled>Some descriptive name.</Text>
                    <Input placeholder="Name" name="name" maxLength={100} onChange={onChangeValue} value={newState.name} required />
                </Form.Item>
                <Form.Item label={label} className="font-500">
                    <Select onChange={onChangeKey} value={newState.key} showSearch style={{ width: '100%' }} placeholder={`Select ${label}`}>
                        <Option value="">None</Option>
                        {attributes.map(val => <Option value={val}>{val}</Option>)}
                    </Select>
                </Form.Item>
                {newState.key === 'style' ?
                    <List label={"Property"} _attributes={properties} cascaderStates={states} state={newState} setState={setNewState} setIsChange={() => { }} />
                    :
                    <Form.Item label={<>State <Tooltip title={"Select the state whose value can be used in the value."}><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip></>} className="font-500">
                        <Text disabled>Optional</Text>
                        <Cascader options={states} onChange={onChangeState} value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]} placeholder="Select State" style={{ marginBottom: 10, width: '100%' }} />
                        <Text disabled>e.g 'heading-[state]' OR '#e0e0e0'</Text>
                        <Input placeholder="Value" name="value" maxLength={200} onChange={onChangeValue} value={newState.value} />
                    </Form.Item>}
                <div style={{ width: '100%', textAlign: 'end', marginTop: 10 }}>
                    <Button size="small" type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" size="small" onClick={onSubmit} disabled={!isInputChanged()}>
                        {current?.key ? `Update ${label}` : `Add ${label}`}
                    </Button>
                </div>
            </Form>
        </>
    );
};
