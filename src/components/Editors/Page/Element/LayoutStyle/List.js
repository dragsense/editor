
import React, { useEffect, useState } from 'react';
import { Typography, Button, Select, Checkbox } from 'antd';
import { AiOutlineUnorderedList, AiOutlineOrderedList } from 'react-icons/ai';

const { Text } = Typography;
const { Option } = Select;

const properties = [
  { key: 'list-style-type', value: 'none' },
  { key: 'padding-left', value: 0 },
];

function List({ children, selector, setChange }) {
  const [values, setValues] = useState({});
  

  const style = selector?.style;
  const properties = selector?.properties;

  useEffect(() => {
      if (!properties) return;
  }, [properties]);

  const handleInputChange = (key, value) => {
      setValues({ ...values, [key]: value });
      style.setProperty(key, value);
      if (!properties[key]) properties[key] = {};
      properties[key].value = value;
      setChange(true);
  };

  const content = (
    <div style={{ maxWidth: 200, zIndex: 10 }}>
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
      <div>
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

    return style && content;
}

export default List;