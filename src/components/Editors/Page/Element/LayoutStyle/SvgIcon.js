import React, { useEffect, useState } from 'react';
import { Popover, Slider, InputNumber, Button, ColorPicker, Select, Checkbox } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'width', value: '100px' },
    { key: 'padding', value: '8px' },
    { key: 'margin', value: '8px' },

    { key: 'fill', value: '#333333' },
    { key: 'border-color', value: '#d9d9d9' },
    { key: 'border-width', value: '1px' },
    { key: 'border-style', value: 'solid' },
    { key: 'border-radius', value: '4px' },
    { key: 'background-color', value: '#1890ff' },
];

function SvgIcon({ children, selector, setChange }) {
    const [values, setValues] = useState({})
    

    const style = selector?.style;
    const properties = selector?.properties;
    useEffect(() => {


        if (!properties) return;


    }, [properties]);

    const handleInputChange = (key, value, unit) => {
        setValues({ ...values, [key]: value });

        style.setProperty(key, value);
        if (!properties[key])
            properties[key] = {};
        properties[key].value = value;
        properties[key].unit = unit;

        setChange(true)

    };




    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>


            <div style={{ margin: '10px 0' }}>

                <label>Fill Color</label> <br />



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
                <label>Width</label> <br />
                <Checkbox
                    checked={values['width'] === 'auto'}
                    onChange={(e) => {
                        const heightValue = e.target.checked ? 'auto' : '100px';
                        handleInputChange('width', heightValue);
                    }}
                >
                    Auto
                </Checkbox>
                <Slider
                    disabled={values['width'] === 'auto'}
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
                    disabled={values['width'] === 'auto'}

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
                    value={parseFloat(properties['margin']?.value || 16)}
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

            <div style={{ marginBottom: '10px' }}>
                <label>Border Color</label> <br />

                <ColorPicker value={properties['border-color']?.value}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                        handleInputChange('border-color', rgbColor)

                    }} />

            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Border Width</label> <br />
                <Slider
                    min={1}
                    max={48}
                    step={0.1}
                    value={parseInt(values['border-width'])}
                    onChange={(v) => handleInputChange('border-width', v + 'px')}
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <label>Border Style</label> <br />
                <Select
                    value={values['border-style']}
                    onChange={(v) => handleInputChange('border-style', v)}
                    style={{ width: '100%' }}
                >
                    <Option value="none">None</Option>
                    <Option value="solid">Solid</Option>
                    <Option value="dashed">Dashed</Option>
                    <Option value="dotted">Dotted</Option>
                    <Option value="double">Double</Option>
                </Select>
            </div>
            <div style={{ marginTop: '10px' }}>
                <label>Border Radius</label> <br />
                <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={parseInt(values['border-radius'])}
                    onChange={(v) => {
                        const u = properties['border-radius']?.unit || 'px';

                        handleInputChange('border-radius', `${v}${u}`, u)
                    }
                    }

                />
                <InputNumber
                    value={parseFloat(properties['border-radius']?.value)}
                    onChange={(v) => {
                        const u = properties['border-radius']?.unit || 'px';
                        handleInputChange('height', `${v}${u}`, u)
                    }
                    }

                    addonAfter={
                        <Select
                            disabled={values['border-radius'] === 'auto'}
                            value={properties['border-radius']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['border-radius']?.value);
                                handleInputChange('border-radius', `${v}${unit}`, unit)
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
                <label>Background Color</label> <br />


                <ColorPicker value={properties['background-color']?.value}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                        handleInputChange('background-color', rgbColor)

                    }} />

            </div>

            

        </div>
    );

    return (<>
        {style && content
        }
        {/* <Popover content={style && content} title="Icon Style" trigger="click">
            {children}
        </Popover> */}
    </>
    );
}

export default SvgIcon;