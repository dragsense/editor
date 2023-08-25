import React, { useEffect, useState } from 'react';
import { Radio, Button, InputNumber, Slider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'margin', value: '10px' },
    { key: 'padding', value: '10px' },
];

function Article({ children, selector, setChange }) {
    const [values, setValues] = useState({})

    const style = selector?.style;
    const properties = selector?.properties;
    useEffect(() => {


        if (!properties) return;

    }, [properties]);

    const handleInputChange = (key, value, unit = 'px') => {
        setValues({ ...values, [key]: value });

        style.setProperty(key, value);
        if (!properties[key])
            properties[key] = {};
  
        properties[key].value = value;
        properties[key].unit = unit;

        setChange(true)

    };


    const handleSideInputChange = (side, key, value) => {
        handleInputChange(key, `${value}${properties[key]?.unit || 'px'}`);
    };

    const handleLockAllSides = (value) => {
        ['top', 'right', 'bottom', 'left'].forEach((side) => {
            handleSideInputChange(side, `${adjustmentType}-${side}`, value);
        });
    };

    const [adjustmentType, setAdjustmentType] = useState('padding');

    const handleAdjustmentTypeChange = (type) => {
        setAdjustmentType(type);
    };


    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>

            <div style={{ margin: '10px 0' }}>
                <label>Adjustment Type:</label> <br />
                <Radio.Group
                    value={adjustmentType}
                    onChange={(e) => handleAdjustmentTypeChange(e.target.value)}
                >
                    <Radio value="padding">Padding</Radio>
                    <Radio value="margin">Margin</Radio>
                </Radio.Group>
            </div>


            <div style={{ margin: '10px 0' }}>
                <label>All Sides</label> <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties[`${adjustmentType}-top`]?.value || 0)}
                    onChange={(v) => handleLockAllSides(v)}
                />
                <InputNumber
                    value={parseFloat(properties[`${adjustmentType}-top`]?.value || 0)}
                    onChange={(v) => handleLockAllSides(v)}
                    addonAfter={
                        <Select
                            value={properties[`${adjustmentType}-top`]?.unit}
                            onChange={(unit) => {
                                handleLockAllSides(parseFloat(properties[`${adjustmentType}-top`]?.value) + unit);
                            }}
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>
                    }
                />
            </div>
            {['top', 'right', 'bottom', 'left'].map((side) => (
                <div key={side} style={{ margin: '10px 0' }}>
                    <label>{`${side.charAt(0).toUpperCase() + side.slice(1)}`}</label> <br />
                    <Slider
                        min={0.3}
                        max={50}
                        step={0.1}
                        value={parseFloat(properties[`${adjustmentType}-${side}`]?.value || 0)}
                        onChange={(v) =>
                            handleSideInputChange(side, `${adjustmentType}-${side}`, v)
                        }
                    />
                    <InputNumber
                        value={parseFloat(properties[`${adjustmentType}-${side}`]?.value || 0)}
                        onChange={(v) =>
                            handleSideInputChange(side, `${adjustmentType}-${side}`, v)
                        }
                        addonAfter={
                            <Select
                                value={properties[`${adjustmentType}-${side}`]?.unit}
                                onChange={(unit) => {
                                    handleSideInputChange(side, `${adjustmentType}-${side}`, parseFloat(properties[`${adjustmentType}-${side}`]?.value) + unit);
                                }}
                                style={{ width: 70 }}
                            >
                                <Option value="px">px</Option>
                                <Option value="em">em</Option>
                                <Option value="rem">rem</Option>
                            </Select>
                        }
                    />
                </div>
            ))}
            
        </div>
    );

    return style && content;
}

export default Article;