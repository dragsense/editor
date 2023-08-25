import { Input, Space, Select, Checkbox, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md'
const attachments = ['scroll', 'fixed', 'local'];

const { Option } = Select;

export default function Attachment({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const onChangeAttachment = (value) => {

        if (!properties['background-attachment'])
            properties['background-attachment'] = {};

        properties['background-attachment'].value = value;


        style.setProperty('background-attachment', value, stylePriority.backgroundAttachment);


        onChangeStyle();
        setStylePriority({ ...stylePriority })


    }
    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        if (!properties['background-attachment'])
            properties['background-attachment'] = {};

        properties['background-attachment'].priority = priority;
        style.setProperty('background-attachment', style[name], priority);
        onChangeStyle();

    }

    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong >{type}:    </strong>
            <Tooltip placement='bottom' title="important">

                <Checkbox
                    style={{ marginLeft: 3 }}
                    name='backgroundAttachment' data-name="background-attachment" checked={stylePriority.backgroundAttachment === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-attachment'])
                            delete properties['background-attachment'];
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, backgroundAttachment: "" })
                        style.removeProperty('background-attachment');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip> </div>
        <div style={{ marginBottom: "10px" }}>
            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.backgroundAttachment}
                style={{ minWidth: '100%' }}
                onChange={onChangeAttachment}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {attachments.map(r => <Option value={r}>{r}</Option>)}

            </Select>

        </div>

    </>


}


