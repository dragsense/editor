import { useState } from "react";
import { Button, Form, Input, Select, theme, Popconfirm, List, Typography, Popover } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';

import AddAttribute from "./Add";


const initialAttribute = { key: '', value: '', type: '', conditions: {} };
const initialCondition = { key: '', match: '', value: '' };
export default function ElementAttribute({ cascaderStates, label, _attributes, state, setState, setIsChange }) {
  const [currentAttribute, setCurrentAttribute] = useState(null);

  const attributes = state.attributes || {};

  const {
    token: { colorText, colorPrimary, colorError },
  } = theme.useToken();


  const onAdd = (attribute) => {
    setState((prevState) => ({
      ...prevState,
      attributes: { ...prevState.attributes, [attribute.key]: attribute },
    }));
    setCurrentAttribute(null);
    setIsChange(true);

  };

  const onRemove = (key) => {
    const updatedAttributes = { ...state.attributes };
    delete updatedAttributes[key];
    setState((prevState) => ({
      ...prevState,
      attributes: updatedAttributes,
    }));
    setIsChange(true);

  };

  const onEdit = (key) => {
    setCurrentAttribute(attributes[key]);
    setIsChange(true);

  };

  return currentAttribute ? (
    <AddAttribute
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
          <div style={{display: 'flex', justifyContent: 'space-between'}} key={key}>
            <Typography.Text strong><span  style={{ color: attr.conditions?.length > 0 ? colorPrimary : colorText }}>{attr.name}</span></Typography.Text>
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
   

      <Button type="dashed" style={{margin: '5px 0'}} onClick={() => setCurrentAttribute(initialAttribute)} block icon={<PlusOutlined />}>
        Add {label}
      </Button>
    </>
  );
}

