
import React, { useEffect, useState } from 'react';
import { Popover, Input, Select, Checkbox, ColorPicker, InputNumber } from 'antd';
import { Typography, Button } from 'antd';
import { AiOutlineLink } from 'react-icons/ai';

const { Text } = Typography;
const { Option } = Select;

const properties = [
  { key: 'color', value: '#1890ff' },
  { key: 'text-decoration', value: 'none' },
];

function Link({ children, selector, setChange }) {
  const [values, setValues] = useState({});
  

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
    <div style={{ maxWidth: 200, zIndex: 10 }}>
      <div style={{ margin: '10px 0' }}>
        <label>Color:</label>
        <br/>
        <ColorPicker value={values['color']}
          allowClear={true}
          format={"hex"}
          onChangeComplete={(color, hex) => {
            const metaColor = color.metaColor;
            const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

            handleInputChange('color', rgbColor)

          }} />
 {" "}
        <Checkbox
          checked={values['color'] === 'inherit'}
          onChange={(e) =>
            handleInputChange(
              'color',
              e.target.checked ? 'inherit' : 'none'
            )
          }
        >
          Inherit
        </Checkbox>
      </div>
      <div>
        <Checkbox
          checked={values['text-decoration'] === 'underline'}
          onChange={(e) =>
            handleInputChange(
              'text-decoration',
              e.target.checked ? 'underline' : 'none'
            )
          }
        >
          Underline
        </Checkbox>
      </div>

     
    </div>
  );

  return (
    <>
    {        style && content
}
      {/* <Popover content={style && content} title="Link" trigger="click">
        <a href="#" style={{ color: values['color'], textDecoration: values['text-decoration'] }}>
          {children}
        </a>
      </Popover> */}
    </>
  );
}

export default Link;