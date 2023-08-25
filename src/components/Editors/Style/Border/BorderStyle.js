import { Checkbox, Space, Select, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const { Option } = Select;

const styles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'];

export default function BorderStyle({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {



    const [lock, setLock] = useState(true);


    useEffect(() => {

        if (!properties)
            return;


        if (properties['border-top-style']?.value == properties['border-right-style']?.value &&
            properties['border-right-style']?.value == properties['border-bottom-style']?.value &&
            properties['border-bottom-style']?.value == properties['border-left-style']?.value
        )
            setLock(true);
        else
            setLock(false)
    }, [properties]);




    const onChangeTop = (value) => {


        if (!lock) {

            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].value = value;

            style.setProperty('border-top-style', value, stylePriority.borderTopStyle);
        }
        else {
            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].value = value;

            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].value = value;

            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].value = value;

            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].value = value


            style.setProperty('border-top-style', value, stylePriority.borderTopStyle);
            style.setProperty('border-right-style', value, stylePriority.borderRightStyle);
            style.setProperty('border-bottom-style', value, stylePriority.borderBottomStyle);
            style.setProperty('border-left-style', value, stylePriority.borderLeftStyle);
        }

        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }


    const onChangeRight = (value) => {


        if (!lock) {
            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].value = value;
            style.setProperty('border-right-style', value, stylePriority.borderRightStyle);
        }
        else {
            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].value = value;

            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].value = value;

            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].value = value;

            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].value = value
            
            style.setProperty('border-top-style', value, stylePriority.borderTopStyle);
            style.setProperty('border-right-style', value, stylePriority.borderRightStyle);
            style.setProperty('border-bottom-style', value, stylePriority.borderBottomStyle);
            style.setProperty('border-left-style', value, stylePriority.borderLeftStyle);
        }
        setStylePriority({ ...stylePriority });

        onChangeStyle();
    }

    const onChangeBottom = (value) => {


        if (!lock) {
            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].value = value;
            style.setProperty('border-bottom-style', value, stylePriority.borderBottomStyle);
        }
        else {
            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].value = value;

            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].value = value;

            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].value = value;

            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].value = value


            style.setProperty('border-top-style', value, stylePriority.borderTopStyle);
            style.setProperty('border-right-style', value, stylePriority.borderRightStyle);
            style.setProperty('border-bottom-style', value, stylePriority.borderBottomStyle);
            style.setProperty('border-left-style', value, stylePriority.borderLeftStyle);
        }
        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }

    const onChangeLeft = (value) => {


        if (!lock) {
            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].value = value
            style.setProperty('border-left-style', value, stylePriority.borderLeftStyle);
        }
        else {
            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].value = value;

            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].value = value;

            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].value = value;

            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].value = value

            style.setProperty('border-top-style', value, stylePriority.borderTopStyle);
            style.setProperty('border-right-style', value, stylePriority.borderRightStyle);
            style.setProperty('border-bottom-style', value, stylePriority.borderBottomStyle);
            style.setProperty('border-left-style', value, stylePriority.borderLeftStyle);
        }
        onChangeStyle();                             setStylePriority({ ...stylePriority });

    }

    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        const _name = e.target['data-name'];



        if (!lock) {
            if (!properties[_name])
                properties[_name] = {}

            properties[_name].priority = priority;


            setStylePriority({ ...stylePriority, [name]: priority })
            style.setProperty(_name, style[name], priority);
        } else {
            if (!properties['border-top-style'])
                properties['border-top-style'] = {}
            properties['border-top-style'].priority = priority;

            if (!properties['border-right-style'])
                properties['border-right-style'] = {}
            properties['border-right-style'].priority = priority;

            if (!properties['border-bottom-style'])
                properties['border-bottom-style'] = {}
            properties['border-bottom-style'].priority = priority;

            if (!properties['border-left-style'])
                properties['border-left-style'] = {}
            properties['border-left-style'].priority = priority

            style.setProperty('border-top-style', style.borderTopStyle, priority);
            style.setProperty('border-right-style', style.borderRightStyle, priority);
            style.setProperty('border-bottom-style', style.borderBottomStyle, priority);
            style.setProperty('border-left-style', style.borderLeftStyle, priority);

            setStylePriority({
                ...stylePriority,
                borderTopStyle: priority,
                borderRightStyle: priority,
                borderBottomStyle: priority,
                borderLeftStyle: priority,
            })
        }

        onChangeStyle();

    }


    return <>
        <div style={{ marginBottom: "10px" }}>

            <strong>{type}:  </strong>

            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        

                        onChangeStyle();

                        if (properties["border-top-style"])
                            delete properties["border-top-style"];

                        if (properties["border-left-style"])
                            delete properties["border-left-style"];

                        if (properties["border-bottom-style"])
                            delete properties["border-bottom-style"];

                        if (properties["border-right-style"])
                            delete properties["border-right-style"];

                     
                        style.removeProperty('border-style');

                        setStylePriority({
                            ...stylePriority, borderTopStyle: '',
                            borderRightStyle: '', borderBottomStyle: '',
                            borderLeftStyle: ''
                        })


                    }}
                ></Button>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>

            <Button type={lock ? 'primary' : 'default'}
                onClick={(e) => { e.preventDefault(); setLock(!lock) }}>
                {lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
        </div>
        <div style={{ marginBottom: "10px" }}>

            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.borderTopStyle}
                style={{ width: 'calc(100% - 32px)' }}
                onChange={onChangeTop}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {styles.map(s => <Option value={s}>{s}</Option>)}

            </Select>

            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ margin: '0 3px' }} name='borderTopStyle' data-name="border-top-style" checked={stylePriority.borderTopStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>
        {!lock && <div style={{ marginBottom: "10px" }}>

            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.borderRightStyle}
                style={{ width: 'calc(100% - 32px)' }}
                onChange={onChangeRight}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {styles.map(s => <Option value={s}>{s}</Option>)}

            </Select>
            <Tooltip placement='bottom' title="important">

                <Checkbox style={{ margin: '0 3px' }} name='borderRightStyle' data-name="border-right-style" checked={stylePriority.borderRightStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>}

        {!lock && <div style={{ marginBottom: "10px" }}>
            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.borderBottomStyle}
                style={{ width: 'calc(100% - 32px)' }}
                onChange={onChangeBottom}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {styles.map(s => <Option value={s}>{s}</Option>)}

            </Select>
            <Tooltip placement='bottom' title="important">

                <Checkbox style={{ margin: '0 3px' }} name='borderBottomStyle' data-name="border-bottom-style" checked={stylePriority.borderBottomStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>}
        {!lock && <div style={{ marginBottom: "10px" }}>

            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.borderLeftStyle}
                style={{ width: 'calc(100% - 32px)' }}
                onChange={onChangeLeft}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {styles.map(s => <Option value={s}>{s}</Option>)}

            </Select>
            <Tooltip placement='bottom' title="important">

                <Checkbox style={{ margin: '0 3px' }} name='borderLeftStyle' data-name="border-left-style" checked={stylePriority.borderLeftStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>}
    </>


}


