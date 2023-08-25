import React, { useEffect, useState } from 'react';
import { Popover, InputNumber, Slider, Select, Radio, Button } from 'antd';
import { ArrowUpOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'padding', value: '10px' },
    { key: 'background', value: 'transparent' },
    { key: 'font-weight', value: 'normal' },

    { key: 'color', value: 'black' },
    { key: 'top', value: 'auto' },
    { key: 'bottom', value: '50px' },
    { key: 'left', value: 'auto' },
    { key: 'right', value: '50px' },
    { key: 'font-size', value: '14px' },
];

function GoToTop({ children, selector, setChange }) {
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

    const handleTopBottomChange = (e) => {
        const value = e.target.value;
        if (value === 'top') {
            handleInputChange('top',
                properties['top']?.value || properties['bottom']?.value || '50px',  properties['top']?.unit || properties['bottom']?.unit || 'px');

            handleInputChange('bottom', null);
        } else if (value === 'bottom') {
            handleInputChange('top', null);
            handleInputChange('bottom',
                properties['top']?.value || properties['bottom']?.value || '50px',  properties['top']?.unit || properties['bottom']?.unit || 'px');
        }
    };

    const handleLeftRightChange = (e) => {
        const value = e.target.value;
        if (value === 'left') {
            handleInputChange('left',
                properties['left']?.value || properties['right']?.value || '50px',  properties['left']?.unit || properties['right']?.unit || 'px');
            handleInputChange('right', null);
        } else if (value === 'right') {
            handleInputChange('right',
                properties['left']?.value || properties['right']?.value || '50px',  properties['left']?.unit || properties['right']?.unit || 'px');
            handleInputChange('left', null);
        }
    };

    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>

            <div style={{ margin: '10px 0' }}>
                <label>Top / Bottom</label> <br />
                <Radio.Group
                    value={properties['top']?.value ? 'top' : 'bottom'}
                    onChange={handleTopBottomChange}
                >
                    <Radio.Button value="top">Top</Radio.Button>
                    <Radio.Button value="bottom">Bottom</Radio.Button>
                </Radio.Group>
                <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['top']?.value || properties['bottom']?.value || 50)}
                    onChange={(v) => {
                        const unit = properties['top']?.value ? properties['top']?.unit : properties['bottom']?.unit;
                        handleInputChange(
                            properties['top']?.value ? 'top' : 'bottom',
                            `${v}${unit}`,
                            unit
                        );
                    }}
                />
                <InputNumber
                    value={parseFloat(properties['top']?.value || properties['bottom']?.value || 50)}
                    onChange={(v) => {
                        const unit = properties['top']?.value ? properties['top']?.unit : properties['bottom']?.unit;
                        handleInputChange(
                            properties['top']?.value ? 'top' : 'bottom',
                            `${v}${unit}`,
                            unit
                        );
                    }}
                    addonAfter={
                        <Select
                            value={properties['top']?.unit || properties['bottom']?.unit}
                            onChange={(unit) =>
                                handleInputChange(
                                    properties['top']?.value ? 'top' : 'bottom',
                                    parseFloat(properties['top']?.value || properties['bottom']?.value) + unit,
                                    unit
                                )
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
                <label>Left / Right</label> <br />
                <Radio.Group
                    value={properties['left']?.value ? 'left' : 'right'}
                    onChange={handleLeftRightChange}
                >
                    <Radio.Button value="left">Left</Radio.Button>
                    <Radio.Button value="right">Right</Radio.Button>
                </Radio.Group>
                <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['left']?.value || properties['right']?.value)}
                    onChange={(v) => {
                        const unit = properties['left']?.value ? properties['left']?.unit : properties['right']?.unit;
                        handleInputChange(
                            properties['left']?.value ? 'left' : 'right',
                            `${v}${unit}`,
                            unit
                        );
                    }}
                />
                <InputNumber
                    value={parseFloat(properties['left']?.value || properties['right']?.value)}
                    onChange={(v) => {
                        const unit = properties['left']?.value ? properties['left']?.unit : properties['right']?.unit;
                        handleInputChange(
                            properties['left']?.value ? 'left' : 'right',
                            `${v}${unit}`,
                            unit
                        );
                    }}
                    addonAfter={
                        <Select
                            value={properties['left']?.unit || properties['right']?.unit}
                            onChange={(unit) =>
                                handleInputChange(
                                    properties['left']?.value ? 'left' : 'right',
                                    parseFloat(properties['left']?.value || properties['right']?.value) + unit,
                                    unit
                                )
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
                <label>Background</label> <br />
                <input type='color'
                    value={properties['background']?.value || ''}
                    onChange={(e) =>
                        handleInputChange('background', e.target.value)
                    }
                />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Color</label> <br />
                <input type='color'
                    value={properties['color']?.value || ''}
                    onChange={(e) =>
                        handleInputChange('color', e.target.value)
                    }
                />
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
       
        </div>
    );

    return (
        style && content

        // <Popover content={style && content} title="GoToTop Style" trigger="click">
        //     {children}
        // </Popover>
    );
}

export default GoToTop;