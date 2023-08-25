import { Input, Select, Button, Slider, Checkbox, Tooltip, InputNumber } from 'antd';

import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const units = ['px', '%', 'em', 'rem'];
const { Option } = Select;

export default function Translate({ min = 0, max = 1,
    style,
    stylePriority,
    properties,
    onChangeStyle, setStylePriority }) {

    const [lock, setLock] = useState(true);

    const [xUnit, setXUnit] = useState(units[0]);
    const [yUnit, setYUnit] = useState(units[0]);
    const [zUnit, setZUnit] = useState(units[0]);

    useEffect(() => {

        if (!properties) {
            return;
        }



        let values = properties["translate"]?.value;

        values = values ? values.split(" ") : [];

        if (values[0] === values[1])
            setLock(true);
        else
            setLock(false)

            setXUnit(properties["translate"]?.xUnit || 'px')

            setYUnit(properties["translate"]?.yUnit || 'px')



    }, [properties]);



    const onChange = (value, name) => {


        const values = style.translate.split(' ');

        if (!properties['translate'])
        properties['translate'] = {};

        if (name == "translateX"){
            values[0] = value + xUnit;
            properties['translate'].xUnit = xUnit;
        }
        else if (name == "translateY") {
            values[1] = value + yUnit;
            properties['translate'].yUnit = yUnit;

        }

     

        if (!lock) {
            properties['translate'].value = values.join(' ');
            style.setProperty('translate', values.join(' '), stylePriority.translate);
        }
        else {
            properties['translate'].xUnit = xUnit;
            properties['translate'].yUnit = xUnit;

            properties['translate'].value = `${value + xUnit} ${value + xUnit}`;
            style.setProperty('translate', `${value + xUnit} ${value + xUnit}`, stylePriority.translate);

        }
        onChangeStyle();
        setStylePriority({ ...stylePriority})

    }


    const onChangeXUnit = (value) => {

        const values = style.translate.split(' ');

        values[0] = `${parseInt(values[0] || 0) + value}`;

        if (!properties['translate'])
            properties['translate'] = {};

        if (!lock) {
            properties['translate'].xUnit = value;

            properties['translate'].value = values.join(' ');
            style.setProperty('translate', values.join(' '), stylePriority.translate);
        }
        else {
            properties['translate'].xUnit = value;
            properties['translate'].yUnit = value;

            properties['translate'].value = `${values[0]} ${values[0]}`;
            style.setProperty('translate', `${values[0]} ${values[0]}`, stylePriority.translate);

        }

        setXUnit(value);
        onChangeStyle();

    }

    const onChangeYUnit = (value) => {
        const values = style.translate?.split(' ');

        if (!properties['translate'])
            properties['translate'] = {};
        values[1] = `${parseInt(values[1] || 0) + value}`;
        properties['translate'].value = values.join(' ');
        properties['translate'].yUnit = value;

        style.setProperty('translate', values.join(' '), stylePriority.translate);
        setYUnit(value);
        onChangeStyle();


    }


    const onChangeZUnit = (value) => {
        const values = style.translate?.split(' ');

        if (!properties['translate'])
            properties['translate'] = {};
        values[2] = `${parseInt(values[2] || 0) + value}`;
        properties['translate'].value = values.join(' ');

        style.setProperty('translate', values.join(' '), stylePriority.translate);
        setZUnit(value);
        onChangeStyle();

    }





    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';

        if (!properties['translate'])
            properties['translate'] = {};
        properties['translate'].priority = priority;

        setStylePriority({ ...stylePriority, translate: priority })
        style.setProperty('translate', style.translate, priority);
        onChangeStyle();

    }

    return <>

        <div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Translate: </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.translate === 'important'} onChange={onChangePriority}>i</Checkbox>

                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            if (properties["translate"])
                                delete properties["translate"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "translate": "" })
                                                        style.removeProperty('translate');
                        }}
                    />
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <Button
                    type={lock ? 'primary' : 'default'}
                    onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <InputNumber
                    name="translateX"
                    size="small"
                    placeholder="translateX"
                    value={parseFloat(style.translate?.split(' ')[0]) ?? ""}
                    onChange={(value) => onChange(value, 'translateX')}


                    addonAfter={<>
                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={xUnit}
                            onChange={(value) => onChangeXUnit(value)}
                        >
                            {units.map((unit, i) => (
                                <Option key={i} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                    </>
                    }
                />

                <Slider
                    min={min}
                    max={max}
                    onChange={(value) => onChange(value, 'translateX')}
                    value={parseFloat(style.translate?.split(' ')[0]) ?? ""}
                    step={0.1}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <InputNumber
                    name="translateY"
                    size="small"
                    placeholder="translateY"
                    value={parseFloat(style.translate?.split(' ')[1]) ?? ""}
                    onChange={(value) => onChange(value, 'translateY')}

                    addonAfter={<>
                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={yUnit}
                            onChange={(value) => onChangeYUnit(value)}
                        >
                            {units.map((unit, i) => (
                                <Option key={i} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                    </>
                    }
                />

                <Slider
                    min={min}
                    max={max}
                    onChange={(value) => onChange(value, 'translateY')}
                    value={parseFloat(style.translate?.split(' ')[1]) ?? ""}
                    step={0.1}
                />
            </div>

            {/* <div style={{ marginBottom: "10px" }}>
                <InputNumber
                    name="translateZ"
                    size="small"
                    placeholder="translateZ"
                    value={parseFloat(style.translate?.split(' ')[2]) ?? ""}
                    onChange={(value) => onChange(value, 'translateY')}

                    addonAfter={<>
                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={zUnit}
                            onChange={(value) => onChangeZUnit(value)}
                        >
                            {units.map((unit, i) => (
                                <Option key={i} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                    </>
                    }
                />
                <Slider
                    min={min}
                    max={max}
                    onChange={(value) => onChange(value, 'translateZ')}
                    value={parseFloat(style.translate?.split(' ')[2]) ?? ""}
                    step={0.1}
                />
            </div> */}
        </div> 
        </>


}


