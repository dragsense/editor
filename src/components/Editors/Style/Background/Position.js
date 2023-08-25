import { Input, Slider, InputNumber, Select, Checkbox, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'
const { Option } = Select;
const units = ['px', '%', 'em', 'rem'];
const positions = ['top', 'center', 'left', 'bottom', 'right'];

export default function Size({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {



    const [lock, setLock] = useState(true);

    const [topUnit, setTopUnit] = useState(units[0]);
    const [leftUnit, setLeftUnit] = useState(units[0]);




    useEffect(() => {
        if (!properties)
            return;

        if (properties["background-position-x"]?.value === properties["background-position-y"]?.value)
            setLock(true);
        else

            setLock(false);

        setTopUnit(properties["background-position-x"]?.unit || 'px')

        setTopUnit(properties["background-position-y"]?.unit || 'px')

    }, [properties]);

    const onChangeCustom = (dataName, name, value) => {


        if (!lock) {

            let unit = '';
            if (name === 'backgroundPositionX') {
                value = value + topUnit;
                unit = topUnit;
            }
            else
                if (name === 'backgroundPositionY') {
                    value = value + leftUnit;
                    unit = leftUnit;

                }

            if (!properties[dataName])
                properties[dataName] = {};

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            style.setProperty(dataName, value, stylePriority[name]);

        }
        else {

            value = value + topUnit;


            if (!properties["background-position-x"])
                properties["background-position-x"] = {};
            properties['background-position-x'].value = value;
            properties['background-position-x'].unit = topUnit;


            if (!properties["background-position-y"])
                properties["background-position-y"] = {};
            properties['background-position-x'].value = value;
            properties['background-position-y'].unit = topUnit;


            style.setProperty('background-position-x', value, stylePriority.backgroundPositionX);
            style.setProperty('background-position-y', value, stylePriority.backgroundPositionY);

        }

        onChangeStyle();

        setStylePriority({
            ...stylePriority
        })
    }
    const onChange = (dataName, name, value) => {


        if (!lock) {

            if (!properties[dataName])
                properties[dataName] = {};

            properties[dataName].value = value;

            style.setProperty(dataName, value, stylePriority[name]);

        }
        else {
            if (!properties["background-position-x"])
                properties["background-position-x"] = {};
            properties['background-position-x'].value = value;


            if (!properties["background-position-y"])
                properties["background-position-y"] = {};
            properties['background-position-y'].value = value;

            style.setProperty('background-position-x', value, stylePriority.backgroundPositionX);
            style.setProperty('background-position-y', value, stylePriority.backgroundPositionY);

        }

        onChangeStyle();

        setStylePriority({
            ...stylePriority
        })
    }

    const onChangeTopUnit = (value) => {
        setTopUnit(value);

        const val = `${parseFloat(style.backgroundPositionX) + value}`;

        if (!lock) {
            if (!properties["background-position-x"])
                properties["background-position-x"] = {};
            properties['background-position-x'].unit = value;
            properties['background-position-x'].value = val;

            style.setProperty('background-position-x', val, stylePriority.backgroundPositionX);
        }
        else {
            if (!properties["background-position-x"])
                properties["background-position-x"] = {};
            properties['background-position-x'].unit = value;
            properties['background-position-x'].value = val;


            if (!properties["background-position-y"])
                properties["background-position-y"] = {};
            properties['background-position-y'].unit = value;
            properties['background-position-y'].value = val;


            style.setProperty('background-position-x', val, stylePriority.backgroundPositionX);
            style.setProperty('background-position-y', val, stylePriority.backgroundPositionY);

        }

        onChangeStyle();

    }

    const onChangeLeftUnit = (value) => {
        setLeftUnit(value);
        const val = `${parseFloat(style.backgroundPositionY) + value}`;
        if (!properties["background-position-y"])
            properties["background-position-y"] = {};
        properties['background-position-y'].unit = value;
        properties['background-position-y'].value = val;

        style.setProperty('background-position-y', val, stylePriority.backgroundPositionY);
        onChangeStyle();

    }

    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        const _name = e.target['data-name'];
        if (!lock) {
            if (!properties[_name])
                properties[_name] = {};
            properties[_name].priority = priority;
            setStylePriority({ ...stylePriority, [name]: priority })
            style.setProperty(_name, style[name], priority);
        } else {


            if (!properties["background-position-x"])
                properties["background-position-x"] = {};
            properties['background-position-x'].priority = priority;


            if (!properties["background-position-y"])
                properties["background-position-y"] = {};
            properties['background-position-x'].priority = priority;

            style.setProperty('background-position-x', style.backgroundPositionX, priority);
            style.setProperty('background-position-y', style.backgroundPositionY, priority);
            setStylePriority({
                ...stylePriority, backgroundPositionX: priority,
                backgroundPositionY: priority
            })

        }

        onChangeStyle();

    }



    return <>


        <div style={{ marginBottom: "10px" }}>
            <strong >{type}:    </strong>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        onChangeStyle();
                        if (properties['background-position-x'])
                            delete properties['background-position-x'];

                        if (properties['background-position-y'])
                            delete properties['background-position-y'];

                        setStylePriority({
                            ...stylePriority, backgroundPositionX: "",
                            backgroundPositionY: ""
                        })

                        style.removeProperty('background-position');
                    }}
                    className="ac-icons-btn"
                ></Button>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>
            <Button type={lock ? 'primary' : 'default'}
                onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <Select
                style={{ width: 'calc(100% - 32px)' }}
                size="small"
                value={`${style.backgroundPositionX} ${style.backgroundPositionY}`}
                onChange={(value) => {

                    onChange("background-position-x", "backgroundPositionX", value);
                }}

            >
                {positions.map((position, i) => (
                    <Option key={i} value={position}>
                        {position}
                    </Option>
                ))}
            </Select>
            <Tooltip placement='bottom' title="important">

                <Checkbox
                    style={{ marginLeft: 3 }}
                    name='backgroundPositionX'
                    data-name="background-position-x"
                    checked={stylePriority.backgroundPositionX === 'important'}
                    onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>

            <InputNumber

                size="small"
                placeholder="x"
                onChange={(value) => {
                        onChangeCustom("background-position-x", "backgroundPositionX", value)

                }}
                type='number' name="Top"
                value={parseFloat(style.backgroundPositionX)}
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

                </>
                }
            />

            <Slider
                min={0.3}
                max={72}
                step={0.1}

                value={parseFloat(style.backgroundPositionX)}
                onChange={(value) => {

                    onChangeCustom("background-position-x", "backgroundPositionX", value)
                }}
                style={{ width: '100%' }}
            />

        </div>

        {!lock && <>
            <div style={{ marginBottom: "10px" }}>
                <Select
                    style={{ width: 'calc(100% - 32px)' }}
                    size="small"
                    value={style.backgroundPositionY}
                    onChange={(value) => {
                        onChange("background-position-y", "backgroundPositionY", value);
                    }}
                >
                    {positions.map((position, i) => (
                        <Option key={i} value={position}>
                            {position}
                        </Option>
                    ))}
                </Select>
                <Tooltip placement='bottom' title="important">

                    <Checkbox
                        style={{ marginLeft: 3 }}

                        name='backgroundPositionY'
                        data-name="background-position-y"
                        checked={stylePriority.backgroundPositionY === 'important'}
                        onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <InputNumber

                    size="small"
                    placeholder="y"
                    onChange={(value) => {

                        onChangeCustom("background-position-y", "backgroundPositionY", value)
                    }}
                    type='number' name="Top"
                    value={parseFloat(style.backgroundPositionY)}
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

                    </>
                    }
                />
                <Slider
                    min={0.3}
                    max={72}
                    step={0.1}

                    value={parseFloat(style.backgroundPositionY)}
                    onChange={(value) => {

                        onChangeCustom("background-position-y", "backgroundPositionY", value)
                    }}
                    style={{ width: '100%' }}
                />
            </div></>}


    </>


}


