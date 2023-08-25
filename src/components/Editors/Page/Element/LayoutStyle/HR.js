import React, { Children, useEffect, useState } from 'react';
import { Popover, Slider,Select, Button, ColorPicker } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
const { Option } = Select;
const properties = [
  { key: 'border-color', value: '#000000' },
  { key: 'border-width', value: '1px' },
  { key: 'border-style', value: 'solid' },

  // Add more properties as needed
];

function Hr({ children, selector, setChange }) {
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
    <div style={{ marginBottom: '10px' }}>
        <label>Border Color</label> <br/>
       
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
        <label>Border Width</label> <br/>
        <Slider
          min={1}
          max={48}
          step={0.1}
          value={parseInt(values['border-width'])}
          onChange={(v) => handleInputChange('border-width', v + 'px')}
          style={{ width: '150px' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Border Style</label> <br/>
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
     
        </div>
    );

    return (
      style && content

    //     <Popover content={style && content} title="Horizontal Rule Style" trigger="click">
    //  {children}
    // </Popover>
  );
}

export default Hr;