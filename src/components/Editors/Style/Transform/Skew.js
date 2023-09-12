import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Slider, Checkbox, Tooltip, InputNumber } from 'antd';
import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md';

const units = ['deg', 'rad', 'grad', 'turn'];
const { Option } = Select;

export default function Skew({
    min = -360,
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

    useEffect(() => {
        if (!properties || !properties['transform'] || !properties['transform']['skew']) {
            return;
        }

        const { valueX, valueY, xUnit, yUnit } = properties['transform']['skew'];

        if (valueX + xUnit === valueY + yUnit) {
            setLock(true);
        } else {
            setLock(false);
        }

        setXUnit(xUnit || 'deg');
        setYUnit(yUnit || 'deg');
    }, [properties]);

    const onChange = (value, name) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['skew']) {
            properties['transform']['skew'] = {xUnit, yUnit};
        }

        const skewData = properties['transform']['skew'];

        if (lock) {
            skewData.xUnit = xUnit;
            skewData.yUnit = yUnit;
            skewData.valueX = value;
            skewData.valueY = value;
        } else {
            if (name === 'skewX') {
                skewData.xUnit = xUnit;
                skewData.valueX = value;
            } else if (name === 'skewY') {
                skewData.yUnit = yUnit;
                skewData.valueY = value;
            }
        }

        // Create the skew transformation string
        const skew = `skew(${skewData.valueX || 0}${skewData.xUnit}, ${skewData.valueY || 0}${skewData.yUnit})`;

        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/skew\([^)]+\)/, '');
        const finalTransform = `${skew} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

    const onChangeUnit = (unit, axis) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['skew']) {
            properties['transform']['skew'] = {xUnit, yUnit};
        }

        const skewData = properties['transform']['skew'];

        if (lock) {
            skewData.xUnit = unit;
            skewData.yUnit = unit;
        } else {
            if (axis === 'x') {
                skewData.xUnit = unit;
            } else if (axis === 'y') {
                skewData.yUnit = unit;
            }
        }

        // Create the skew transformation string
        const skew = `skew(${skewData.valueX || 0}${skewData.xUnit}, ${skewData.valueY || 0}${skewData.yUnit})`;

        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/skew\([^)]+\)/, '');
        const finalTransform = `${skew} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        setXUnit(skewData.xUnit);
        setYUnit(skewData.yUnit);

        onChangeStyle();
    };

    const onChangePriority = (e) => {
        const priority = e.target.checked ? 'important' : '';

        if (!properties || !properties['transform']) {
            return;
        }

        properties['transform'].priority = priority;

        setStylePriority({ ...stylePriority, transform: priority });
        style.setProperty('transform', style.transform, priority);

        onChangeStyle();
    };

    return (
        <>
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Skew: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox
                            style={{ marginLeft: 3 }}
                            checked={stylePriority.transform === 'important'}
                            onChange={onChangePriority}
                        >
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties && properties['transform'] && properties['transform']['skew']) {
                                    delete properties['transform']['skew'];
                                }

                                const otherTransform = style.transform.replace(/skew\([^)]+\)/, '');
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
                        name="skewX"
                        size="small"
                        placeholder="skewX"
                        value={parseFloat(properties['transform']?.skew?.valueX) || 0}
                        onChange={(value) => onChange(value, 'skewX')}
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
                        onChange={(value) => onChange(value, 'skewX')}
                        value={parseFloat(properties['transform']?.skew?.valueX) || 0}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                        name="skewY"
                        size="small"
                        placeholder="skewY"
                        value={parseFloat(properties['transform']?.skew?.valueY) || 0}
                        onChange={(value) => onChange(value, 'skewY')}
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
                        onChange={(value) => onChange(value, 'skewY')}
                        value={parseFloat(properties['transform']?.skew?.valueY) || 0}
                        step={0.1}
                    />
                </div>
            </div>
        </>
    );
}