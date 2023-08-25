import React, { useEffect, useState } from 'react';
import { Button, Slider, InputNumber, Input, Select, Checkbox, ColorPicker } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'width', value: '100px' },
    { key: 'height', value: '100px' },
    { key: 'padding', value: '8px' },
    { key: 'color', value: '#333333' },
    { key: 'font-weight', value: 'normal' },
    { key: 'font-size', value: '14px' },
];

function FileInput({ children, selector, setChange }) {
    const [values, setValues] = useState({})
    

    const style = selector?.style;
    const properties = selector?.properties;
   useEffect(() => {
      

       if (!properties) return;

       
   }, [properties]);

   const handleInputChange = (key, value) => {
       setValues({ ...values, [key]: value });
       style.setProperty(key, value);
if (!properties[key]) 
     properties[key] = {};
       properties[key].value = value;

       setChange(true)

   };

    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>
            <div style={{ margin: '10px 0' }}>
                <label>Text Color</label> <br />
           
                   <ColorPicker value={properties['color']?.value}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                        handleInputChange('color', rgbColor)

                    }} />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Font Size</label> <br />
                <Slider
                    min={0.3}
                    max={48}
                    step={0.1}
                    value={parseFloat(properties['font-size']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('font-size',
                            `${v}${properties['font-size']?.unit || 'px'}`, properties['font-size']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['font-size']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('font-size', `${v}${properties['font-size']?.unit || 'px'}`,
                            properties['font-size']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['font-size']?.unit}
                            onChange={(unit) =>
                                handleInputChange('font-size',

                                    parseFloat(properties['font-size']?.value) + unit, unit)
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
                <label>Font Weight</label> <br />
                <Button.Group>
                    <Button
                        type={values['font-weight'] === 'normal' ? 'primary' : 'default'}
                        onClick={() => handleInputChange('font-weight', 'normal')}
                    >
                        Normal
                    </Button>
                    <Button
                        type={values['font-weight'] === 'bold' ? 'primary' : 'default'}
                        onClick={() => handleInputChange('font-weight', 'bold')}
                    >
                        Bold
                    </Button>
                    <Button
                        type={values['font-weight'] === 'lighter' ? 'primary' : 'default'}
                        onClick={() => handleInputChange('font-weight', 'lighter')}
                    >
                        Lighter
                    </Button>
                </Button.Group>
            </div>
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
          
    </div>
);

return style && content;
}

export default FileInput;