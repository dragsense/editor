import React, { useEffect, useState } from 'react';
import { Popover,Typography, Button, Select, Slider, InputNumber, Checkbox } from 'antd';
import { AiOutlineUnorderedList, AiOutlineOrderedList } from 'react-icons/ai';

const { Text } = Typography;
const { Option } = Select;

const properties = [
    { key: 'list-style-type', value: 'none' },
    { key: 'gap', value: '10px' },
    { key: 'flex-direction', value: 'row' },

    { key: 'padding-left', value: 0 },
];

function Menu({ children, selector, setChange }) {
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
        <div style={{ maxWidth: 200, zIndex: 10 }}>
            <div style={{ margin: '10px 0' }}>
                <Checkbox
                    checked={values['flex-direction'] === 'column'}
                    onChange={(e) =>
                        handleInputChange('flex-direction', e.target.checked ? 'column' : 'row')
                    }
                >
                    Vertical
                </Checkbox>
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Items Gap</label> <br />
                <Slider
                    min={0.3}
                    max={400}
                    step={0.1}
                    value={parseFloat(properties['gap']?.value)}
                    onChange={(v) => {
                        const u = properties['gap']?.unit || 'px';
                        handleInputChange('gap', `${v}${u}`, u)
                    }
                    }
                />
                <InputNumber
                    value={parseFloat(properties['gap']?.value)}
                    onChange={(v) => {
                        const u = properties['gap']?.unit || 'px';
                        handleInputChange('gap', `${v}${u}`, u)
                    }
                    }
                    addonAfter={
                        <Select
                            value={properties['gap']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['gap']?.value);
                                handleInputChange('gap', `${v}${unit}`, unit)
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
                <label>List Style</label>
                <Select
                    value={values['list-style-type']}
                    onChange={(value) => handleInputChange('list-style-type', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="none">None</Option>
                    <Option value="disc">Disc</Option>
                    <Option value="circle">Circle</Option>
                    <Option value="square">Square</Option>
                    <Option value="decimal">Decimal</Option>
                    <Option value="decimal-leading-zero">Decimal Leading Zero</Option>
                    <Option value="lower-roman">Lower Roman</Option>
                    <Option value="upper-roman">Upper Roman</Option>
                </Select>
            </div>
            <div style={{ margin: '10px 0' }}>
                <Checkbox
                    checked={values['padding-left'] === '40px'}
                    onChange={(e) =>
                        handleInputChange('padding-left', e.target.checked ? '40px' : 0)
                    }
                >
                    Indent
                </Checkbox>
            </div>

        
        </div>
    );

    return (
        <>{        style && content
        }
            {/* <Popover content={style && content} title="Menu" trigger="click">
                {children}
            </Popover> */}
        </>
    );
}

export default Menu;