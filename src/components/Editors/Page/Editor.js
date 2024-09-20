// Importing necessary libraries and components
import React, { useEffect, useState, useRef } from "react";
import { Spin, Alert, Layout } from "antd";
import { usePageStates } from "./PageProvider";
import Elements from "./Elements";
import IFrame from "./Iframe";
import PreviewIFrame from "./Iframe/preview";
import { RightPanelComponent, LeftPanelComponent } from "./Panel";
import CanvasEditor from "../Canvas";
import Preview from "./Preview";
import { EditorNav } from "../../Nav";

// Destructuring Content from Layout
const { Content } = Layout;

// Main Editor component
export default function Editor({ children, _id, pageType, onBack }) {
  // State for window width
  const [_pageType, setPageType] = useState(pageType);
  const [windowWidth, setWindowWidth] = useState("100%");

  // State for minMax and orientation
  const [minMax, setMinMax] = useState("");
  const [orientation, setOrientation] = useState("");

  // Using page states
  const {
    state,
    undo,
    redo,
    onClickElement,
    onSubmit,
    onAdd,
    onCopy,
    onDelete,
    onMove,
    onUpdate,
    onDeleteSelector,
    onSelectSelector,
    onUpdateStates,
    onUpdateSelector,
    onChangeMedia,
    onPreview,
    previewMode,
    setPreviewMode,
    onChange,
    onEdit,
  } = usePageStates();

  // Effect to handle media change
  useEffect(() => {
    onChangeMedia(minMax, orientation, windowWidth);
  }, [minMax, orientation, windowWidth]);

  useEffect(() => {
    if (state.type) setPageType(state.type);
  }, [state.type]);



  // Rendering the Editor component
  return (
    <>
      <EditorNav
        undo={undo}
        redo={redo}
        onSubmit={onSubmit}
        state={state}
        minMax={minMax}
        setMinMax={setMinMax}
        setOrientation={setOrientation}
        orientation={orientation}
        windowWidth={windowWidth}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onBack={onBack}
        setWindowWidth={setWindowWidth}
      >
        {state.error && (
          <Alert
            message={state.error}
            style={{ margin: "10px" }}
            type="error"
            showIcon
            closable
          />
        )}

        <Layout
          style={{
            marginTop: 0,
            minHeight: "calc(100vh - 56px)",
          }}
        >
          {!previewMode && <LeftPanelComponent />}
          <Content>
            {!state.page && state.loading && (
              <Alert
                style={{ margin: "10px" }}
                message="Please Select the Page Or Component"
              />
            )}
            <CanvasEditor
              windowWidth={windowWidth}
              setWindowWidth={setWindowWidth}
            >
              <IFrame
                _id={_id}
                pageType={_pageType}
                onLoad={onEdit}
                node={state.node}
                onClickElement={onClickElement}
                onMove={onMove}
                onDelete={onDelete}
                onCopy={onCopy}
                onChange={onChange}
                previewMode={previewMode}
                onAdd={onAdd}
                state={state}
                onUpdateSelector={onUpdateSelector}
                onUpdate={onUpdate}
              >
                {state.page &&
                  (previewMode ? (
                    <Preview
                      page={state.page}
                      loading={state.loading}
                      preview={state.preview}
                    />
                  ) : (
                    <Elements
                      page={state.page}
                      onUpdateStates={onUpdateStates}
                      pageUpdated={state.pageUpdated}
                      pageType={state.type || pageType}
                      loading={state.loading}
                    />
                  ))}
              </IFrame>
            </CanvasEditor>
          </Content>

          {!previewMode && (
            <RightPanelComponent
              onDeleteSelector={onDeleteSelector}
              onUpdateSelector={onUpdateSelector}
              onSelectSelector={onSelectSelector}
              onChange={onChange}
              onMove={onMove}
              onAdd={onAdd}
              onDelete={onDelete}
              onCopy={onCopy}
              onClickElement={onClickElement}
              state={state}
              onUpdate={onUpdate}
            />
          )}
        </Layout>

        {/* {previewMode && <div style={{
                position: 'absolute',
                background: "#fff", opacity: 1,
                top: 115, left: 0, right: 0, bottom: 0
            }}><CanvasEditor windowWidth={windowWidth} setWindowWidth={setWindowWidth}>
                    <PreviewIFrame
                        _id={state.page?._id} 
                        pageType={state.type}
                        onLoad={onPreview}
                        loading={state?.loading}
                    >
                        <Preview page={state.page} loading={state.loading} preview={state.preview} />
                    </PreviewIFrame>
                </CanvasEditor></div>} */}
      </EditorNav>
      {state.loading && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        ></div>
      )}
      <Spin
        size="large"
        spinning={state.loading}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
        }}
      ></Spin>
    </>
  );
}
