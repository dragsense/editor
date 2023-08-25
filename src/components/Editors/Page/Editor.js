import React, { useEffect, useState, useRef } from "react";
import { Spin, Alert, Layout } from "antd";
import { usePageStates } from "./PageProvider";
import Elements from './Elements';
import IFrame from "./Iframe";

import { RightPanelComponent, LeftPanelComponent } from "./Panel";
import CanvasEditor from "../Canvas";

import { EditorNav } from '../../Nav';

const { Content } = Layout;


export default function Editor({ children, _id, pageType, onBack }) {

    const [windowWidth, setWindowWidth] = useState("100%");

    const [minMax, setMinMax] = useState('');
    const [orientation, setOrientation] = useState("");

    const { state,
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
        onChange,
        onEdit } = usePageStates();

    useEffect(() => {
        onChangeMedia(minMax, orientation, windowWidth);
    }, [minMax, orientation, windowWidth])



    return <>

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
            onBack={onBack}
            setWindowWidth={setWindowWidth} >
            <Layout style={{ marginTop: 0, minHeight: 'calc(100vh - 56px)' }}>
                <LeftPanelComponent />

                <Content>

                    {(!state.page && state.loading) && <Alert style={{ margin: '10px' }} message="Please Select the Page Or Component" />}
                    {state.error && <Alert message={state.error} style={{ margin: '10px' }} type="error" showIcon closable />}


                    <CanvasEditor windowWidth={windowWidth} setWindowWidth={setWindowWidth}>

                        <IFrame
                            _id={_id} pageType={pageType}
                            onLoad={onEdit} node={state.node}
                            onClickElement={onClickElement}
                            onMove={onMove}
                            onDelete={onDelete}
                            onCopy={onCopy}
                            onChange={onChange}
                            onAdd={onAdd}
                            state={state}
                            onUpdateSelector={onUpdateSelector}
                            onUpdate={onUpdate}
                        >

                            {state.page &&
                                <Elements page={state.page}
                                    onUpdateStates={onUpdateStates}
                                    pageUpdated={state.pageUpdated}
                                    loading={state.loading} />
                            }

                        </IFrame>


                    </CanvasEditor>

                </Content>

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

            </Layout>

        </EditorNav>



        {state.loading && <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1
        }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >

        </div>}
        <Spin size="small" spinning={state.loading}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',

                transform: 'translate(-50%, -50%)'
            }}
        >
        </Spin>

    </>



};

