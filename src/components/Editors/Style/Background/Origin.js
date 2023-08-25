import { Checkbox, Space, Select, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { MdRestartAlt } from 'react-icons/md'

const origins = ['border-box', 'padding-box', 'content-box'];


const { Option } = Select;


export default function Origin({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const onChangeOrigin = (value) => {


        if (!properties['background-origin'])
            properties['background-origin'] = {};

        properties['background-origin'].value = value;

        style.setProperty('background-origin', value, stylePriority.backgroundOrigin);
        onChangeStyle();
        setStylePriority({ ...stylePriority })

    }
    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        if (!properties['background-origin'])
        properties['background-origin'] = {};

    properties['background-origin'].priority = priority;
        style.setProperty('background-origin', style[name], priority);
        onChangeStyle();

    }


    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong >{type}:    </strong>
            <Tooltip placement='bottom' title="important">

                <Checkbox
                    style={{ marginLeft: 3 }}
                    name='backgroundOrigin' data-name="background-origin" checked={stylePriority.backgroundOrigin === 'important'} onChange={onChangePriority}>i</Checkbox>

            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-origin'])
                            delete properties['background-origin'];
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, backgroundOrigin: "" })

                        style.removeProperty('background-origin');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip> </div>

        <div style={{ marginBottom: "10px" }}>
            <Select placeholder="Select" value={style.backgroundOrigin}
                onChange={onChangeOrigin} style={{ width: '100%' }}>
                {origins.map(o => <Option value={o}>{o}</Option>)}
            </Select>

        </div>
    </>


}


