import React, { useEffect, useState } from 'react';
import { Popover, InputNumber, Slider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'height', value: '100px' },
    { key: 'display', value: 'inline-block' },
    { key: 'padding', value: '10px' },
    { key: 'margin', value: '10px' },
    // Add more properties as needed
];

function Logo({ children, selector, setChange }) {
    const [values, setValues] = useState({});
    
  
    const style = selector?.style;
    const properties = selector?.properties;
  
    useEffect(() => {
        if (!properties) return;
    }, [properties]);
  
    const handleInputChange = (key, value) => {
        setValues({ ...values, [key]: value });
        style.setProperty(key, value);
        if (!properties[key]) properties[key] = {};
        properties[key].value = value;
        setChange(true);
    };
  


    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>
            <div style={{ margin: '10px 0' }}>
            <label>Display</label> <br />

                <Select
                    value={properties['display']?.value}
                    onChange={(value) =>
                        handleInputChange('display', value)
                    }
                >
                    <Option value="block">Block</Option>
                    <Option value="inline-block">Inline Block</Option>
                </Select>
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Height</label> <br />
                <Slider
                    min={0.3}
                    max={100}
                    step={0.1}
                    value={parseFloat(properties['height']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('height',
                            `${v}${properties['height']?.unit || 'px'}`, properties['height']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['height']?.value || 0)}
                    onChange={(v) =>
                        handleInputChange('height', `${v}${properties['height']?.unit || 'px'}`,
                            properties['height']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['height']?.unit}
                            onChange={(unit) =>
                                handleInputChange('height',

                                    parseFloat(properties['height']?.value) + unit, unit)
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>
                    }
                />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Padding</label> <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['padding']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('padding',
                            `${v}${properties['padding']?.unit || 'px'}`, properties['padding']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['padding']?.value || 10)}
                    onChange={(v) =>
                        handleInputChange('padding', `${v}${properties['padding']?.unit || 'px'}`,
                            properties['padding']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['padding']?.unit}
                            onChange={(unit) =>
                                handleInputChange('padding',

                                    parseFloat(properties['padding']?.value) + unit, unit)
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>
                    }
                />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Margin</label> <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['margin']?.value || 0)}
                    onChange={(v) =>
                        handleInputChange('margin',
                            `${v}${properties['margin']?.unit || 'px'}`, properties['margin']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['margin']?.value || 10)}
                    onChange={(v) =>
                        handleInputChange('margin', `${v}${properties['margin']?.unit || 'px'}`,
                            properties['margin']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['margin']?.unit}
                            onChange={(unit) =>
                                handleInputChange('margin',

                                    parseFloat(properties['margin']?.value) + unit, unit)
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>
                    }
                />
            </div>
            
        </div>
    );

    return style && content;
}

export default Logo;