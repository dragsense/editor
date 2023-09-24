
import { useEffect, useState } from "react";
import { Button, Select, Form } from "antd";
import OnChangEvent from './onChange';
import OnClickEvent from './onClick';
import OnMoveEvent from "./onMove";
import OnScrollEvent from "./onScroll";
const { Option } = Select;


export default function ElementEvent({ cascaderStates, state, setState, setIsChange }) {



    const [states, setStates] = useState([]);
    const [newState, setNewState] = useState(null);

    useEffect(() => {

        if (!cascaderStates)
            return;

        setStates(cascaderStates);


    }, [cascaderStates]);

    useEffect(() => {

            setNewState(null);

    }, [state]);

    const onChangeType = (v) => {
        if (!v) {
            setNewState(null)
            return;
        }

        setNewState({ eventType: v, ...(state[v] ? state[v] : {}) })
    }

    const onSubmit = (eventType, newState) => {

        setState({ ...state, [eventType]: newState });
        setIsChange(true);

    }



    return <Form layout="vertical">


        <Select style={{ width: '100%', marginBottom: 10 }}
            onChange={onChangeType} value={newState?.eventType || ""}>
            <Option value="">Please Select Event Type</Option>
            <Option value="onChange">OnChange</Option>
            <Option value="onClick">OnClick</Option>
            <Option value="onMouseEnter">OnMouseEnter</Option>
            <Option value="onMouseExit">OnMouseExit</Option>
            <Option value="onMouseMove">OnMouseMove</Option>
            <Option value="onScroll">OnScroll</Option>

        </Select>

        {newState && (<> {newState.eventType === "onChange" ?

            <OnChangEvent states={states}
                onSubmit={onSubmit}

                state={newState}
                setState={setNewState}
            />



            : newState.eventType === "onClick" ||
                newState.eventType === "onMouseEnter" ||
                newState.eventType === "onMouseExit"

                ?

                <OnClickEvent states={states}

                    state={newState}
                    setState={setNewState}
                    onSubmit={onSubmit}
                /> : newState.eventType === "onMouseMove" ? <OnMoveEvent states={states}

                    state={newState}
                    setState={setNewState}
                    onSubmit={onSubmit}
                />


                    : newState.eventType === "onScroll" ?
                        <OnScrollEvent states={states}

                            state={newState}
                            setState={setNewState}
                            onSubmit={onSubmit}
                        /> : <></>}


        </>)}

        {/* 
        {eventType == 1 ? <>
            <Form.Item label="Key" className="font-500">
                <Cascader options={states}
                    value={[state.onChange?.type, ...(Array.isArray(state.onChange?.key) ? state.onChange.key : [])]}
                    onChange={onChangeOnChangeKey}>
                </Cascader>
            </Form.Item>

            <Input placeholder="Expression" name="value"
                onChange={onChangeOnChangeValue}
                value={state.onChange?.value}
            />
        </>

            :

            <>


                <Form.Item label="Key" className="font-500">
                    <Cascader options={states}
                        value={[state.onClick?.type, ...(Array.isArray(state.onClick?.key) ? state.onClick.key : [])]}

                        onChange={onChangeOnClickKey}>
                    </Cascader>


                </Form.Item>


                <Form.Item label="With Key" className="font-500">
                    <Cascader options={states}
                        value={[state.onClick?.withtype, ...(Array.isArray(state.onClick?.withkey) ? state.onClick.withkey : [])]}
                        onChange={onChangeOnClickWithKey}>
                    </Cascader>
                </Form.Item>


                <Form.Item label="Value" className="font-500">
                    <Cascader
                        options={states}
                        onChange={onChangeState}
                        value={[state.onClick?.statetype, ...(Array.isArray(state.onClick?.statekey) ? state.onClick?.statekey : [])]}
                        placeholder="Select State"
                        expandTrigger="click"
                        style={{ marginBottom: 10, width: '100%' }}
                    />





                    <Input placeholder="Expression" name="value"
                        onChange={onChangeOnClickValue}
                        value={state.onClick?.value}
                    />
                </Form.Item>



            </>
        }

        <List
            label={"Property"}
            _attributes={properties}
            cascaderStates={states}
            state={newState}
            setState={setNewState}
            setIsChange={() => { }}

        /> */}

    </Form>
};


