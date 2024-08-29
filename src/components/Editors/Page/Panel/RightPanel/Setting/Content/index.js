import {
  Button,
  Divider,
  Typography,
  Card,
  Tooltip,
  Select,
  Input,
} from "antd";

import { useState, useEffect, Children } from "react";
import ElementContent from "./ElementContent";

import ElementCondition from "../Element/Condition";
import ElementMapping from "../Element/Map";
import { QuestionCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

const { Text } = Typography;

export default function Content({
  state,
  host,
  onUpdate,
  onChange,
  cascaderStates,
}) {
  const [contentState, setContentState] = useState({
    attributes: {},
    conditions: {},
  });
  const [optionState, setOptionState] = useState({ conditions: {} });

  const [isChange, setIsChange] = useState(false);

  const onChangeImportPath = (e) => {
    const value = e.target.value;
    setContentState({ ...contentState, customPath: value });
    setIsChange(true);
  };

  useEffect(() => {
    if (!isChange) return;

    onChange(false);
  }, [isChange]);

  const updateNodeState = (node) => {
    if (!node) return;

    // Initialize node attributes if not already present
    if (!node.attributes) {
      node.attributes = {};
    }

    // Initialize child conditions if not already present
    if (!node.childConditions) {
      node.childConditions = {};
    }

    // Update content and option states
    setContentState({ ...node });
    setOptionState({ conditions: node.childConditions });
  };

  // Effect to handle changes in state.node
  useEffect(() => {
    updateNodeState(state.node);
  }, [state.node]);

  // Effect to handle additional logic when isChange is true
  useEffect(() => {
    if (state.isChange) {
      updateNodeState(state.node);
    }
  }, [state.isChange]);

  const onElementUpdate = async () => {
    for (const key in contentState) {
      state.node[key] = contentState[key];
    }

    for (const key in optionState) {
      if (key == "conditions") state.node["childConditions"] = optionState[key];
      else state.node[key] = optionState[key];
    }

    onUpdate(state.node);
    setIsChange(false);
  };

  return state.node ? (
    <>
      <Divider orientation="center" orientationMargin="0">
        Tag: {state.node.tagName}{" "}
      </Divider>

      <Card>

      <div style={{ textAlign: "right" }}>
          <Button disabled={!isChange} onClick={onElementUpdate} type="primary">
            Update
          </Button>
        </div>

      <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ maxHeight: "62vh", overflow: "auto" }}>
          <Divider orientation="center" orientationMargin="0">
            Custom Component:{" "}
          </Divider>

          <Input
            disabled={state.node.layout !== "div"}
            style={{ width: "100%" }}
            placeholder="Component Component"
            value={contentState.customPath}
            onChange={onChangeImportPath}
          />

          <Divider orientation="center" orientationMargin="0">
            Custom Content:{" "}
          </Divider>

          <ElementContent
            host={host}
            setIsChange={setIsChange}
            cascaderStates={cascaderStates}
            state={contentState}
            setState={setContentState}
          />

          <Divider orientation="center" orientationMargin="0">
            Mapping{" "}
            <Tooltip
              title={
                "Mapping allows looping through the element based on the number of states in the array."
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>{" "}
          </Divider>
          <ElementMapping
            setIsChange={setIsChange}
            cascaderStates={cascaderStates}
            state={contentState}
            setState={setContentState}
          />

          <Divider orientation="center" orientationMargin="0">
            Conditions:{" "}
          </Divider>
          <ElementCondition
            setIsChange={setIsChange}
            cascaderStates={cascaderStates}
            state={contentState}
            setState={setContentState}
          />

          {contentState.tagName === "select" && (
            <>
              <Divider orientation="center" orientationMargin="0">
                Options Conditions:{" "}
              </Divider>
              <ElementCondition
                cascaderStates={cascaderStates}
                setIsChange={setIsChange}
                state={optionState}
                setState={setOptionState}
              />
            </>
          )}
        </div>
        <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ textAlign: "right" }}>
          <Button disabled={!isChange} onClick={onElementUpdate} type="primary">
            Update
          </Button>
        </div>
      </Card>
    </>
  ) : (
    <Card>
      <span>Please Select the node</span>
    </Card>
  );
}
