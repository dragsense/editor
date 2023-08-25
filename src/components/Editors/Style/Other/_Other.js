import { Input, Checkbox, Button, Tooltip } from 'antd';
import { useState } from 'react';
import { QuestionCircleFilled, SaveOutlined } from '@ant-design/icons';
import { MdRestartAlt } from 'react-icons/md'
const { TextArea } = Input;


const types = {
    boxShadow: '/* none */\n/* offset-x | offset-y | color */ \n/* offset-x | offset-y | blur-radius | color */ \n/* offset-x | offset-y | blur-radius | spread-radius | color */ \n/* inset | offset-x | offset-y | color */',
    textShadow: '/* offset-x | offset-y */\n/* color | offset-x | offset-y */\n/* offset-x | offset-y | color */\n/* color | offset-x | offset-y | blur-radius */\n/* offset-x | offset-y | blur-radius | color */',
    transition: '/* property name | duration */\n/* property name | duration | delay */\n/* property name | duration | easing function */\n/* property name | duration | easing function | delay */',
    animation: '/* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */\n/* @keyframes duration | easing-function | delay | name */'
}

export default function _Other({
    type,
    name,
    dataName,
    style,
    properties, onChangeStyle,
    rows = 4,
    stylePriority,
    onChangePriority }) {

    const [content, setContent] = useState(false);

    const onChange = (e) => {
        const value = e.target.value;

        if (!properties[dataName])
            properties[dataName] = {};

        properties[dataName].value = value;
        setContent(!content);

    }

    const onSave = (e) => {

        e.preventDefault();

        style.setProperty(dataName, properties[dataName]?.value, stylePriority[type]);
        setContent(!content);

        onChangeStyle();

    }



    return <>
        <div style={{ marginBottom: "10px" }}>
            <strong>{type}:  </strong>
            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    name={name} data-name={dataName}
                    checked={stylePriority[name] === 'important'}
                    onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();

                        if (properties[dataName])
                            delete properties[dataName];


                            onChangeStyle();
                            onChangePriority({ target: {name, dataName, checked: false }});
                        setContent(!content);
                        style.removeProperty(dataName);
                    }}
                />
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px", display: 'flex', alignItems: 'center' }}>
            <TextArea style={{ marginRight: "5px" }} rows={rows} value={properties?.[dataName]?.value} placeholder={types[name]} onChange={onChange} />
            <Button icon={<SaveOutlined size="1.5rem" />}
             onClick={onSave} />
        </div>
    </>


}


