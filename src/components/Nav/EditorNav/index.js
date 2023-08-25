
import React from "react";
import { Button, Tooltip } from "antd";
import { MdUndo, MdRedo } from "react-icons/md";
import BreakPoints from "../../BreakPoint";
import { Link } from 'react-router-dom';


const EditorNav = ({
    onBack,
    undo,
    redo,
    windowWidth,
    setWindowWidth,
    minMax,
    setMinMax,
    onSubmit,
    state,
    orientation,
    setOrientation,
    children
}) => {

    const handleBackClick = async (e) => {
        e.preventDefault();
        if (state.isChange) {
          const shouldSave = await window.autocode.checkUnsavedChanges(state.isChange);
    
          if (shouldSave) {
            await onSubmit();
          }
        }
    
        // Navigate back
        onBack();
      };

    return (<>

        <div style={{
            display: 'flex',
            justifyContent: ' space-between',
            alignItems: 'center',
            width: '100%',
            padding: '5px 20px'
        }}>



            <img src="./images/logo/nav-logo.png" width="50" alt="autocode-logo"/>


            <BreakPoints windowWidth={windowWidth} setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation} />

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

            <div>


                <Button type="dashed" style={{marginRight: 10}}
                  
                    loading={state?.loading}
                    onClick={handleBackClick}>Back</Button>

                <Button type="primary"
                    disabled={!state?.isChange}
                    loading={state?.loading}
                    onClick={(e) => { e.preventDefault(); onSubmit() }}>Save</Button>
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
        </div>

    </>
    );

};


export default EditorNav;
