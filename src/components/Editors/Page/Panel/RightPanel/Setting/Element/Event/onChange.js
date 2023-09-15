
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Cascader, Button, Form, Input, Typography, Modal, Tooltip } from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;


export default function OnChangEvent({
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



    return <>


        <Form.Item label={<>* Key <Tooltip title={"Select the state key that needs to be changed and this key can be used in the expression."
                }><QuestionCircleOutlined style={{ marginLeft: 4 }} /></Tooltip> </>} >
            <Cascader options={states}
                value={[state?.type, ...(Array.isArray(state?.key) ? state.key : [])]}
                onChange={onChangeState}>
            </Cascader>
        </Form.Item>
        <Form.Item label="value" className="font-500">
        <Text disabled>
                        e.g '[value]' OR ![key]
                    </Text>
            <TextArea placeholder="Expression" name="value"
                onChange={onChange}
                value={state?.value}
            />
        </Form.Item>


        <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>

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
            </div>

    </>
};


