import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Cascader,
  Image,
  Select,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import ContentEditor from "./ContentEditor";
import MediaModal from "../../../../../../Media";
import Video from "../../../../../../Media/Video";
const { Text } = Typography;
const { Option } = Select;

// Main function
export default function ElementContent({
  cascaderStates,
  host,
  state,
  setState,
  setIsChange,
}) {
  const [mediaModal, setMediaModal] = useState(false);
  const [type, setType] = useState("images");

  const srcs =
    type === "images" ? state.src : [...(state.srcs ? state.srcs : [])];

  // Splitting the main function into smaller functions for better readability and maintainability
  // Function to handle change in content
  const onChange = (content, isActive) => {
    setState((prevState) => ({
      ...prevState,
      nodeValue: content,
      isStateActive: isActive,
    }));
  };

  // Function to handle change in value
  const onChangeValue = (value) => {
    setState((prevState) => {
      if (!prevState.attributes) {
        prevState.attributes = {};
      }
      if (prevState.attributes["type"]?.value !== "'number'")
        prevState.attributes["value"] = { key: "value", value: `'${value}'` };
      else prevState.attributes["value"] = { key: "value", value };
      return { ...prevState };
    });
  };

  // Function to handle change in state
  const onChangeState = (keys) => {
    setState((prevState) => {
      if (keys === undefined || keys[0] === undefined)
        return { ...prevState, state: undefined };
      else {
        const key = [...keys];
        const first = key[0];
        key.shift();
        return { ...prevState, state: { key, type: first } };
      }
    });
    setIsChange(true);
  };

  // Function to handle change in values
  const handleValuesChange = (e) => {
    let values = e.target.value;
    setState((prevState) => ({ ...prevState, options: values }));
  };

  // Function to handle change in label position
  const onChangeLabelPos = (val) => {
    setState((prevState) => ({ ...prevState, labelPos: val }));
    setIsChange(true);
  };

  // Function to handle change in media
  const onChangeMedia = (media) => {
    if (type === "images") {
      setState((prevState) => ({
        ...prevState,
        nodeValue: media[0].src,
        src: media[0],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        srcs: media,
      }));
    }
    setIsChange(true);
  };

  // Function to render form based on state attributes
  const renderForm = () => {
    return renderFormBasedOnType();
  };

  const handleSave = () => {
    setIsChange(true);
  };

  // Function to render form based on type
  const renderFormBasedOnType = () => {
    if (
      ["'checkbox'", "'radio'"].includes(state.attributes["type"]?.value) ||
      state.tagName === "select"
    ) {
      return renderCheckboxRadioSelect();
    } else if (
      state.tagName === "input" &&
      state.attributes["type"]?.value !== "'file'"
    ) {
      return renderInput();
    } else if (state.tagName === "video" || state.tagName === "audio") {
      return renderVideoAudio();
    } else if (state.tagName === "img") {
      return renderImage();
    } else if (state.layout === "text") {
      return renderContentEditor();
    } else
      return (
        <Form.Item label="Enter text">
          <Input.TextArea
            placeholder="Enter value"
            value={state.nodeValue}
            onChange={(e) => {
              e.preventDefault();
              const value = e.target.value;
              onChange(value);
            }}
          />
          <CheckOutlined
            onClick={handleSave}
            style={{
              float: "right",
              color: "green",
              cursor: "pointer",
            }}
          />
        </Form.Item>
      );
  };

  // Function to render checkbox, radio, select
  const renderCheckboxRadioSelect = () => {
    return (
      <>
        {renderOptionValues()}
        {state.tagName !== "select" && renderLabelPosition()}
      </>
    );
  };

  // Function to render option values
  const renderOptionValues = () => {
    return (
      <Form.Item label="Enter option values">
        <Input.TextArea
          placeholder="Enter option values separated by , and separated value and label by | e.g value1|label1,value2|label2"
          value={state.options}
          onChange={handleValuesChange}
          suffix={
            <CheckOutlined
              onClick={handleSave}
              style={{ color: "green", cursor: "pointer" }}
            />
          }
        />
      </Form.Item>
    );
  };

  // Function to render label position
  const renderLabelPosition = () => {
    return (
      <Form.Item label="Label Position">
        <Select
          style={{ width: "100%" }}
          value={state.labelPos}
          onChange={onChangeLabelPos}
        >
          {[
            { label: "Label Before", value: 0 },
            { label: "Label After", value: 1 },
          ].map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  // Function to render input
  const renderInput = () => {
    return (
      <Form.Item label="Enter value">
        <Input
          placeholder="Default Value"
          value={state.attributes["value"]?.value.replace(/^'|'$/g, "")}
          type={
            state.attributes["type"]?.value !== "'submit'"
              ? state.attributes["type"]?.value.replace(/^'|'$/g, "")
              : "text" // Default to 'text' if 'type' is not defined
          }
          onChange={(e) => onChangeValue(e.target.value)}
          suffix={
            <CheckOutlined
              onClick={handleSave}
              style={{ color: "green", cursor: "pointer" }}
            />
          }
        />
      </Form.Item>
    );
  };

  // Function to render video or audio
  const renderVideoAudio = () => {
    return (
      <>
        {renderSrcs()}
        {state.tagName === "video" && renderPoster()}
      </>
    );
  };

  // Function to render srcs
  const renderSrcs = () => {
    return (
      <Form.Item label="srcs:">
        <Button
          onClick={() => {
            setType("videos");
            setMediaModal(true);
          }}
          icon={<UploadOutlined />}
        >
          Upload
        </Button>
        <br />
        <br />
        {Array.isArray(state.srcs) &&
          state.srcs.map((src, index) => (
            <Video
              src={host + src.src}
              alt={src.alt}
              mimetype={src.mimetype}
              duration={3}
            />
          ))}
      </Form.Item>
    );
  };

  // Function to render poster
  const renderPoster = () => {
    return (
      <Form.Item label="Poster">
        <Image
          width="100%"
          onClick={() => {
            setType("images");
            setMediaModal(true);
          }}
          preview={false}
          style={{
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            height: "120px",
            cursor: "pointer",
          }}
          alt="video poster"
          src={host + state.src?.src}
          fallback="./images/default/default-poster.png"
        />
      </Form.Item>
    );
  };

  // Function to render image
  const renderImage = () => {
    return (
      <Form.Item label="Image">
        <Image
          width="100%"
          onClick={() => {
            setType("images");
            setMediaModal(true);
          }}
          preview={false}
          style={{
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            height: "120px",
            cursor: "pointer",
          }}
          alt={state.src?.alt}
          src={host + state.src?.src}
          fallback="./images/default/default-img.png"
        />
      </Form.Item>
    );
  };

  // Function to render content editor
  const renderContentEditor = () => {
    return (
      <Form.Item label="Content" className="font-500">
        <ContentEditor
          cascaderStates={cascaderStates}
          state={state}
          onChange={onChange}
        />
      </Form.Item>
    );
  };

  // Function to render cascader
  const renderCascader = () => {
    return (
      <Cascader
        disabled={state.tagName === "hr"}
        options={cascaderStates}
        onChange={onChangeState}
        value={
          state.state
            ? [
                state.state.type,
                ...(Array.isArray(state.state.key) ? state.state.key : []),
              ]
            : [undefined]
        }
        placeholder="Select State"
        style={{ marginBottom: 10, width: "100%" }}
      />
    );
  };

  // Function to render media modal
  const renderMediaModal = () => {
    return (
      <MediaModal
        open={mediaModal}
        multiple={type === "videos"}
        type={type}
        onClose={() => setMediaModal(false)}
        srcs={srcs}
        onSelect={onChangeMedia}
      />
    );
  };

  return (
    <>
      {renderForm()}
      <Divider orientation="center" orientationMargin="0">
        Dynamic Value{" "}
        <Tooltip
          title={
            " When using dynamic state (values that can be changed), applying it to an element will replace its original content."
          }
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </Divider>
      {renderCascader()}
      {renderMediaModal()}
    </>
  );
}
