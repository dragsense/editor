import { Input, Space, Select, Checkbox, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md'

const { Option } = Select;

const clips = ['border-box', 'padding-box', 'content-box', 'text'];

export default function Clip({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {



    const onChangeClip = (value) => {
        if (!properties['background-clip'])
            properties['background-clip'] = {};

        properties['background-clip'].value = value;
        style.setProperty('background-clip', value, stylePriority.backgroundClip);
        onChangeStyle();
        setStylePriority({ ...stylePriority })

    }
    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        if (!properties['background-clip'])
            properties['background-clip'] = {};

        properties['background-clip'].priority = priority;
        style.setProperty('background-clip', style[name], priority);
        onChangeStyle();

    }



    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong >{type}:    </strong>
            <Tooltip placement='bottom' title="important">

                <Checkbox
                    style={{ marginLeft: 3 }} name='backgroundClip' data-name="background-clip" checked={stylePriority.backgroundClip === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-clip'])
                            delete properties['background-clip'];
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, backgroundClip: "" })
                        style.removeProperty('background-clip');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip>  </div>

        <div style={{ marginBottom: "10px" }}>
            <Select placeholder="Select" value={style.backgroundClip}
                onChange={onChangeClip} style={{ width: '100%' }}>
                {clips.map(c => <Option value={c}>{c}</Option>)}
            </Select>

        </div>
    </>


}


