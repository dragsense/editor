import { Input, Select, Button, InputNumber, Slider, Checkbox, Tooltip } from 'antd';

import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const units = ['px', '%', 'em', 'rem'];
const { Option } = Select;


export default function Perspective({ min = 0, max = 1, style, stylePriority, 
    properties,
    onChangeStyle, 
    setUStyle,
    setStylePriority }) {


    const [lock, setLock] = useState(false);

    const [xUnit, setXUnit] = useState(units[0]);
    const [yUnit, setYUnit] = useState(units[0]);



    useEffect(() => {

        if (!properties) {
            return;
        }
     

        let values = properties["perspective"]?.value;

        values = values ? values.split(" ") : [];

        if (values[0] === values[1])
            setLock(true);
        else
            setLock(false)



            setXUnit(properties["perspective"]?.xUnit || 'px')

            setYUnit(properties["perspective"]?.yUnit || 'px')


    }, [properties]);


    const onChange = (value, name) => {


        const values = style.perspective ? style.perspective.split(' ') : [];

        if (!properties['perspective'])
        properties['perspective'] = {};

        if (name == "perspectiveX"){
            values[0] = value + xUnit;
            properties['perspective'].xUnit = xUnit;

        }
        else if (name == "perspectiveY") {
            values[1] = value + yUnit;
            properties['perspective'].yUnit = yUnit;

        }

        
        if (!lock) {
            properties['perspective'].value = values.join(' ');

            style.setProperty('perspective', values.join(' '), stylePriority.perspective);
        }
        else {

            properties['perspective'].xUnit = xUnit;
            properties['perspective'].yUnit = xUnit;
            properties['perspective'].value = `${value + xUnit} ${value + xUnit}`;

            style.setProperty('perspective', `${value + xUnit} ${value + xUnit}`, stylePriority.perspective);

        }
        onChangeStyle();
        setStylePriority({ ...stylePriority})


    }


    const onChangeXUnit = (value) => {

        const values = style.perspective.split(' ');

        values[0] = `${parseInt(values[0] || 0) + value}`;

   if (!properties['perspective'])
        properties['perspective'] = {};
        if (!lock){
            properties['perspective'].xUnit = value;

            properties['perspective'].value = values.join(' ');

            setUStyle('perspective',  values.join(' '), value);

        }
        else {
            properties['perspective'].xUnit = value;
            properties['perspective'].yUnit = value;
            properties['perspective'].value =  `${values[0]} ${values[0]}`;
            style.setProperty('perspective', `${values[0]} ${values[0]}`, stylePriority.perspective);

        }
        setXUnit(value);

        onChangeStyle();
    }

    const onChangeYUnit = (value) => {
        const values = style.perspective?.split(' ');
        if (!properties['perspective'])
        properties['perspective'] = {};
        values[1] = `${parseInt(values[1] || 0) + value}`;
        properties['perspective'].value = values.join(' ');
        properties['perspective'].yUnit = value;

        style.setProperty('perspective', values.join(' '), stylePriority.perspective);
       
        setYUnit(value);

        onChangeStyle();
    }





    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        if (!properties['perspective'])
        properties['perspective'] = {};
        properties['perspective'].priority = priority;

        setStylePriority({ ...stylePriority, perspective: priority })
        style.setProperty('perspective', style.perspective, stylePriority.perspective);
        onChangeStyle();

    }

    return <>

        <div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Perspective: </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.perspective === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            if (properties["perspective"])
                                delete properties["perspective"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "perspective": "" })
                            style.removeProperty('perspective');
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
                    name="perspectiveX"
                    size="small"
                    placeholder="perspectiveX"
                    value={parseFloat(style.perspective?.split(' ')[0]) ?? ""}
                    onChange={(value) => onChange(value, 'perspectiveX')}

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
                    onChange={(value) => onChange(value, 'perspectiveX')}
                    value={parseFloat(style.perspective?.split(' ')[0]) ?? ""}
                    step={0.1}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <InputNumber
                    name="perspectiveY"
                    size="small"
                    placeholder="perspectiveY"
                    value={parseFloat(style.perspective?.split(' ')[1]) ?? ""}
                    onChange={(value) => onChange(value, 'perspectiveY')}

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
                    onChange={(value) => onChange(value, 'perspectiveY')}
                    value={parseFloat(style.perspective?.split(' ')[1]) ?? ""}
                    step={0.1}
                />
            </div>

            {/* <div style={{ marginBottom: "10px" }}>
                <Input
                    name="perspectiveZ"
                    size="small"
                    placeholder="perspectiveZ"
                    value={parseInt(style.perspective?.split(' ')[2]) ?? ""}
                    onChange={() => {
                        e.preventDefault();
                        let value = e.target.value;
                        onChange(value, 'perspectiveZ')
                    }
                    }
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
                    onChange={(value) => onChange(value, 'perspectiveZ')}
                    value={parseInt(style.perspective?.split(' ')[2]) ?? ""}
                    step={0.1}
                />
            </div> */}



        </div> </>



}


