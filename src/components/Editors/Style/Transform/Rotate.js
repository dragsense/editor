import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Slider, Checkbox, Tooltip, InputNumber } from 'antd';
import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md';

const units = ['deg', 'rad', 'turn'];
const { Option } = Select;

export default function Rotate({
    min = 0,
    max = 360,
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
        if (!properties || !properties['transform'] || !properties['transform']['rotate']) {
            return;
        }

        const { valueX, valueY, valueZ, xUnit, yUnit, zUnit } = properties['transform']['rotate'];

        if (valueX + xUnit === valueY + yUnit && valueX + xUnit === valueZ + zUnit) {
            setLock(true);
        } else {
            setLock(false);
        }

        setXUnit(xUnit || 'deg');
        setYUnit(yUnit || 'deg');
        setZUnit(zUnit || 'deg');
    }, [properties]);

    const onChange = (value, name) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['rotate']) {
            properties['transform']['rotate'] = {xUnit, yUnit, zUnit};
        }

        const rotateData = properties['transform']['rotate'];

        if (lock) {
            rotateData.xUnit = xUnit;
            rotateData.yUnit = yUnit;
            rotateData.zUnit = zUnit;
            rotateData.valueX = value;
            rotateData.valueY = value;
            rotateData.valueZ = value;
        } else {
            if (name === 'rotateX') {
                rotateData.xUnit = xUnit;
                rotateData.valueX = value;
            } else if (name === 'rotateY') {
                rotateData.yUnit = yUnit;
                rotateData.valueY = value;
            } else if (name === 'rotateZ') {
                rotateData.zUnit = zUnit;
                rotateData.valueZ = value;
            }
        }

        // Create the rotate3d transformation string
        const rotate3d = `rotate3d(1, 0, 0, ${rotateData.valueX || 0}${rotateData.xUnit}) rotate3d(0, 1, 0, ${rotateData.valueY || 0}${rotateData.yUnit}) rotate3d(0, 0, 1, ${rotateData.valueZ || 0}${rotateData.zUnit})`;

        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/rotate3d\([^)]+\)/g, '');
        const finalTransform = `${rotate3d} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

    const onChangeUnit = (unit, axis) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['rotate']) {
            properties['transform']['rotate'] = {xUnit, yUnit, zUnit};
        }

        const rotateData = properties['transform']['rotate'];

        if (lock) {
            rotateData.xUnit = unit;
            rotateData.yUnit = unit;
            rotateData.zUnit = unit;
        } else {
            if (axis === 'x') {
                rotateData.xUnit = unit;
            } else if (axis === 'y') {
                rotateData.yUnit = unit;
            } else if (axis === 'z') {
                rotateData.zUnit = unit;
            }
        }

        // Create the rotate3d transformation string
        const rotate3d = `rotate3d(1, 0, 0, ${rotateData.valueX || 0}${rotateData.xUnit}) rotate3d(0, 1, 0, ${rotateData.valueY || 0}${rotateData.yUnit}) rotate3d(0, 0, 1, ${rotateData.valueZ || 0}${rotateData.zUnit})`;

        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/rotate3d\([^)]+\)/g, '');
        const finalTransform = `${rotate3d} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        setXUnit(rotateData.xUnit);
        setYUnit(rotateData.yUnit);
        setZUnit(rotateData.zUnit);

        onChangeStyle();
    };


    return (
        <>
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Rotate: </strong>
                  
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties && properties['transform'] && properties['transform']['rotate']) {
                                    delete properties['transform']['rotate'];
                                }

                                const otherTransform = style.transform.replace(/rotate3d\([^)]+\)/g, '');
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
                        name="rotateX"
                        size="small"
                        placeholder="rotateX"
                        value={parseFloat(properties['transform']?.rotate?.valueX) || 0}
                        onChange={(value) => onChange(value, 'rotateX')}
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
                        onChange={(value) => onChange(value, 'rotateX')}
                        value={parseFloat(properties['transform']?.rotate?.valueX) || 0}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="rotateY"
                        size="small"
                        placeholder="rotateY"
                        value={parseFloat(properties['transform']?.rotate?.valueY) || 0}
                        onChange={(value) => onChange(value, 'rotateY')}
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
                        onChange={(value) => onChange(value, 'rotateY')}
                        value={parseFloat(properties['transform']?.rotate?.valueY) || 0}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="rotateZ"
                        size="small"
                        placeholder="rotateZ"
                        value={parseFloat(properties['transform']?.rotate?.valueZ) || 0}
                        onChange={(value) => onChange(value, 'rotateZ')}
                        addonAfter={
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={zUnit}
                                onChange={(value) => onChangeUnit(value, 'z')}
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
                        onChange={(value) => onChange(value, 'rotateZ')}
                        value={parseFloat(properties['transform']?.rotate?.valueZ) || 0}
                        step={0.1}
                    />
                </div>
            </div>
        </>
    );
}