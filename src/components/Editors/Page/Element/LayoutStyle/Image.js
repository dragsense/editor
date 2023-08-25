
import React, { useEffect, useState } from 'react';
import { Popover, Button, Slider, InputNumber, Input, Select, Checkbox } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'width', value: '100px' },
    { key: 'height', value: '100px' },
    { key: 'max-width', value: 'none' },
    { key: 'object-position', value: '50% 50%' },
    { key: 'object-fit', value: 'contain' },
];

function Image({ children, selector, setChange }) {
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
        if (!properties[key]) {
            properties[key] = {};
        }
        properties[key].value = value;
        properties[key].unit = unit;

        setChange(true)

    };

    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>
            <div style={{ margin: '10px 0' }}>
                <label>Width</label> <br />
                <Slider
                    min={0.3}
                    max={400}
                    step={0.1}
                    value={parseFloat(properties['width']?.value)}
                    onChange={(v) => {
                        const u = properties['width']?.unit || 'px';
                        handleInputChange('width', `${v}${u}`, u)
                    }
                    }
                />
                <InputNumber
                    value={parseFloat(properties['width']?.value)}
                    onChange={(v) => {
                        const u = properties['width']?.unit || 'px';
                        handleInputChange('width', `${v}${u}`, u)
                    }
                    }
                    addonAfter={
                        <Select
                            value={properties['width']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['width']?.value);
                                handleInputChange('width', `${v}${unit}`, unit)
                            }
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>} />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Height</label> <br />
                <Checkbox
                    checked={values['height'] === 'auto'}
                    onChange={(e) => {
                        const heightValue = e.target.checked ? 'auto' : '100px';
                        handleInputChange('height', heightValue);
                    }}
                >
                    Auto
                </Checkbox>
                <Slider
                    disabled={values['height'] === 'auto'}

                    min={0.3}
                    max={400}
                    step={0.1}
                    value={parseFloat(properties['height']?.value)}
                    onChange={(v) => {
                        const u = properties['height']?.unit || 'px';
                        handleInputChange('height', `${v}${u}`, u)
                    }
                    }
                />
                <InputNumber
                    disabled={values['height'] === 'auto'}
                    value={parseFloat(properties['height']?.value)}
                    onChange={(v) => {
                        const u = properties['height']?.unit || 'px';
                        handleInputChange('height', `${v}${u}`, u)
                    }
                    }

                    addonAfter={
                        <Select
                            disabled={values['height'] === 'auto'}
                            value={properties['height']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['height']?.value);
                                handleInputChange('height', `${v}${unit}`, unit)
                            }
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>} />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Max Width</label> <br />
                <InputNumber
                    value={parseFloat(properties['max-width']?.value)}
                    onChange={(v) => {
                        const u = properties['max-width']?.unit || 'px';

                        handleInputChange('max-width', v + u, u)
                    }
                    }
                    addonAfter={
                        <Select
                            value={properties['max-width']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['max-width']?.value);

                                handleInputChange('max-width', `${v}${unit}`, unit)
                            }
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="%">%</Option>
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>} />
            </div>
            {/* <div style={{ margin: '10px 0' }}>
        <label>Object Position X</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={parseFloat(values['object-position']?.split(' ')[0] || 50)}
          onChange={(x) => {
            const y = parseFloat(values['object-position']?.split(' ')[1] || 50);
            handleInputChange('object-position', `${x}% ${y}%`);
          }}
        />
        <label>Object Position Y</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={parseFloat(values['object-position']?.split(' ')[1] || 50)}
          onChange={(y) => {
            const x = parseFloat(values['object-position']?.split(' ')[0] || 50);
            handleInputChange('object-position', `${x}% ${y}%`);
          }}
        />
      </div> */}
            <div style={{ margin: '10px 0' }}>
                <label>Object Fit</label> <br />
                <Select
                    style={{ width: '100%' }}
                    value={values['object-fit']}
                    onChange={(fit) => handleInputChange('object-fit', fit)}
                >
                    <Option value="contain">Contain</Option>
                    <Option value="cover">Cover</Option>
                    <Option value="fill">Fill</Option>
                    <Option value="none">None</Option>
                    <Option value="scale-down">Scale Down</Option>
                </Select>
            </div>


          
        </div>
    );

    return (
        style && content

        // <Popover content={style && content} title="Image Style" trigger="click">
        //     {children}
        // </Popover>
    );
}

export default Image;