import ThemeServices from '../../../../lib/services/theme';
import { InputNumber, Slider, Select, Checkbox, message, Button, Tooltip, Space, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { CgGlobeAlt } from 'react-icons/cg';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const { Option } = Select;
const units = ['px', '%', 'em', 'rem'];

export default function BorderWidth({ type, style,
    properties, onChangeStyle,
    stylePriority, setStylePriority }) {


    const [lock, setLock] = useState(true);

    const [topUnit, setTopUnit] = useState(units[0]);
    const [leftUnit, setLeftUnit] = useState(units[0]);
    const [bottomUnit, setBottomUnit] = useState(units[0]);
    const [rightUnit, setRightUnit] = useState(units[0]);
    const [variables, setVariables] = useState([]);


    useEffect(() => {

        if (!properties)
            return;


        if (properties['border-top-width']?.value == properties['border-right-width']?.value &&
            properties['border-right-width']?.value == properties['border-bottom-width']?.value &&
            properties['border-bottom-width']?.value == properties['border-right-width']?.value
        )
            setLock(true);
        else
            setLock(false);



        setTopUnit(style['border-top-width']?.unit || 'px')

        setLeftUnit(style['border-left-width']?.unit || 'px')

        setBottomUnit(style['border-bottom-width']?.unit || 'px')

        setRightUnit(style['border-right-width']?.unit || 'px')

    }, [properties]);




    const onChange = (dataName, name, value, unit) => {




        if (!lock) {

            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;


            style.setProperty(dataName, value, stylePriority[name]);
        }
        else {

            let dataName = 'border-top-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = 'border-right-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = 'border-bottom-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = 'border-left-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            style.setProperty('border-top-width', value, stylePriority.borderTopWidth);
            style.setProperty('border-right-width', value, stylePriority.borderRightWidth);
            style.setProperty('border-bottom-width', value, stylePriority.borderBottomWidth);
            style.setProperty('border-left-width', value, stylePriority.borderLeftWidth);
        }
        setStylePriority({ ...stylePriority });

        onChangeStyle();

    }


    const onChangeTopUnit = (value) => {

        const val = `${parseFloat(style.borderTopWidth) + value}`;

        if (!lock) {
            let dataName = 'border-top-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = value;
            style.setProperty('border-top-width', val, stylePriority.borderTopWidth);
        }
        else {



            let dataName = 'border-top-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = value;

            dataName = 'border-right-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = value;

            dataName = 'border-bottom-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = value;

            dataName = 'border-left-width';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = value;


            style.setProperty('border-top-width', val, stylePriority.borderTopWidth);
            style.setProperty('border-right-width', val, stylePriority.borderRightWidth);
            style.setProperty('border-bottom-width', val, stylePriority.borderBottomWidth);
            style.setProperty('border-left-width', val, stylePriority.borderLeftWidth);
        }
        setTopUnit(value);

        onChangeStyle();

    }

    const onChangeRightUnit = (value) => {
        const val = `${parseFloat(style.borderRightWidth) + value}`;

        let dataName = 'border-right-width';
        if (!properties[dataName])
            properties[dataName] = {}

        properties[dataName].unit = value;
        style.setProperty('border-right-width', val, stylePriority.borderRightWidth);

        setRightUnit(value);

        onChangeStyle();

    }

    const load = async () => {
        try {
            const resVaraibles = await ThemeServices.getVariables();

            if (resVaraibles.variables)
            setVariables(resVaraibles.variables.data)

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {
        load();
    }, []);


    const onChangeBottomUnit = (value) => {
        const val = `${parseFloat(style.borderBottomWidth) + value}`;

        let dataName = 'border-bottom-width';
        if (!properties[dataName])
            properties[dataName] = {}

        properties[dataName].unit = value;
        style.setProperty('border-bottom-width', val, stylePriority.borderBottomWidth);
        setBottomUnit(value);

        onChangeStyle();


    }

    const onChangeLeftUnit = (value) => {
        const val = `${parseFloat(style.borderLeftWidth) + value}`;
        let dataName = 'border-left-width';
        if (!properties[dataName])
            properties[dataName] = {}

        properties[dataName].unit = value;
        style.setProperty('border-left-width', val, stylePriority.borderLeftWidth);

        setLeftUnit(value);

        onChangeStyle();

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

            {
                if (!properties['border-top-width'])
                    properties['border-top-width'] = {}

                properties['border-top-width'].priority = priority
            }
            {
                if (!properties['border-right-width'])
                    properties['border-right-width'] = {}

                properties['border-right-width'].priority = priority

            }

            {
                if (!properties['border-bottom-width'])
                    properties['border-bottom-width'] = {}

                properties['border-bottom-width'].priority = priority

            }

            {
                if (!properties['border-left-width'])
                    properties['border-left-width'] = {}

                properties['border-left-width'].priority = priority

            }

            style.setProperty('border-top-width', style.borderTopWidth, priority);
            style.setProperty('border-right-width', style.borderRightWidth, priority);
            style.setProperty('border-bottom-width', style.borderBottomWidth, priority);
            style.setProperty('border-left-width', style.borderLeftWidth, priority);

            setStylePriority({
                ...stylePriority,
                borderTopWidth: priority,
                borderRightWidth: priority,
                borderBottomWidth: priority,
                borderLeftWidth: priority,
            })

        }

        onChangeStyle();
    }

    const sizes = variables.filter((variable) => variable.type === 'size').map((v, i) => { return { variable: v.variable,label: v.name, key: i } });


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
                        if (properties["border-top-width"])
                            delete properties["border-top-width"];

                        if (properties["border-left-width"])
                            delete properties["border-left-width"];

                        if (properties["border-bottom-width"])
                            delete properties["border-bottom-width"];

                        if (properties["border-right-width"])
                            delete properties["border-right-width"];

                     
                        style.removeProperty('border-width');

                        setStylePriority({
                            ...stylePriority, borderTopWidth: '',
                            borderRightWidth: '', borderBottomWidth: '',
                            borderLeftWidth: ''
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
            <InputNumber

                size="small"
                placeholder="top"
                onChange={(value) => {

                    onChange("border-top-width", "borderTopWidth", value + topUnit, topUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style.borderTopWidth)}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={topUnit}
                        onChange={(u) => onChangeTopUnit(u)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Tooltip placement='bottom' title="important">

                        <Checkbox
                            name='borderTopWidth'
                            data-name="border-top-width"
                            checked={stylePriority.borderTopWidth === 'important'}
                            onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                </>
                }
            />
            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.borderTopWidth)}
                onChange={(value) => {

                    onChange("border-top-width", "borderTopWidth", value + topUnit, topUnit)
                }}
                style={{ width: '100%' }}
            />

            {sizes && (
                <Dropdown menu={{
                    items: sizes, onClick: ({ key }) => {
                         const variable = sizes[key]
                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                        onChange('border-top-width', 'borderTopWidth', value, topUnit)
                    }
                }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}



        </div>
        {!lock && <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="right"
                onChange={(value) => {

                    onChange("border-right-width", "borderRightWidth", value + rightUnit, rightUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style.borderRightWidth)}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={rightUnit}
                        onChange={(u) => onChangeRightUnit(u)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Tooltip placement='bottom' title="important">

                        <Checkbox
                            name='borderRightWidth'
                            data-name="border-right-width"
                            checked={stylePriority.borderRightWidth === 'important'}
                            onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                </>
                }
            />
            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.borderRightWidth)}
                onChange={(value) => {

                    onChange("border-right-width", "borderRightWidth", value + rightUnit, rightUnit)
                }}
                style={{ width: '100%' }}
            />

            {sizes && (
                <Dropdown menu={{
                    items: sizes, onClick: ({ key }) => {
                         const variable = sizes[key]
                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                        onChange('border-right-width', 'borderRightWidth', value, rightUnit)
                    }
                }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

        </div>}

        {!lock && <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="bottom"
                onChange={(value) => {

                    onChange("border-bottom-width", "borderBottomWidth", value + bottomUnit, bottomUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style.borderBottomWidth)}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={bottomUnit}
                        onChange={(u) => onChangeBottomUnit(u)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Tooltip placement='bottom' title="important">

                        <Checkbox
                            name='borderBottomWidth'
                            data-name="border-bottom-width"
                            checked={stylePriority.borderBottomWidth === 'important'}
                            onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                </>
                }
            />
            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.borderBottomWidth)}
                onChange={(value) => {

                    onChange("border-bottom-width", "borderBottomWidth", value + bottomUnit, bottomUnit)
                }}
                style={{ width: '100%' }}
            />

            {sizes && (
                <Dropdown menu={{
                    items: sizes, onClick: ({ key }) => {
                         const variable = sizes[key]
                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                        onChange('border-right-width', 'borderRightWidth', value, bottomUnit)
                    }
                }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

        </div>}

        {!lock && <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="left"
                onChange={(value) => {

                    onChange("border-left-width", "borderLeftWidth", value + leftUnit, leftUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style.borderLeftWidth)}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={topUnit}
                        onChange={(u) => onChangeLeftUnit(u)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Tooltip placement='bottom' title="important">

                        <Checkbox
                            name='borderLeftWidth'
                            data-name="border-left-width"
                            checked={stylePriority.borderLeftWidth === 'important'}
                            onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                </>
                }
            />
            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.borderLeftWidth)}
                onChange={(value) => {

                    onChange("border-left-width", "borderLeftWidth", value + leftUnit, leftUnit)
                }}
                style={{ width: '100%' }}
            />
            {sizes && (
                <Dropdown menu={{
                    items: sizes, onClick: ({ key }) => {
                         const variable = sizes[key]
                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                        onChange('border-left-width', 'borderLeftWidth', value, leftUnit)
                    }
                }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

        </div>}

    </>


}


