import { Checkbox, Space, Select, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md'
const repeats = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'];
const { Option } = Select;

export default function Repeat({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const onChangeRepeat = (value) => {

        if (!properties['background-repeat'])
            properties['background-repeat'] = {};

        properties['background-repeat'].value = value;
        style.setProperty('background-repeat', value, stylePriority.backgroundRepeat);
        onChangeStyle();
        setStylePriority({ ...stylePriority })

    }
    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        if (!properties['background-repeat'])
        properties['background-repeat'] = {};

    properties['background-repeat'].priority = priority;
        style.setProperty('background-repeat', style[name], priority);
        onChangeStyle();

    }


    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong >{type}:    </strong>
            <Tooltip placement='bottom' title="important">

                <Checkbox
                    style={{ marginLeft: 3 }} name='backgroundRepeat' data-name="background-repeat" checked={stylePriority.backgroundRepeat === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-repeat'])
                            delete properties['background-repeat'];
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, backgroundRepeat: "" })
                         style.removeProperty('background-repeat');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip> </div>
        <div style={{ marginBottom: "10px" }}>
            <Select
                showSearch
                placeholder="Select"
                optionFilterProp="children"
                value={style.backgroundRepeat}
                style={{ minWidth: '100%' }}
                onChange={onChangeRepeat}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {repeats.map(r => <Option value={r}>{r}</Option>)}

            </Select>


        </div>
    </>


}


