import React, { useEffect, useState } from 'react';
import { Slider, Form, Input, InputNumber, Checkbox, Button, Popover, Select, Card } from 'antd';

const { Option } = Select;

const Component = ({ states, onSave, skippedProperties }) => {

  const [propertyValues, setPropertyValues] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    setPropertyValues(states);
  }, [states])

  const handlePropertyChange = (property, value) => {
    setPropertyValues((prevValues) => ({
      ...prevValues,
      [property]: {
        ...prevValues[property],
        defaultValue: value,
      },
    }));

    setChange(true)
  };

  const handleSave = () => {
    onSave(propertyValues);

    setChange(false)

  };


  const content = (<>
    <div style={{ maxHeight: '65vh', overflow: 'auto', padding: 16 }}>
      <Form layout="vertical">
        {Object.values(propertyValues || {})
          .filter((property) => !skippedProperties.includes(property.key))
          .map((property) => (
            <Form.Item key={property.key} label={property.key}>
              {property.type === 'number' ? (
                <InputNumber
                  value={property.defaultValue}
                  onChange={(value) => handlePropertyChange(property.key, value)}
                  min={property.min !== undefined ? property.min : 0}
                  max={property.max !== undefined ? property.max : Infinity}
                />
              ) : property.type === 'dropdown' ? (
                <Select
                  defaultValue={property.defaultValue}
                  onChange={(value) => handlePropertyChange(property.key, value)}
                >
                  {property.values.map(val =>
                    <Option value={val}>{val}</Option>)}
                </Select>
              ) : property.type === 'boolean' ? (
                <Checkbox
                  defaultChecked={property.defaultValue}
                  onChange={(e) => handlePropertyChange(property.key, e.target.checked)}
                />
              ) : property.type === 'slider' ? (
                <Slider
                  defaultValue={parseFloat(property.defaultValue)}
                  step={property.step || 0.1}
                  min={property.min !== undefined ? property.min : 0}
                  max={property.max !== undefined ? property.max : 100}
                  onChange={(value) => handlePropertyChange(property.key, value)}
                />
              ) : <Input
                value={property.defaultValue}

                onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              />}
            </Form.Item>
          ))}

      </Form>
    </div>
    <div style={{  textAlign: 'right', padding: 16 }}>
      <Button type="primary" onClick={handleSave} disabled={!change}>
        Update
      </Button>
    </div>
  </>
  );

  return content;

};

export default Component;