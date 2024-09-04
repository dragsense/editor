import React, { useEffect, useState, useCallback } from 'react';
import { Slider, Form, Input, InputNumber, Checkbox, Button, Popover, Select, Card } from 'antd';

const { Option } = Select;

// Component to handle the properties of the states
const Component = ({ states, onSave, skippedProperties }) => {

  // State to hold the property values
  const [propertyValues, setPropertyValues] = useState();
  // State to track changes in the input
  const [change, setChange] = useState(false);

  // Effect to set the property values when states change
  useEffect(() => {
    setPropertyValues({...states});
  }, [states])

  // Function to handle changes in the property values
  const handlePropertyChange = useCallback((property, value) => {
    setPropertyValues((prevValues) => ({
      ...prevValues,
      [property]: {
        ...prevValues[property],
        defaultValue: value,
      },
    }));

    // Set change to true to indicate that there has been a change in the input
    setChange(true)
  }, []);

  // Function to handle saving of the property values
  const handleSave = useCallback(() => {
    onSave(propertyValues);

    // Set change to false to indicate that the changes have been saved
    setChange(false)
  }, [propertyValues, onSave]);

  // Function to render the form items based on the property type
  const renderFormItem = useCallback((property) => {
    switch(property.type) {
      case 'number':
        return (
          <InputNumber
            value={property.defaultValue}
            onChange={(value) => handlePropertyChange(property.key, value)}
            min={property.min !== undefined ? property.min : 0}
            max={property.max !== undefined ? property.max : Infinity}
          />
        );
      case 'dropdown':
        return (
          <Select
            defaultValue={property.defaultValue}
            onChange={(value) => handlePropertyChange(property.key, value)}
          >
            {property.values.map(val =>
              <Option value={val}>{val}</Option>)}
          </Select>
        );
      case 'boolean':
        return (
          <Checkbox
            defaultChecked={property.defaultValue}
            onChange={(e) => handlePropertyChange(property.key, e.target.checked)}
          />
        );
      case 'slider':
        return (
          <Slider
            defaultValue={parseFloat(property.defaultValue)}
            step={property.step || 0.1}
            min={property.min !== undefined ? property.min : 0}
            max={property.max !== undefined ? property.max : 100}
            onChange={(value) => handlePropertyChange(property.key, value)}
          />
        );
      default:
        return (
          <Input
            value={property.defaultValue}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
          />
        );
    }
  }, [handlePropertyChange]);

  // Render the component
  return (
    <>
    
      <div style={{ maxHeight: '65vh', overflow: 'auto' }}>
        <Form layout="vertical">
          {Object.values(propertyValues || {})
            .filter((property) => !skippedProperties.includes(property.key))
            .map((property) => (
              <Form.Item key={property.key} label={property.key}>
                {renderFormItem(property)}
              </Form.Item>
            ))}
        </Form>
      </div>
      <div style={{  textAlign: 'right' }}>
        <Button type="primary" onClick={handleSave} disabled={!change}>
          Update
        </Button>
      </div>
    </>
  );
};

export default Component;