
import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined, SettingOutlined } from '@ant-design/icons';
import { Modal, theme, Button, Tabs } from 'antd';

import Draggable from 'react-draggable';

import { ToolBarButton } from "./ToolBar";


import { usePageStates } from "../PageProvider"

import Element from '../Panel/RightPanel/Setting/Element';
import Collection from '../Panel/RightPanel/Setting/Collection';
import Component from '../Panel/RightPanel/Setting/Component';
import Content from '../Panel/RightPanel/Setting/Content';
import Styling from '../Panel/RightPanel/Setting/Styling';

const tagKeys = {
    "texts" : ['1', '3'],
    "layout" : ['7', '2', '3'],
    "inputs" : ['1', '3'],
    "media" : ['2','3']
}

const { TabPane } = Tabs;


export function ModalElements({ }) {

    const { state, onUpdate } = usePageStates();

    const [menuKeys, setMenuKeys] = useState([]);

    useEffect(() => {

        if(!state.element)
        return;

        setMenuKeys(tagKeys[state.element.type])


    }, [state.element])

    return (<Tabs
        defaultActiveKey="1" tabBarStyle={{ padding: 5 }}>

        <TabPane tab={<span>
            Setting
        </span>} key="1">
            <div>
                {state.element && <Element element={state.element} onUpdate={onUpdate} />}
            </div>
        </TabPane>

        <TabPane tab={<span>
            Content
        </span>} key="2">
            <div>
                {state.element && <Content element={state.element} onUpdate={onUpdate} />}

            </div>
        </TabPane>

        <TabPane tab={<span>
            Styling
        </span>} key="3">
            <div>
                {state.element && <Styling menuKeys={menuKeys} element={state.element} onUpdate={onUpdate} />}

            </div>
        </TabPane>

        <TabPane tab={<span>
            Component
        </span>} key="4">
            <div>
                {state.element && <Component element={state.element} onUpdate={onUpdate} />}
            </div>
        </TabPane>

        <TabPane tab={<span>
            Collection
        </span>} key="5">
            <div>
                {state.element && <Collection element={state.element} onUpdate={onUpdate} />}
            </div>
        </TabPane>

    </Tabs>
    );
};


function ElementModal() {

    const draggleRef = useRef(null);


    const {
        token: { colorPrimary, colorBgElevated },
    } = theme.useToken();

    const [tag, setTag] = useState('');


    const onSelect = (tag) => {
        setTag(tag)
    }

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });

    const showModal = () => {

        setOpen(true);
    };


    const onCancel = () => setOpen(false);


    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return <>

        <ToolBarButton type="dashed" onClick={showModal}>
            <SettingOutlined
                style={{ fontSize: "14px" }}

            /> </ToolBarButton>

        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}

                    onFocus={() => { }}
                    onBlur={() => { }}

                >
                    <DragOutlined />
                </div>
            }
            open={open}
            closable
            onCancel={onCancel}

            footer={
                <div style={{ padding: 5 }}>
                    <Button onClick={onCancel}>Cancel</Button>

                </div>
            }

            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>
                        {modal}
                    </div>
                </Draggable>
            )}


        >

            <div style={{ overflow: 'auto' }}><ModalElements />
            </div>
        </Modal>



    </>

}

export default ElementModal;