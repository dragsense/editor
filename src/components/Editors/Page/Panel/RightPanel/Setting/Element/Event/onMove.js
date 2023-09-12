
import { Cascader, Divider, Form, Input, Radio, Button, Modal } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function OnMoveEvent({
    states,
    state, setState,
    onSubmit}) {


        const [isChange, setIsChange] = useState(false);


    const onChangeX = (event) => {
        event.preventDefault();
        const valueX = event.target.value;
        setState({ ...state, valueX });

        setIsChange(true)
    }

    const onChangeStateX = (keys) => {


        if (keys === undefined || keys[0] === undefined) {
            state.stateValueX = { type: undefined, key: [] }
            setState({ ...state });

        } else {
            const value = [...keys];
            value.shift();
            state.stateValueX = { type: keys[0], key: value }

            setState({ ...state });
        }

        setIsChange(true)

    }

    const onChangeY = (event) => {
        event.preventDefault();
        const valueY = event.target.value;
        setState({ ...state, valueY });

        setIsChange(true)
    }

    const onChangeStateY = (keys) => {


        if (keys === undefined || keys[0] === undefined) {
            state.stateValueY = { type: undefined, key: [] }
            setState({ ...state });

        } else {
            const value = [...keys];
            value.shift();
            state.stateValueY = { type: keys[0], key: value }

            setState({ ...state });
        }

        setIsChange(true)

    }




    return <>


        <Form.Item label="KeyX" className="font-500">
            <Cascader options={states}
                value={[state?.stateValueX?.type, ...(Array.isArray(state?.stateValueX?.key) ? state.stateValueX.key : [])]}
                onChange={onChangeStateX}>
            </Cascader>
        </Form.Item>
        <Form.Item label="valueX" className="font-500">

            <TextArea placeholder="Expression" name="valueX"
                onChange={onChangeX}
                value={state?.valueX}
            />
        </Form.Item>
        <Form.Item label="KeyY" className="font-500">
            <Cascader options={states}
                value={[state?.stateValueY?.type, ...(Array.isArray(state?.stateValueY?.key) ? state.stateValueY.key : [])]}
                onChange={onChangeStateY}>
            </Cascader>
        </Form.Item>

        <Form.Item label="valueY" className="font-500">

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
                value={state?.delta}
                onChange={(e) => {
                    setState({ ...state, delta: e.target.value });
                    setIsChange(true)

               }}
            />
        </Form.Item>

        <Form.Item label="Client Type">
            <Radio.Group
                onChange={(e) => {
                    setState({ ...state, mouseType: e.target.value });
                    setIsChange(true)

                }}
                value={state?.mouseType}
            >
                <Radio value="page">Page</Radio>
                <Radio value="client">Client</Radio>
            </Radio.Group>
        </Form.Item>

        
        <Form.Item label="Scroll Type">
            <Radio.Group
                onChange={(e) => {
                    setState({ ...state, scrollType: e.target.value });
                    setIsChange(true)

                }}
                value={state?.scrollType}
            >
                <Radio value="pageScroll">Page</Radio>
                <Radio value="selfScroll">Self</Radio>
            </Radio.Group>
        </Form.Item>

        
        <Button
            style={{ margin: '10px 10px' }}
            size="small"
            onClick={(e) => {
                e.preventDefault(); 

                Modal.confirm({
                    title: 'Reset Event',
                    content: 'Are you sure you want to reset?',
                    onOk: () => {

                        onSubmit(state.eventType, undefined)
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
                onSubmit(state.eventType,state)
                setIsChange(false);
            }}>Save</Button>
    </>
};


