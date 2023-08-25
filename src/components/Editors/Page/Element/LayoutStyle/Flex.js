import React, { useEffect, useState } from 'react';
import { Radio, Button, InputNumber, Slider, Select } from 'antd';

const { Option } = Select;

const properties = [
  { key: 'padding', value: '10px' },
  { key: 'margin', value: '10px' },
  { key: 'flex-direction', value: 'row' },
  { key: 'justify-content', value: 'flex-start' },
  { key: 'gap', value: '10px' },

  { key: 'align-items', value: 'stretch' },
  { key: 'flex-wrap', value: 'nowrap' },
];

function Flex({  children, selector, setChange }) {
  const [values, setValues] = useState({});

  

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
    if (!properties[key]) {
      properties[key] = {};
    }
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
      {/* Flex Properties */}
      <div style={{ margin: '10px 0' }}>
        <label>Flex Direction</label> <br />
        <Select
          value={properties['flex-direction']?.value}
          onChange={(value) => handleInputChange('flex-direction', value)}
          style={{ width: '100%' }}

        >
          <Option value="row">Row</Option>
          <Option value="column">Column</Option>
          <Option value="row-reverse">Row Reverse</Option>
          <Option value="column-reverse">Column Reverse</Option>
        </Select>
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
        <label>Justify Content</label> <br />
        <Select
          value={properties['justify-content']?.value}
          onChange={(value) => handleInputChange('justify-content', value)}
          style={{ width: '100%' }}

        >
          <Option value="flex-start">Flex Start</Option>
          <Option value="flex-end">Flex End</Option>
          <Option value="center">Center</Option>
          <Option value="space-between">Space Between</Option>
          <Option value="space-around">Space Around</Option>
          <Option value="space-evenly">Space Evenly</Option>
        </Select>
      </div>
       
      <div style={{ margin: '10px 0' }}>
        <label>Align Items</label> <br />
        <Select
          value={properties['align-items']?.value}
          onChange={(value) => handleInputChange('align-items', value)}
          style={{ width: '100%' }}

        >
          <Option value="stretch">Stretch</Option>
          <Option value="flex-start">Flex Start</Option>
          <Option value="flex-end">Flex End</Option>
          <Option value="center">Center</Option>
          <Option value="baseline">Baseline</Option>
        </Select>
      </div>

 
    </div>
  );

  return (
    style && content

    // <Popover content={content} title="Flex Style" trigger="click">
    //   {children}
    // </Popover>
  );
}

export default Flex;