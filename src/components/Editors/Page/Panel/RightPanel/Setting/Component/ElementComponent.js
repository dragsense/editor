
import { Form, Tooltip, Button, Divider } from "antd";
import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, } from "react";

import { StateComponent, AddStateComponent } from "./State";
import OnScrollEvent from '../Element/Event/onScroll'
import { nanoid } from "nanoid";

// Define the types of elements that can be added
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
    { value: 'classes', label: 'CLASSES' },
];

// Initial state of the component
const initialState = {
    key: '',
    defaultValue: null,
    type: TYPES[0].value,
    states: {},
    new: true
}

// Initial event of the component
const initialEvent = {
    new: true
}

// Main function of the ElementComponent
export default function ElementComponent({ component, filteredStates, onSubmit }) {

    const [state, setState] = useState(component);
    const [change, setChange] = useState(false);
    const [newState, setNewState] = useState(null);
    const [newEvent, setNewEvent] = useState(null);

    // Update the state when the component changes
    useEffect(() => {
        setState(component)
    }, [component])

    // Function to add a new state
    const onAddState = (value) => {
        if (!state.states)
            state.states = {};

        state.states[value.key] = value
        setState({ ...state })

        setChange(true)
        setNewState(null)
    }

    // Function to remove a state
    const onRemoveState = value => {
        if (state.states[value.key]) {
            delete state.states[value.key];
        }
        setState({ ...state })

        setChange(true)
    };

    // Function to add a new event
    const onAddEvent = (uid, value) => {

        if (!state.events)
            state.events = {};

        if (!value)
            delete state.events[uid]
        else
            if (value?.edit && value.uid)
                state.events[value.uid] = value;
            else {
                const uid = nanoid(3);
                state.events[uid] = { uid, ...value };
            }

        setState({ ...state })
        setNewEvent(null)

        setChange(true)
    }

    // Function to remove an event
    const onRemoveEvent = value => {
        if (state.events[value.uid]) {
            delete state.events[value.uid];
        }
        setState({ ...state })

        setChange(true)
    };

    // Function to submit the form
    const onSubmitForm = async () => {
        onSubmit(state.states, state.events);
        setChange(false)
    }

    // Render the component
    return (
        <>

            <Form layout="vertical" initialValues={{}}
                onFinish={onSubmitForm}>
                <div style={{ maxHeight: '62vh', overflow: 'auto' }}>

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

                    <Divider orientation="center"
                        orientationMargin="0">Scroll Events <Button
                            type="text"
                            onClick={() => setNewEvent({ ...initialEvent })}
                            icon={<PlusOutlined />}> </Button></Divider>
                    {newEvent ?

                        <><OnScrollEvent
                            states={filteredStates}
                            state={newEvent}
                            setState={setNewEvent}
                            onSubmit={onAddEvent}
                        />
                        </>
                        :
                        <StateComponent
                            states={state.events || {}}
                            setNewState={setNewEvent}
                            onRemove={onRemoveEvent} />}

                </div>
                <Form.Item className="text-right" style={{ marginTop: 10, textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" disabled={!change}> Save </Button>
                </Form.Item>

            </Form>
        </>

    );
};

