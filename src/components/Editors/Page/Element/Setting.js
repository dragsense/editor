import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Popover } from 'antd';

const { TextArea } = Input;

const Setting = ({ onChange, node, onUpdate, setPopupOpen }) => {
  const [nodeName, setNodeName] = useState('');

  const [idValue, setIdValue] = useState('');
  const [hrefValue, setHrefValue] = useState('');
  const [srcValue, setSrcValue] = useState('');
  const [value, setValue] = useState('');


  useEffect(() => {
    setNodeName(node.name || '');

    setIdValue(node.attributes?.id?.value || '');
    setHrefValue(node.attributes?.href?.value || '');
    setSrcValue(node.attributes?.src?.value || '');

    if (node.type === 'inputs') {
      setValue(node.nodeValue);
    }



  }, [node])

  const handleNameChange = (e) => {
    setNodeName(e.target.value);
    onChange();
  };

  const handleIdChange = (e) => {
    setIdValue(e.target.value);
    onChange();

  };



  const handleHrefChange = (e) => {
    setHrefValue(e.target.value);
    onChange();

  };

  const handleSrcChange = (e) => {
    setSrcValue(e.target.value);
    onChange();

  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    onChange();

  };


  const handleSave = () => {
    node.name = nodeName;


    if (idValue) {
      node.attributes = {
        ...node.attributes,
        id: { key: 'id', value: idValue },
      };
    } else if (node.attributes?.id) {
      delete node.attributes.id;
    }

    if (hrefValue) {
      node.attributes = {
        ...node.attributes,
        href: { key: 'href', value: hrefValue },
      };
    } else if (node.attributes?.href) {
      delete node.attributes.href;
    }

    if (srcValue) {
      node.attributes = {
        ...node.attributes,
        src: { key: 'src', value: srcValue },
      };
    } else if (node.attributes?.src) {
      delete node.attributes.src;
    }

    if (value) {

      if (node.tagName === 'button') {
        node.nodeValue = value;
      }
      else
        node.attributes = {
          ...node.attributes,
          value: { key: 'value', value: value },
        };
    }


    onUpdate(node);

    if (setPopupOpen)
      setPopupOpen(false);
  };

  const content = (
    <Form layout="vertical">
      <Form.Item label="Name" className="font-500">
        <Input
          placeholder="Element Name"
          value={nodeName}
          onChange={handleNameChange}
        />
      </Form.Item>
      <Form.Item label="Element ID">
        <Input
          value={idValue}
          placeholder="ID"
          onChange={handleIdChange}
        />
      </Form.Item>
 
      {node.tagName === 'button' &&
      <Form.Item label="Element Value">
        <TextArea
          value={value}
          placeholder="Value"
          onChange={handleValueChange}
        />
      </Form.Item>}
      {node.tagName === 'a' && (
        <Form.Item label="Custom Link">
          <Input
            value={hrefValue}
            placeholder="href"
            onChange={handleHrefChange}
          />
        </Form.Item>
      )}
      {(node.tagName === 'img' || node.tagName === 'video') && (
        <Form.Item label="Custom src">
          <Input
            value={srcValue}
            placeholder="src"
            onChange={handleSrcChange}
          />
        </Form.Item>
      )}

      <Button type="primary" size="small" onClick={handleSave}>
        Save
      </Button>
    </Form>
  );

  return content;
  // <Popover content={content} title="Setting" trigger="click">
  //   {children}
  // </Popover>

};

export default Setting;