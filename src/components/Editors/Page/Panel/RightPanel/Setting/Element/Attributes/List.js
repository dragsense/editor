import { useState, useCallback } from "react";
import { Button, Form, Input, Select, theme, Popconfirm, List, Typography, Popover } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';

import AddAttribute from "./Add";

// Initial attribute and condition objects
const initialAttribute = { key: '', value: '', type: '', conditions: {} };
const initialCondition = { key: '', match: '', value: '' };

export default function ElementAttribute({
  isCondtions = true,
  cascaderStates,
  label,
  _attributes,
  state,
  setState,
  setIsChange }) {
  
  // Current attribute state
  const [currentAttribute, setCurrentAttribute] = useState(null);

  // Extract attributes from state
  const attributes = state.attributes || {};

  // Extract theme colors
  const {
    token: { colorText, colorPrimary, colorError },
  } = theme.useToken();

  // Function to add attribute
  const onAdd = useCallback((attribute) => {
    setState((prevState) => ({
      ...prevState,
      attributes: { ...prevState.attributes, [attribute.key]: attribute },
    }));
    setCurrentAttribute(null);
    setIsChange(true);
  }, [setState, setIsChange]);

  // Function to remove attribute
  const onRemove = useCallback((key) => {
    const updatedAttributes = { ...state.attributes };
    delete updatedAttributes[key];
    setState((prevState) => ({
      ...prevState,
      attributes: updatedAttributes,
    }));
    setIsChange(true);
  }, [setState, setIsChange]);

  // Function to edit attribute
  const onEdit = useCallback((key) => {
    setCurrentAttribute(attributes[key]);
    setIsChange(true);
  }, [setIsChange, attributes]);

  // Render AddAttribute component if currentAttribute is present, else render attribute list
  return currentAttribute ? (
    <AddAttribute
      isCondtions={isCondtions}
      current={currentAttribute}
      onAdd={onAdd}
      label={label}
      attributes={_attributes}
      states={cascaderStates}
      setIsChange={setIsChange}
      setCurrent={setCurrentAttribute}
    />
  ) : (
    <>
      {Object.entries(attributes).map(([key, attr], idx) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }} key={key}>
          <Typography.Text strong><span style={{ color: attr.conditions?.length > 0 ? colorPrimary : colorText }}>{attr.name || attr.key}</span></Typography.Text>
          <div>
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(key)} />
            <Popconfirm
              title="Delete"
              description={`Are you sure to delete this ${label?.toLowerCase()}?`}
              onConfirm={() => onRemove(key)}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<MinusCircleOutlined />} />
            </Popconfirm>
          </div>
        </div>
      ))}

      <Button type="dashed" style={{ margin: '5px 0' }} 
      onClick={() => setCurrentAttribute(initialAttribute)} 
      block icon={<PlusOutlined />}>
        Add {label}
      </Button>
    </>
  );
}

