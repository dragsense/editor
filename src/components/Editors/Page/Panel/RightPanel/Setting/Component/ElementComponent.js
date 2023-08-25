
import { Form, Tooltip, Button, Divider } from "antd";
import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, } from "react";



import { StateComponent, AddStateComponent } from "./State";


export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'image', label: 'IMAGE' },
    { value: 'video', label: 'VIDEO' },
    { value: 'audio', label: 'AUDIO' },
    { value: 'date', label: 'DATE' },
    { value: 'time', label: 'TIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'boolean', label: 'BOOLEAN' },
];

const initialState = {
    key: '',
    defaultValue: null,
    type: TYPES[0].value,
    states: {},
    new: true
}

export default function ElementComponent({ component, onSubmit }) {

    const [state, setState] = useState(component);
    const [change, setChange] = useState(false);
    const [newState, setNewState] = useState(null);

    useEffect(() => {
        setState(component)
    }, [component])


    const onAddState = (value) => {

        if (!state.states)
            state.states = {};

        state.states[value.key] = value
        setState({ ...state })

        setChange(true)

    }

    const onRemoveState = key => {
        if (state.states[key]) {
            delete state.states[key];
        }
        setState({ ...state })

        setChange(true)

    };

    const onSubmitForm = async () => {
        onSubmit(state.states);
        setChange(false)

    }

    return (
        <>
            <Form layout="vertical" initialValues={{}}
                onFinish={onSubmitForm}>

                <Divider
                    orientation="center"
                    orientationMargin="0">
                    States <Button
                        type="text"
                        onClick={() => setNewState({ ...initialState })}
                        icon={<PlusOutlined />}> </Button>
                </Divider>


                {newState ? <AddStateComponent newState={newState} onAdd={onAddState} setNewState={setNewState} />

                    :
                    <StateComponent states={state.states || {}} setNewState={setNewState} onRemove={onRemoveState} />}



                <Form.Item className="text-right" style={{ marginTop: 10, textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" disabled={!change}> Save </Button>
                </Form.Item>

            </Form>
        </>

    );
};

