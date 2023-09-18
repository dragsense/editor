import React, { useCallback } from "react";
import { Button, Tooltip } from "antd";
import { MdUndo, MdRedo } from "react-icons/md";
import BreakPoints from "../../BreakPoint";
import { Link } from 'react-router-dom';
import { EyeFilled, EyeOutlined } from "@ant-design/icons";

// Splitting the code into smaller sub-components for better readability and maintainability
const NavigationButtons = ({ undo, redo }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tooltip placement="bottom" title="Undo">
            <Button
                icon={<MdUndo size={20} />}
                onClick={(e) => { e.preventDefault(); undo(); }}
            >  </Button>
        </Tooltip>

        <Tooltip placement="bottom" title="Redo">
            <Button
                icon={<MdRedo size={20} />}
                onClick={(e) => { e.preventDefault(); redo(); }}
            >  </Button>
        </Tooltip>
    </div>
);

const EditorNav = ({
    onBack,
    undo,
    redo,
    windowWidth,
    setWindowWidth,
    previewMode,
    setPreviewMode,
    minMax,
    setMinMax,
    onSubmit,
    state,
    orientation,
    setOrientation,
    children
}) => {

    // Using useCallback to avoid unnecessary re-renders
    const handleBackClick = useCallback(async (e) => {
        e.preventDefault();
        if (state.isChange) {
            const shouldSave = await window.autocode.checkUnsavedChanges(state.isChange);

            if (shouldSave === 0) {
                await onSubmit();
            }

            if (shouldSave === 2) {
                return;
            }

        }

        // Navigate back
        onBack();
    }, [onBack, onSubmit, state.isChange]);

    return (<>

        <div style={{
            display: 'flex',
            justifyContent: ' space-between',
            alignItems: 'center',
            width: '100%',
            padding: '5px 20px'
        }}>

            <img src="./images/logo/nav-logo.png" width="50" alt="autocode-logo" />

            <BreakPoints windowWidth={windowWidth} setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation} />

            <NavigationButtons undo={undo} redo={redo} />

            <div>

                <Tooltip title="Preview Page">
                    <Button type="text"
                        style={{ marginRight: 20 }}
                        onClick={async () => {

                            if (!state.isChange)
                                setPreviewMode(!previewMode);

                        }}
                        disabled={state.isChange}
                        icon={previewMode ? <EyeFilled /> : <EyeOutlined />}>

                    </Button>
                </Tooltip>
                {!previewMode && <Button type="dashed" style={{ marginRight: 10 }}

                    loading={state?.loading}
                    onClick={handleBackClick}>Back</Button>}

                <Button type="primary"
                    disabled={!state?.isChange && !previewMode}
                    loading={state?.loading}
                    onClick={(e) => { e.preventDefault(); onSubmit(previewMode) }}>{!previewMode ? 'Save' : 'Publish'}</Button>
            </div>
        </div>

        {children}
    </>
    );

};

export const EditorStyleNav = ({
    undo,
    redo,
    windowWidth,
    setWindowWidth,
    minMax,
    setMinMax,
    orientation,
    setOrientation, }) => {

    return (<>

        <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
        }}>

            <BreakPoints windowWidth={windowWidth} setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation} />

            <NavigationButtons undo={undo} redo={redo} />
        </div>

    </>
    );

};


export default EditorNav;
