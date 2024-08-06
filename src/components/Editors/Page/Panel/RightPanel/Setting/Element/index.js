import { Button, Divider, Card } from "antd";
import { useState, useEffect, Children } from "react";
import ElementSetting from "./Setting";
import ElementCondition from "./Condition";
import ElementAttribute from "./Attributes";
import ElementMapping from "./Map";
import ElementEvent from "./Event";
import ElementWrapping from "./Wrapper";

// Function to update the state node
const updateStateNode = (state, settingState, settingOptionState) => {
  for (const key in settingState) {
    state.node[key] = settingState[key];
  }

  for (const key in settingOptionState) {
    if (key == "attributes")
      state.node["childAttributes"] = settingOptionState[key];
    else state.node[key] = settingOptionState[key];
  }

  return state.node;
};

export default function Element({ state, onChange, onUpdate, cascaderStates }) {
  const [settingState, setSettingState] = useState({ attributes: {} });
  const [settingOptionState, setSettingOptionState] = useState({
    attributes: {},
  });

  const [isChange, setIsChange] = useState(false);

  // useEffect to handle changes
  useEffect(() => {
    if (!isChange) return;
    onChange(false);
  }, [isChange]);

  const updateNodeAttributes = (node) => {
    if (!node) return;

    // Initialize node attributes if not already present
    if (!node.attributes) {
      node.attributes = {};
    }

    // Initialize child attributes if not already present
    if (!node.childAttributes) {
      node.childAttributes = {};
    }

    // Update the setting state and setting options state
    setSettingState({ ...node, mainClass: node.className });
    setSettingOptionState({ attributes: node.childAttributes });
  };

  // Effect to handle changes in state.node
  useEffect(() => {
    updateNodeAttributes(state.node);
  }, [state.node]);

  // Effect to handle additional logic when isChange is true
  useEffect(() => {
    if (state.isChange) {
      updateNodeAttributes(state.node);
    }
  }, [state.isChange]);

  const onElementUpdate = async () => {
    const updatedNode = updateStateNode(
      state,
      settingState,
      settingOptionState
    );
    onUpdate(updatedNode);
    setIsChange(false);
  };

  return state.node ? (
    <>
      <Divider orientation="center" orientationMargin="0">
        Tag: {state.node.tagName}{" "}
      </Divider>

      <Card>
        <div style={{ maxHeight: "62vh", overflow: "auto" }}>
          <ElementSetting
            cascaderStates={cascaderStates}
            setIsChange={setIsChange}
            state={settingState}
            setState={setSettingState}
          />

          <Divider orientation="center" orientationMargin="0">
            Custom Attributes:{" "}
          </Divider>
          <ElementAttribute
            cascaderStates={cascaderStates}
            setIsChange={setIsChange}
            state={settingState}
            setState={setSettingState}
          />

          {settingState.tagName === "select" && (
            <>
              <Divider orientation="center" orientationMargin="0">
                Options Attributes:{" "}
              </Divider>
              <ElementAttribute
                cascaderStates={cascaderStates}
                setIsChange={setIsChange}
                state={settingOptionState}
                setState={setSettingOptionState}
              />
            </>
          )}

          <Divider orientation="center" orientationMargin="0">
            Events:{" "}
          </Divider>
          <ElementEvent
            cascaderStates={cascaderStates}
            setIsChange={setIsChange}
            state={settingState}
            setState={setSettingState}
          />
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
