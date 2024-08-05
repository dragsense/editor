import React, { Children, useEffect, useRef, useState } from "react";

import {
  Input,
  Form,
  Popover,
  Typography,
  Button,
  Divider,
  Cascader,
  Tooltip,
  Select,
} from "antd";

import Others from "./Others";
import {
  ArrowLeftOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ClassManager from "./ClassManager";

const { Text } = Typography;

const { Option } = Select;

export default function ElementSetting({
  cascaderStates,
  state,
  setState,
  setIsChange,
}) {
  const onChnageAttribute = (key, value) => {
    if (!state.attributes) {
      state.attributes = {};
    }

    state.attributes[key] = state.attributes[key] || { key };

    if (!value && !state.attributes[key].name) {
      onRemove(key);
    } else {
      state.attributes[key].key = key;
      state.attributes[key].value = value;
      
      setState({ ...state });
    }

    setIsChange(true);
  };

  const onRemove = (key) => {
    if (state.attributes[key]) {
      delete state.attributes[key];
    }
    setState({ ...state });
  };

  const onChange = (value, name) => {
    setState({ ...state, [name]: value });

    setIsChange(true);
  };

  // Function to handle state changes
  const onChangeState = (keys) => {
    if (!state.attributes) {
      state.attributes = {};
    }

    state.attributes["href"] = state.attributes["href"] || { key: "href" };

    state.attributes["href"].name = "dynamic-url";
   
    if (keys === undefined || keys[0] === undefined) {
      state.attributes["href"].valueState = undefined;
    } else {
      const value = [...keys];
      value.shift();
      state.attributes["href"].valueState = { key: value, type: keys[0] };
    }
console.log(state.attributes)
    setState({ ...state });
    setIsChange(true);

  };

  const renderCascader = () => {
    const newState = state.attributes["href"] || {};
    return (
      <Cascader
        options={cascaderStates}
        onChange={onChangeState}
        value={[
          newState.valueState?.type,
          ...(Array.isArray(newState.valueState?.key)
            ? newState.valueState.key
            : []),
        ]}
        placeholder="Select State"
        style={{ marginBottom: 10, width: "100%" }}
      />
    );
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Element Tag">
        <Select
          onChange={(value) => {
            onChange(value, "tagName");
          }}
          name="tagName"
          value={state.tagName}
        >
          <Option value="h1">h1</Option>
          <Option value="h2">h2</Option>
          <Option value="h3">h3</Option>
          <Option value="h4">h4</Option>
          <Option value="h5">h5</Option>
          <Option value="h6">h6</Option>
          <Option value="p">p</Option>
          <Option value="div">div</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Name" className="font-500">
        <Text disabled>e.g. Hero Heading</Text>
        <Input
          maxLength={100}
          placeholder="Element Name"
          name="name"
          onChange={(e) => {
            e.preventDefault();

            const value = e.target.value;
            const name = e.target.name;

            onChange(value, name);
          }}
          value={state.name}
        />
      </Form.Item>
      <Form.Item label="Element ID">
        <Text disabled>e.g. 'hero-heading'</Text>

        <Input
          maxLength={200}
          value={state.attributes["id"]?.value}
          name="id"
          placeholder="ID"
          onChange={(e) => {
            e.preventDefault();
            onChnageAttribute("id", e.target.value);
          }}
        />
      </Form.Item>

      {state.tagName == "a" && (
        <>
          <Form.Item label="Custom Link">
            <Text disabled>e.g. 'https://example.com'</Text>

            <Input
              value={state.attributes["href"]?.value}
              placeholder="href"
              name="href"
              onChange={(e) => {
                e.preventDefault();
                onChnageAttribute("href", e.target.value);
              }}
            />
          </Form.Item>
          <Divider orientation="center" orientationMargin="0">
            Dynamic Link{" "}
            <Tooltip
              title={
                " When using dynamic state (values that can be changed), applying it to an element will replace its original value."
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Divider>
          {renderCascader()}
        </>
      )}

      {(state.tagName === "img" || state.tagName === "video") && (
        <Form.Item label="Custom src">
          <Text disabled>e.g. 'https://example.com/src.xyz'</Text>

          <Input
            value={state.attributes["src"]?.value}
            placeholder="src"
            name="src"
            onChange={(e) => {
              e.preventDefault();
              onChnageAttribute("src", e.target.value);
            }}
          />
        </Form.Item>
      )}

      <Popover
        placement="left"
        title={
          <>
            Others <br />
            Note:<em> Use single quotes for string values</em>
          </>
        }
        content={
          <Others
            state={state}
            attributes={state.attributes}
            onChnageAttribute={onChnageAttribute}
            onRemove={onRemove}
          />
        }
        trigger="click"
      >
        <Button type="text" icon={<ArrowLeftOutlined />}>
          {" "}
          More{" "}
        </Button>
      </Popover>
      <br />
      <br />

      <Form.Item label="Mian Class">
        <Input
          maxLength={100}
          value={state.mainClass}
          placeholder="Main Class"
          onChange={(e) => {
            onChange(e.target.value, "mainClass");
          }}
        />
      </Form.Item>

      <Form.Item label="Element Classes">
        <ClassManager
          element={state}
          cascaderStates={cascaderStates}
          setIsChange={setIsChange}
        />
      </Form.Item>
    </Form>
  );
}
