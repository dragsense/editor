import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Slider, Checkbox, Tooltip, InputNumber } from 'antd';
import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md';

const units = ['px', '%', 'em', 'rem'];
const { Option } = Select;

export default function Translate({
    min = 0,
    max = 1,
    style,
    stylePriority,
    properties,
    onChangeStyle,
    setStylePriority,
}) {
    const [lock, setLock] = useState(true);
    const [xUnit, setXUnit] = useState(units[0]);
    const [yUnit, setYUnit] = useState(units[0]);
    const [zUnit, setZUnit] = useState(units[0]);

    useEffect(() => {
        if (!properties || !properties['transform'] || !properties['transform']['translate']) {
            return;
        }

        const { valueX, valueY, valueZ, xUnit, yUnit, zUnit } = properties['transform']['translate'];

        if (valueX + xUnit === valueY + yUnit && valueX + xUnit === valueZ + zUnit) {
            setLock(true);
        } else {
            setLock(false);
        }

        setXUnit(xUnit || 'px');
        setYUnit(yUnit || 'px');
        setZUnit(zUnit || 'px');
    }, [properties]);

    const onChange = (value, name) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['translate']) {
            properties['transform']['translate'] = {xUnit, yUnit, zUnit};
        }

        const translateData = properties['transform']['translate'];

        if (lock) {
            translateData.xUnit = xUnit;
            translateData.yUnit = yUnit;
            translateData.zUnit = zUnit;
            translateData.valueX = value;
            translateData.valueY = value;
            translateData.valueZ = value;
        } else {
            if (name === 'translateX') {
                translateData.xUnit = xUnit;
                translateData.valueX = value;
            } else if (name === 'translateY') {
                translateData.yUnit = yUnit;
                translateData.valueY = value;
            } else if (name === 'translateZ') {
                translateData.zUnit = zUnit;
                translateData.valueZ = value;
            }
        }
        // Create the translate3d transformation string
        const translate3d = `translate3d(${translateData.valueX || 0}${xUnit}, ${translateData.valueY || 0}${yUnit}, ${translateData.valueZ || 0}${zUnit})`;
        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/translate3d\([^)]+\)/, '');
        const finalTransform = `${translate3d} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

    const onChangeUnit = (unit, axis) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['translate']) {
            properties['transform']['translate'] = {xUnit, yUnit, zUnit};
        }

        const translateData = properties['transform']['translate'];

        if (lock) {
            translateData.xUnit = unit;
            translateData.yUnit = unit;

            if (unit !== '%')
                translateData.zUnit = unit;


        } else {
            if (axis === 'x') {
                translateData.xUnit = unit;
            } else if (axis === 'y') {
                translateData.yUnit = unit;
            } else if (axis === 'z') {
                translateData.zUnit = unit;
            }
        }

        // Create the translate3d transformation string
        const translate3d = `translate3d(${translateData.valueX || 0}${translateData.xUnit}, ${translateData.valueY || 0}${translateData.yUnit}, ${translateData.valueZ || 0}${translateData.zUnit})`;
        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/translate3d\([^)]+\)/, '');
        const finalTransform = `${translate3d} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);


        setXUnit(translateData.xUnit)
        setYUnit(translateData.yUnit)

        if (translateData.zUnit !== '%')
            setZUnit(translateData.zUnit)


        onChangeStyle();
    };

   

    return (
        <>
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Translate: </strong>
                   
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties && properties['transform'] && properties['transform']['translate']) {
                                    delete properties['transform']['translate'];
                                }

                                const otherTransform = style.transform.replace(/translate3d\([^)]+\)/, '');
                                const finalTransform = `${otherTransform}`;

                                if (!finalTransform.trim()) {
                                    style.removeProperty('transform');
                                    setStylePriority({ ...stylePriority, transform: '' });
                                } else {
                                    style.setProperty('transform', finalTransform, stylePriority.transform);
                                    properties['transform'].value = finalTransform;
                                    setStylePriority({ ...stylePriority });
                                }

                                onChangeStyle();
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <Button
                        type={lock ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.preventDefault();
                            setLock(!lock);
                        }}
                    >
                        {lock ? <MdLockOutline size="1rem" /> : <MdLockOpen size="1rem" />}
                    </Button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="translateX"
                        size="small"
                        placeholder="translateX"
                        value={parseFloat(properties['transform']?.translate?.valueX) || 0}
                        onChange={(value) => onChange(value, 'translateX')}
                        addonAfter={
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={xUnit}
                                onChange={(value) => onChangeUnit(value, 'x')}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                        }
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'translateX')}
                        value={parseFloat(properties['transform']?.translate?.valueX) || 0}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="translateY"
                        size="small"
                        placeholder="translateY"
                        value={parseFloat(properties['transform']?.translate?.valueY) || 0}
                        onChange={(value) => onChange(value, 'translateY')}
                        addonAfter={
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={yUnit}
                                onChange={(value) => onChangeUnit(value, 'y')}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                        }
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'translateY')}
                        value={parseFloat(properties['transform']?.translate?.valueY) || 0}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="translateZ"
                        size="small"
                        placeholder="translateZ"
                        value={parseFloat(properties['transform']?.translate?.valueZ) || 0}
                        onChange={(value) => onChange(value, 'translateZ')}
                        addonAfter={
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={zUnit}
                                onChange={(value) => onChangeUnit(value, 'z')}
                            >
                                {units.map((unit, i) => unit !== '%' ? <Option key={i} value={unit}>
                                    {unit}
                                </Option> : <></>)}

                            </Select>
                        }
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'translateZ')}
                        value={parseFloat(properties['transform']?.translate?.valueZ) || 0}
                        step={0.1}
                    />
                </div>
            </div>
        </>
    );
}