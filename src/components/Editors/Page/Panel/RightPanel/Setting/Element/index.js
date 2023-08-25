
import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementSetting from './Setting';
import ElementCondition from './Condition';
import ElementAttribute from './Attributes';
import ElementMapping from './Map';
import ElementEvent from './Event';
import ElementWrapping from './Wrapper';


export default function Element({ state, onChange, onUpdate, cascaderStates }) {

    const [settingState, setSettingState] = useState({ attributes: {} });
    const [settingOptionState, setSettingOptionState] = useState({ attributes: {} });


    const [isChange, setIsChange] = useState(false);

    useEffect(() => {

        if (!isChange)
            return;

        onChange(false);
    }, [isChange])

    useEffect(() => {

        if (!state.node)
            return;

        if (!state.node.attributes)
            state.node.attributes = {};

        setSettingState({ ...state.node });

        if (!state.node.childAttributes)
            state.node.childAttributes = {};

        setSettingOptionState({ attributes: state.node.childAttributes })




    }, [state.node]);


    const onElementUpdate = async () => {

        for (const key in settingState) {
            state.node[key] = settingState[key]
        }

        for (const key in settingOptionState) {
            if (key == 'attributes')
                state.node["childAttributes"] = settingOptionState[key]
            else
                state.node[key] = settingOptionState[key]
        }

        onUpdate(state.node);
        setIsChange(false);
    }


    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>



        <Card>
            <div style={{ maxHeight: '62vh', overflow: 'auto' }}>

                <ElementSetting
                    cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={settingState}
                    setState={setSettingState} />

                {/* <Divider orientation="left" orientationMargin="0">Component Wrapper: </Divider>
            <ElementWrapping setIsChange={setIsChange} state={state} setState={setState} />
*/}


                <Divider orientation="center" orientationMargin="0">Custom Attributes: </Divider>
                <ElementAttribute cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={settingState}
                    setState={setSettingState} />


                {settingState.tagName === 'select' && <>
                    <Divider orientation="center" orientationMargin="0">Options Attributes: </Divider>
                    <ElementAttribute cascaderStates={cascaderStates}
                        setIsChange={setIsChange}
                        state={settingOptionState}
                        setState={setSettingOptionState} /></>}


                <Divider orientation="center" orientationMargin="0">Events: </Divider>
                <ElementEvent cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={settingState}
                    setState={setSettingState} />
            </div>

            <Divider orientation="center" orientationMargin="0"></Divider>

            <div style={{ textAlign: 'right' }}>
                <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
            </div>
        </Card>



    </>
        : <span>Please Select the node</span>
}