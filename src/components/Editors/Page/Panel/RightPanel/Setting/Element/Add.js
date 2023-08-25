import { Form, Space, Input, Button, Select, Cascader } from "antd";
import { useEffect, useState, useMemo } from "react";
import usePageStates from "@/components/Editor/PageProvider";
import { QuestionCircleFilled, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { ConditionComponent, AddConditionComponent } from "./Condition";
import { MapComponent, AddMapComponent } from "./Map";

import { v4 as uuid } from 'uuid';
import { isEmpty } from "@/lib/utils";


import { useComponentsStates } from "@/components/Editor/PageProvider";
import { element } from "prop-types";

import AttributeComponent from "./Attributes";
import Value from "./Value";

export default function NodeStates({ currentNode }) {

    const { getCurrentComponent } = useComponentsStates();

    
    const [_state, _setState] = useState(null);
    const [_mapState, _setMapState] = useState({});
    const [_attrState, _setAttrState] = useState(null);
    const [state, setState] = useState({ childNodes: [] });
    const { modify } = usePageStates();

    const [_states, _setStates] = useState([]);
    const [_attrStates, _setAttrStates] = useState([]);

    const [states, setStates] = useState([]);

    const [isImageComponent, setImageComponent] = useState(false);





    useEffect(() => {

        
        setState(currentNode);
        _setStates(currentNode.conditions ? currentNode.conditions : []);
        _setMapState(currentNode.map ? currentNode.map : {});
        _setAttrStates(currentNode.attributes ? currentNode.attributes : []);


        if (!getCurrentComponent())
            return;

        const options = getCurrentComponent().states.map(state => {


            let children = null;

            if (state.type === 'OBJECT')
                children = state.defaultValue.map(value => { return { label: value.key, value: value.key } });
            else if (state.type === 'ARRAY OBJECT') {
                const root = state.defaultValue[0];
                const child = root.defaultValue;
                children = [{ label: root.key, value: root.key, children: child.map(value => { return { label: value.key, value: value.key } }) }];

            }
            else if (state.type === 'ARRAY')
                children = state.defaultValue.map((value, index) => { return { label: index, value: index } });
            else
                children = undefined;


            return {
                label: state.key, value: state.key, children
            }
        });



        setStates(options);


    }, []);



    const onSave = () => {


        if (getCurrentComponent()) {
            currentNode.conditions = [..._states];
            currentNode.map = { ..._mapState };
            currentNode.attributes = [..._attrStates];
            currentNode.onClick = state.onClick;
            currentNode.onChange = state.onChange;
            currentNode.onSubmit = state.onSubmit;
        }

        modify();
    }



    const onChangekey = (value) => {

        state.childNodes[0] = { ...state.childNodes[0], state: value }


        setState({ ...state })
        //setState({ ...state, key: [...state.key, ...value] })
    }

    const onChangeOnClick = (event) => {
        event.preventDefault();

        const value = event.target.value;

        setState({ ...state, onClick: { ...state.onClick, value } });
    }
    const onChangeOnClickKey = (value) => {


        state.onClick = { ...state.onClick, key: value, type: "STATES" }



        setState({ ...state })
        //setState({ ...state, key: [...state.key, ...value] })
    }
    const onChangeOnClickWithKey = (value) => {


        state.onClick = { ...state.onClick, withKey: value, type: "STATES" }

        setState({ ...state })
        //setState({ ...state, key: [...state.key, ...value] })
    }


    const onChangeOnChangeKey = (value) => {

        state.onChange = { ...state.onChange, key: value, type: "STATES" }
        setState({ ...state })
        //setState({ ...state, key: [...state.key, ...value] })
    }


    const onChangeMapkey = (value) => {



        state.childNodes[0].mapKey = { key: [value], type: "STATES" }



        setState({ ...state })
        //setState({ ...state, key: [...state.key, ...value] })
    }



    const onAddState = (state) => {


        var foundIndex = _states.findIndex(x => x.cKey === state.cKey);


        if (foundIndex !== -1)
            _states[foundIndex] = state;
        else {
            state.cKey = 'condition' + _states.length;
            _states.push(state);
            _setState({ ...state });

        }
    }


    const onAddMapState = (state) => {
        _setMapState({ ...state });

    }




    return (

        <div className="wrapper">
            <Form.Item className="text-right">
                <Button type="primary" onClick={onSave}> Save </Button>
            </Form.Item>

            <Value  currentNode={currentNode} />
                <br/>  <br/>
            <AttributeComponent currentNode={currentNode} />


            {getCurrentComponent() && <div className="inner-box border w-100p h-100p">

                <div className="wrapper">
                    <div className="inner-box">
                        <h4>Mapping <QuestionCircleFilled /></h4>

                    </div>
                    <div className="hr-line"></div>
                    <AddMapComponent _state={_mapState} onAdd={onAddMapState} _setState={_setMapState} />
                </div>
            </div>}
            {getCurrentComponent() && <div className="inner-box border w-100p h-100p">

                <div className="wrapper">
                    <div className="inner-box">
                        <h4>Conditions <QuestionCircleFilled /></h4>
                        <Button type="primary" ghost className="plus font-lg" icon={<PlusOutlined />} onClick={() => _setState({})}> </Button>
                    </div>
                    <div className="hr-line"></div>
                    {_state ? <AddConditionComponent _state={_state} onAdd={onAddState} _setState={_setState} /> :
                        <ConditionComponent states={_states} _setState={_setState} />}
                </div>
            </div>}
            {getCurrentComponent() && <div className="inner-box border w-100p h-100p">

                <div className="wrapper">
                    <div className="inner-box">
                        <h4>Events <QuestionCircleFilled /></h4>
                    </div>
                    <div className="hr-line"></div>
                    <Form layout="vertical">
                        <Space direction="vertical" className="wrapper">



                            <Form.Item label="OnClick" className="font-500">


                                <Form.Item label="Key" className="font-500">
                                    <Cascader options={states} value={state.onClick?.key} onChange={onChangeOnClickKey}>
                                    </Cascader>
                                </Form.Item>

                                <Form.Item label="With Key" className="font-500">
                                    <Cascader options={states} value={state.onClick?.withKey} onChange={onChangeOnClickWithKey}>
                                    </Cascader>
                                </Form.Item>

                                <Input placeholder="Value" name="update"
                                    onChange={onChangeOnClick}
                                    value={state.onClick?.value}
                                    required />


                            </Form.Item>
                            <Form.Item label="OnChange" className="font-500">


                                <Form.Item label="Key" className="font-500">
                                    <Cascader options={states} value={state.onChange?.key} onChange={onChangeOnChangeKey}>
                                    </Cascader>
                                </Form.Item>


                            </Form.Item>

                            <Form.Item label="OnSubmit" className="font-500">


                                <Form.Item label="Key" className="font-500">
                                    <Button options={states} onClick={() => { state.onSubmit ? state.onSubmit = undefined : state.onSubmit = true; setState({ ...state }); }}>
                                        On Submit {state.onSubmit ? 'true' : 'false'}
                                    </Button>
                                </Form.Item>


                            </Form.Item>



                        </Space>
                    </Form>
                </div>
            </div>}

        </div>


    );
};

