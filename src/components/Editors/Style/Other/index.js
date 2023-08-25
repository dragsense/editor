
import { Collapse, Space, Checkbox, Button } from 'antd';
const { Panel } = Collapse;
import { useEffect, useState } from 'react';


import { useCssNodeStates } from '../..';
import _Other from './_Other';
import { isEmpty } from '@/lib/utils';

export default function Other({ style, uStyle, setUStyle }) {



    const [stylePriority, setStylePriority] = useState({
        boxShadow: '',
        textShadow: '',
        transition: '',
        animation: '',
        cursor: '',
        textDecoration: ''
    });


    useEffect( () => {

        if (!style)
            return;


        const priorities = {};
        for (const key in stylePriority) {
            priorities[key] = style.getPropertyPriority(key);
        }

        setStylePriority(priorities);


    }, [style]);

    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        setUStyle(style, _name, style[name], stylePriority[name]);

        style.setProperty(_name, style[name], priority);
    }


    return <Space direction='vertical' style={{ width: '100%' }}>

        {!isEmpty(style) && <>

            <Collapse defaultActiveKey={['1']} accordion ghost>
                <Panel header="Transition" key="1">
                    <_Other type="transition" uStyle={uStyle} setUStyle={setUStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority} />
                    <Checkbox name='transition' data-name="transition" checked={stylePriority.transition === 'important'} onChange={onChangePriority}>important</Checkbox>

                </Panel>
                <Panel header="Shadow" key="2">
                    <_Other type="boxShadow" uStyle={uStyle} setUStyle={setUStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority} />
                    <Checkbox name='boxShadow' data-name="box-shadow" checked={stylePriority.boxShadow === 'important'} onChange={onChangePriority}>important</Checkbox>

                    <br />   <br />
                    <_Other type="textShadow" uStyle={uStyle} setUStyle={setUStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority} />
                    <Checkbox name='textShadow' data-name="text-shadow" checked={stylePriority.textShadow === 'important'} onChange={onChangePriority}>important</Checkbox>

                </Panel>

                <Panel header="Animation" key="3">
                    <_Other type="animation" uStyle={uStyle} setUStyle={setUStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority} />
                    <Checkbox name='animation' data-name="animation" checked={stylePriority.animation === 'important'} onChange={onChangePriority}>important</Checkbox>

                </Panel>

                <Panel header="Cursor" key="5">
                    <_Other rows="1" type="cursor" uStyle={uStyle} setUStyle={setUStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority} />
                    <Checkbox name='cursor' data-name="cursor" checked={stylePriority.cursor === 'important'} onChange={onChangePriority}>important</Checkbox>

                </Panel>

            </Collapse>
        </>}

    </Space>


}


