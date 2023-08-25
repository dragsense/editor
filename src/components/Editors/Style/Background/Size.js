import { SaveOutlined } from '@ant-design/icons';
import { Checkbox, Input, Select, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { MdRestartAlt } from 'react-icons/md';
const { TextArea } = Input;
const sizes = ['auto', 'contain', 'cover'];

const { Option } = Select;

export default function Size({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const [size, setSize] = useState('');


    const onChangeSize = (value) => {
        if (!properties['background-size'])
            properties['background-size'] = {};

        properties['background-size'].value = value;
        style.setProperty('background-size', value, stylePriority.backgroundSize);
        onChangeStyle();
        setStylePriority({ ...stylePriority })

    }

    const onChangeCustomSize = (value) => {
        setSize(value);
    }

    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        if (!properties['background-size'])
            properties['background-size'] = {};

        properties['background-size'].priority = priority;
        setStylePriority({ ...stylePriority, [name]: priority })
        style.setProperty('background-size', style[name], priority);
        onChangeStyle();

    }

    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong>{type}:  </strong>
            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    name='backgroundSize' data-name="background-size"
                    checked={stylePriority.backgroundSize === 'important'}
                    onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-size'])
                            delete properties['background-size'];
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, backgroundSize: "" })

                        style.removeProperty('background-size');
                    }}
                    className="ac-icons-btn"
                ></Button>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>

            <Select placeholder="Select Size" value={style.backgroundSize}
                onChange={onChangeSize} style={{ width: '100%' }}>
                {sizes.map(s => <Option value={s}>{s}</Option>)}
            </Select>
        </div>
        <div style={{ marginBottom: "10px", display: 'flex', alignItems: 'center' }}>

            <TextArea style={{ marginRight: "5px" }} rows={1} value={size} placeholder={"100% 100%"}
                onChange={(e) => { e.preventDefault(); onChangeCustomSize(e.target.value) }} />
            <Button icon={<SaveOutlined size="1.5rem" />}
                onClick={() => onChangeSize(size)} />
        </div>


    </>


}


