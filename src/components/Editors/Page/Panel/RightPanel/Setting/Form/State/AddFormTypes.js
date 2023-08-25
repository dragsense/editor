import { Form, Select, Input, Checkbox, Space } from "antd";
const { Option } = Select;
const { TextArea } = Input;


import { TYPES } from './Add';
import AddArrayTypes from "./AddArrayTypes";

export default function AddFormTypes({ onChangeState, state }) {


    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;
        state[name] = value;
        onChangeState();

    }


    const onChangeType = (value) => {
        state.type = value;

        if (value !== 'radio' || value !== 'checkbox' || value !== 'select')
            state.multiple = undefined;
        onChangeState();

    }


    const onAddArrayValue = () => {
        if (!Array.isArray(state.states))
            state.states = [];

        state.states = [...state.states, { label: '', value: '', selected: false }];
        onChangeState();
    };

    const onRemoveArrayValue = idx => {
        state.defaultValue.splice(idx, 1);
        onChangeState();

    };




    return <>

        <Form.Item label="Select Type" className="font-500">
            <Select style={{ width: 120 }} defaultValue={state.type} onChange={onChangeType}>
                {TYPES.map(type => <Option value={type.value}>{type.label}</Option>)}

            </Select>

        </Form.Item>


        {state.type !== 'checkbox' &&
            state.type !== 'radio' &&
            state.type !== 'select' ? <>


            {state.type !== 'file' && <Form.Item label="Placeholder" className="font-500">
                <Input disabled={state.type == 'file'} placeholder="placeholder" name="placeholder"
                    onChange={onChange}
                    value={state.placeholder}
                    type="text"
                    required />
            </Form.Item>}

            {state.type === 'textarea' ?
            <Form.Item label="Value" className="font-500">
                <TextArea placeholder="Value"  name="defaultValue"
                    onChange={onChange}
                    value={state.defaultValue}
                />

            </Form.Item>
             :
            <Form.Item label="Value" className="font-500">
                <Input placeholder="Value" disabled={state.type == 'file'} name="defaultValue"
                    onChange={onChange}

                    value={state.defaultValue}
                    type={state.type}
                />

            </Form.Item>}

            {state.type === 'number' && <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                <Input placeholder="Min" name="min"
                    onChange={onChange}
              
                    value={state.min}
                    type="Number"
                />
            </Form.Item> <Form.Item label="Max" className="font-500">
                    <Input placeholder="Max" name="max"
                        onChange={onChange}
                       
                        value={state.max}
                        type="Number"
                    />
                </Form.Item></Space>}

            <Form.Item label="Regex" className="font-500">
                <Input placeholder="Value" name="regex"
                    onChange={onChange}

                    value={state.regex}
                    type="text"
                />

            </Form.Item>

            <Form.Item label="Error Message" className="font-500">
                <TextArea  placeholder="Error message" name="errorMessage"
                    onChange={onChange}

                    value={state.errorMessage}
                  
                />

            </Form.Item>



        </>

            : <Form.Item>
                <AddArrayTypes
                    states={state.options}
                    onAdd={onAddArrayValue}
                    onRemove={onRemoveArrayValue}
                    onChangeState={onChangeState}

                    isMultiple={(state.multiple || state.type === 'checkbox') && state.type !== 'radio'} /></Form.Item>
        }
        <Form.Item label="isRequired?" className="font-500">
            <Checkbox
                onChange={(e) => {
                    e.preventDefault();


                    state.required = !state.required
                    onChangeState();
                }}
                checked={state.required}
            >Yes</Checkbox>
        </Form.Item>

        {state.type == 'select' && <Form.Item label="isMultiple?" className="font-500">
            <Checkbox
                onChange={(e) => {
                    e.preventDefault();
                    state.multiple = !state.multiple
                    onChangeState();

                }}
                checked={state.multiple}
            >Yes</Checkbox>
        </Form.Item>}

    </>




};

