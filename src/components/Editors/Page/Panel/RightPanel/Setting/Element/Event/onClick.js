
import { Cascader, Button, Form, Input, Select, Modal } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function OnClickEvent({
    states,
    state, setState,
    onSubmit }) {


    const [isChange, setIsChange] = useState(false);

    const onChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setState({ ...state, value });

        setIsChange(true)
    }

    const onChangeState = (keys) => {


        if (keys === undefined || keys[0] === undefined) {
            setState({ ...state, type: undefined, key: [] });

        } else {
            const value = [...keys];
            value.shift();
            setState({ ...state, type: keys[0], key: value });
        }

        setIsChange(true)

    }

    const onChangeWithKeyState = (keys) => {


        if (keys === undefined || keys[0] === undefined) {

            setState({ ...state, withtype: undefined, withkey: [] });


        } else {
            const value = [...keys];
            value.shift();
            setState({ ...state, withtype: keys[0], withkey: value });

        }

        setIsChange(true);

    }

    return <>


        <Form.Item label="Key" className="font-500">
            <Cascader options={states}
                value={[state?.type, ...(Array.isArray(state?.key) ? state.key : [])]}
                onChange={onChangeState}>
            </Cascader>
        </Form.Item>

        <Form.Item label="With Key" className="font-500">
            <Cascader options={states}
                value={[state?.withtype, ...(Array.isArray(state?.withkey) ? state.withkey : [])]}
                onChange={onChangeWithKeyState}>
            </Cascader>
        </Form.Item>

        <Form.Item label="value" className="font-500">

            <TextArea placeholder="Expression" name="value"
                onChange={onChange}
                value={state?.value}
            />
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
                onSubmit(state.eventType, state)
                setIsChange(false);
            }}>Save</Button>

    </>
};


