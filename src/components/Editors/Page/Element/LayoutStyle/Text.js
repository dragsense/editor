import React, { useEffect, useState } from 'react';
import { Popover, Slider ,Button, InputNumber, ColorPicker,Select } from 'antd';
import {
  PlusOutlined,
  DragOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Option } = Select;


const typographyProperties = [
  { key: 'font-size', value: '16px' },
  { key: 'font-weight', value: 'normal' },
  { key: 'line-height', value: '1.2' },
  { key: 'color', value: '#333333' },
  { key: 'text-align', value: 'left' },
  { key: 'font-style', value: 'normal' },
  { key: 'text-decoration', value: 'none' },
];

function Text({ children, selector, setChange }) {




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

  
    properties[key].value = value;
    properties[key].unit = unit;
    setChange(true)

  };

  const handleTextAlign = (textAlign) => {
    handleInputChange('text-align', textAlign);
  };

  
  const handleFontStyle = (fontStyle) => {
    handleInputChange('font-style', fontStyle);
  };

  const handleTextDecoration = (textDecoration) => {
    handleInputChange('text-decoration', textDecoration);
  };

  const content = (
    <div style={{ maxWidth: 230, zIndex: 10 }}>
    <div style={{ margin: '10px 0' }}>
        <label>Text Color</label> <br/>
    

<ColorPicker value={properties['color']?.value}
          allowClear={true}
          format={"hex"}
          onChangeComplete={(color, hex) => {
            const metaColor = color.metaColor;
            const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

            handleInputChange('color', rgbColor)

          }} />

      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Font Size</label> <br/>
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
                
                parseFloat(properties['font-size']?.value) +  unit , unit)
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
        <label>Font Weight</label> <br/>
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
     
      <div style={{ margin: '10px 0' }}>
        <label>Line Height</label> 
        <Slider
          min={1}
          max={10}
          step={0.1}
          value={parseFloat(values['line-height'] || 1.2)}
          onChange={(v) => handleInputChange('line-height', v)}
        />
        
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Font Style</label> <br/>
        <Button.Group>
          <Button
            type={values['font-style'] === 'normal' ? 'primary' : 'default'}
            onClick={() => handleFontStyle('normal')}
          >
            N
          </Button>
          <Button
            type={values['font-style'] === 'italic' ? 'primary' : 'default'}
            onClick={() => handleFontStyle('italic')}
          >
            <em>I</em>
          </Button>
        </Button.Group>
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Text Decoration</label> <br/>
        <Button.Group>
          <Button
            type={
              values['text-decoration'] === 'none' ? 'primary':'default' 
            }
            onClick={() => handleTextDecoration('none')}
          >
            None
          </Button>
          <Button
            type={
              values['text-decoration'] === 'underline' ? 'primary' : 'default'
            }
            onClick={() => handleTextDecoration('underline')}
          >
            <span style={{textDecoration: 'underline'}}>UL</span>
          </Button>
          <Button
            type={
              values['text-decoration'] === 'overline' ? 'primary' : 'default'
            }
            onClick={() => handleTextDecoration('overline')}
          >
            <span style={{textDecoration: 'overline'}}>OL</span>
          </Button>
        </Button.Group>
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Text Align</label> <br/>
        <Button.Group>
          <Button
            type={values['text-align'] === 'left' ? 'primary' : 'default'}
            onClick={() => handleTextAlign('left')}
          >
            Left
          </Button>
          <Button
            type={values['text-align'] === 'center' ? 'primary' : 'default'}
            onClick={() => handleTextAlign('center')}
          >
            Center
          </Button>
          <Button
            type={values['text-align'] === 'right' ? 'primary' : 'default'}
            onClick={() => handleTextAlign('right')}
          >
            Right
          </Button>
          <Button
            type={values['text-align'] === 'justify' ? 'primary' : 'default'}
            onClick={() => handleTextAlign('justify')}
          >
            Justify
          </Button>
        </Button.Group>
      </div>

   
    </div>
  );

  return (
    <>{style && content} 
      {/* {<Popover content={style && content} title="Text" trigger="click">
        {children}
      </Popover>} */}
    </>
  );
}

export default Text;