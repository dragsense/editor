import ThemeServices from '../../../../lib/services/theme';
import { Select, Slider, InputNumber, Checkbox, message, Button, Tooltip, Space, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { CgGlobeAlt } from 'react-icons/cg';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'
const { Option } = Select;

const units = ['px', '%', 'em', 'rem'];

export default function BorderRadius({ 
    type, 
    style,
     properties, 
     onChangeStyle,
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

        if (properties['border-top-left-radius']?.value == properties['border-bottom-left-radius']?.value &&
            properties['border-bottom-left-radius']?.value == properties['border-bottom-right-radius']?.value &&
            properties['border-bottom-right-radius']?.value == properties['border-top-right-radius']?.value
        )
            setLock(true);
        else
            setLock(false)

        setTopUnit(properties['border-top-left-radius']?.unit || 'px')

        setLeftUnit(properties['border-bottom-left-radius']?.unit || 'px')

        setBottomUnit(properties['border-bottom-right-radius']?.unit || 'px')

        setRightUnit(properties['border-top-right-radius']?.unit || 'px')


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

            if (!properties['border-top-right-radius'])
                properties['border-top-right-radius'] = {}
            properties['border-top-right-radius'].value = value;
            properties['border-top-right-radius'].unit = unit;


            if (!properties['border-top-left-radius'])
                properties['border-top-left-radius'] = {}
            properties['border-top-left-radius'].value = value;
            properties['border-top-left-radius'].unit = unit;


            if (!properties['border-bottom-right-radius'])
                properties['border-bottom-right-radius'] = {}
            properties['border-bottom-right-radius'].value = value;
            properties['border-bottom-right-radius'].unit = unit;


            if (!properties['border-bottom-left-radius'])
                properties['border-bottom-left-radius'] = {}
            properties['border-bottom-left-radius'].value = value;
            properties['border-bottom-left-radius'].unit = unit;



            style.setProperty('border-top-right-radius', value, stylePriority.borderTopRightRadius);
            style.setProperty('border-top-left-radius', value, stylePriority.borderTopLeftRadius);
            style.setProperty('border-bottom-right-radius', value, stylePriority.borderBottomRightRadius);
            style.setProperty('border-bottom-left-radius', value, stylePriority.borderBottomLeftRadius);
        }
        setStylePriority({ ...stylePriority });

        onChangeStyle();


    }


    const onChangeTopUnit = (value) => {

        const val = `${parseFloat(style.borderTopLeftRadius) + value}`;

        if (!lock) {
            if (!properties['border-top-left-radius'])
                properties['border-top-left-radius'] = {}
            properties['border-top-left-radius'].unit = value;
            style.setProperty('border-top-left-radius', val, stylePriority.borderTopLeftRadius);
        }
        else {


            if (!properties['border-top-right-radius'])
                properties['border-top-right-radius'] = {}
            properties['border-top-right-radius'].unit = value;


            if (!properties['border-top-left-radius'])
                properties['border-top-left-radius'] = {}
            properties['border-top-left-radius'].unit = value;


            if (!properties['border-bottom-right-radius'])
                properties['border-bottom-right-radius'] = {}
            properties['border-bottom-right-radius'].unit = value;


            if (!properties['border-bottom-left-radius'])
                properties['border-bottom-left-radius'] = {}
            properties['border-bottom-left-radius'].unit = value;

            style.setProperty('border-top-right-radius', val, stylePriority.borderTopRightRadius);
            style.setProperty('border-top-left-radius', val, stylePriority.borderTopLeftRadius);
            style.setProperty('border-bottom-right-radius', val, stylePriority.borderBottomRightRadius);
            style.setProperty('border-bottom-left-radius', val, stylePriority.borderBottomLeftRadius);
        }
        setTopUnit(value);

        onChangeStyle();

    }

    const onChangeRightUnit = (value) => {
        const val = `${parseFloat(style.borderTopRightRadius) + value}`;

        if (!properties['border-top-right-radius'])
            properties['border-top-right-radius'] = {}
        properties['border-top-right-radius'].unit = value;
        style.setProperty('border-top-right-radius', val, stylePriority.borderTopRightRadius);

        setRightUnit(value);
        onChangeStyle();

    }



    const onChangeBottomUnit = (value) => {
        const val = `${parseFloat(style.borderBottomRightRadius) + value}`;

        if (!properties['border-bottom-right-radius'])
            properties['border-bottom-right-radius'] = {}
        properties['border-bottom-right-radius'].unit = value;
        style.setProperty('border-bottom-right-radius', val, stylePriority.borderBottomRightRadius);
        setBottomUnit(value);

        onChangeStyle();

    }

    const onChangeLeftUnit = (value) => {
        setLeftUnit(value);
        const val = `${parseFloat(style.borderBottomLeftRadius) + value}`;
        if (!properties['border-bottom-left-radius'])
            properties['border-bottom-left-radius'] = {}
        properties['border-bottom-left-radius'].unit = value;
        style.setProperty('border-bottom-left-radius', val, stylePriority.borderBottomLeftRadius);
        setLeftUnit(value);

        onChangeStyle();

    }


    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        const _name = e.target['data-name'];
        if (!lock) {

            if (!properties[_name])
                properties[_name] = { value: '' }

            properties[_name].priority = priority;

            setStylePriority({ ...stylePriority, [name]: priority })
            style.setProperty(_name, style[name], priority);
        } else {

            {
                if (!properties['border-top-right-radius'])
                    properties['border-top-right-radius'] = {}

                properties['border-top-right-radius'].priority = priority;
            }

            {
                if (!properties['border-top-left-radius'])
                    properties['border-top-left-radius'] = {}

                properties['border-top-left-radius'].priority = priority;
            }

            {
                if (!properties['border-bottom-left-radius'])
                    properties['border-bottom-left-radius'] = {}

                properties['border-bottom-left-radius'].priority = priority;
            }

            {
                if (!properties['border-bottom-right-radius'])
                    properties['border-bottom-right-radius'] = {}

                properties['border-bottom-right-radius'].priority = priority;
            }



            style.setProperty('border-top-right-radius', style.borderTopRightRadius, priority);
            style.setProperty('border-top-left-radius', style.borderTopLeftRadius, priority);
            style.setProperty('border-bottom-right-radius', style.borderBottomRightRadius, priority);
            style.setProperty('border-bottom-left-radius', style.borderBottomLeftRadius, priority);

            setStylePriority({
                ...stylePriority,
                borderTopRightRadius: priority,
                borderTopLeftRadius: priority,
                borderBottomRightRadius: priority,
                borderBottomLeftRadius: priority,
            })
        }

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


    const sizes = variables.filter((variable) => variable.type === 'size').map((v, i) => { return { variable: v.variable, label: v.name, key: i } });


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

                        if (properties['border-radius'])
                            delete properties['border-radius'];

                        if (properties['border-top-right-radius'])
                            delete properties['border-top-right-radius'];

                        if (properties['border-top-left-radius'])
                            delete properties['border-top-left-radius'];


                        if (properties['border-bottom-left-radius'])
                            delete properties['border-bottom-left-radius'];


                        if (properties['border-bottom-right-radius'])
                            delete properties['border-bottom-right-radius'];

                        setStylePriority({
                            ...stylePriority,
                            borderTopRightRadius: "",
                            borderTopLeftRadius: "",
                            borderBottomRightRadius: "",
                            borderBottomLeftRadius: "",
                        })
                        style.removeProperty('border-radius');
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
                placeholder="top-left"
                onChange={(value) => {

                    onChange("border-top-left-radius", "borderTopLeftRadius", value + topUnit, topUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style.borderTopLeftRadius)}
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
                            name='borderTopLeftRadius'
                            data-name="border-top-left-radius"
                            checked={stylePriority.borderTopLeftRadius === 'important'}
                            onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                </>
                }
            />
            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.borderTopLeftRadius)}
                onChange={(value) => {

                    onChange("border-top-left-radius", "borderTopLeftRadius", value + topUnit, topUnit)
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
                        onChange('border-top-left-radius', 'borderTopLeftRadius', value, topUnit)
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
        {
            !lock && <div style={{ marginBottom: "10px" }}>
                <InputNumber

                    size="small"
                    placeholder="top-right"
                    onChange={(value) => {

                        onChange("border-top-right-radius", "borderTopRightRadius", value + rightUnit, rightUnit)
                    }}
                    type='number' name="Top"
                    value={parseFloat(style.borderTopRightRadius)}
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
                                name='borderTopRightRadius'
                                data-name="border-top-right-radius"
                                checked={stylePriority.borderTopRightRadius === 'important'}
                                onChange={onChangePriority}>i</Checkbox>
                        </Tooltip>
                    </>
                    }
                />
                <Slider
                    min={0.3}
                    max={72}
                    step={0.1}

                    value={parseFloat(style.borderTopRightRadius)}
                    onChange={(value) => {

                        onChange("border-top-right-radius", "borderTopRightRadius", value + rightUnit, rightUnit)
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
                            onChange('border-top-right-radius', 'borderTopRightRadius', value, rightUnit)
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
        }

        {
            !lock && <div style={{ marginBottom: "10px" }}>
                <InputNumber

                    size="small"
                    placeholder="bottom-left"
                    onChange={(value) => {

                        onChange("border-bottom-left-radius", "borderBottomLeftRadius", value + leftUnit, leftUnit)
                    }}
                    type='number' name="Top"
                    value={parseFloat(style.borderBottomLeftRadius)}
                    addonAfter={<>
                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={leftUnit}
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
                                name='borderBottomLeftRadius'
                                data-name="border-bottom-left-radius"
                                checked={stylePriority.borderBottomLeftRadius === 'important'}
                                onChange={onChangePriority}>i</Checkbox>
                        </Tooltip>
                    </>
                    }
                />
                <Slider
                    min={0.3}
                    max={72}
                    step={0.1}

                    value={parseFloat(style.borderBottomLeftRadius)}
                    onChange={(value) => {

                        onChange("border-bottom-left-radius", "borderBottomLeftRadius", value + leftUnit, leftUnit)
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
                            onChange('border-bottom-left-radius', 'borderBottomLeftRadius', value, leftUnit)
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
        }

        {
            !lock && <div style={{ marginBottom: "10px" }}>
                <InputNumber

                    size="small"
                    placeholder="botom-right"
                    onChange={(value) => {

                        onChange("border-bottom-right-radius", "borderBottomRightRadius", value + bottomUnit, bottomUnit)
                    }}
                    type='number' name="Top"
                    value={parseFloat(style.borderBottomRightRadius)}
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
                                name='borderBottomRightRadius'
                                data-name="border-bottom-right-radius"
                                checked={stylePriority.borderBottomRightRadius === 'important'}
                                onChange={onChangePriority}>i</Checkbox>
                        </Tooltip>
                    </>
                    }
                />
                <Slider
                    min={0.3}
                    max={72}
                    step={0.1}

                    value={parseFloat(style.borderBottomRightRadius)}
                    onChange={(value) => {

                        onChange("border-bottom-right-radius", "borderBottomRightRadius", value + bottomUnit, bottomUnit)
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
                            onChange('border-bottom-right-radius', 'borderBottomRightRadius', value, bottomUnit)
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
        }
    </>


}


