import { Input, Space, Checkbox, Slider, Button, Tooltip, InputNumber } from 'antd';

import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const units = ['px', '%', 'em', 'rem'];

export default function Rotate({ min = 0, max = 1, style, stylePriority, setStylePriority, 
    properties,
    onChangeStyle, }) {


    const onChange = (value, name) => {

        if (!properties['rotate'])
        properties['rotate'] = {};
        
        properties['rotate'].value = value + 'deg';

        style.setProperty('rotate', value + 'deg', stylePriority.rotate);

        onChangeStyle();
        setStylePriority({ ...stylePriority})

    }


    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';

        setStylePriority({ ...stylePriority, rotate: priority })

        if (!properties['rotate'])
        properties['rotate'] = {};


        properties['rotate'].priority = priority;
        style.setProperty('rotate', style.rotate, stylePriority.rotate);
        onChangeStyle();
    }


    return <div>
        <div style={{ marginBottom: "10px" }}>
            <strong>Rotate: </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    checked={stylePriority.rotate === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["rotate"])
                                delete properties["rotate"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "rotate": "" })
                                                    style.removeProperty('rotate');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px", display: 'flex' }}>


            <Slider
                style={{ width: '70%' }}

                min={min}
                max={max}
                onChange={(value) => onChange(value, 'rotate')}
                value={parseFloat(style.rotate) ?? ""}
                step={0.1}
            />


            <InputNumber type='number'
                style={{ width: '30%' }}

                name="rotate" value={parseFloat(style.rotate)}
                onChange={(value) => onChange(value, 'rotate')}


            />
        </div>


    </div>


}


