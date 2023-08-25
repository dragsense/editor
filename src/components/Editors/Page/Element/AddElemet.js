
import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import { Modal, theme, Button } from 'antd';

import Draggable from 'react-draggable';

import { TagComponent } from '../Panel/LeftPanel/Tag';


import { ToolBarButton } from "./ToolBar";
import Table from './Table'
import Columns from './Columns';



function AddElement({ onAddElement, currentElement, setCurrentElement }) {

    const draggleRef = useRef(null);
    const [cols, setCols] = useState({});

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

    useEffect(() => {

        if (currentElement?.dataset)
            showModal();
        else
            setOpen(false);

    }, [currentElement]);


    const showModal = async () => {

        console.log(currentElement)

        if (currentElement.layout.toLowerCase() === 'ul' || currentElement.layout.toLowerCase() === 'ol') {
            await onAddElement({ tag: 'li' }, false, currentElement);
            onCancel();
        }
        else
            setOpen(true);
    };
    const onAddBefore = async (e) => {
        let status = false;

        if (tag) {
            status = await onAddElement(tag, true, currentElement);
        }
        onCancel();

    };

    const onAdd = async (e) => {

        let status = false;

        if (tag) {

            status = await onAddElement(tag, false, currentElement);
        }

        onCancel();


    }



    const onCancel = () => {
        setCurrentElement({});
    };



    const onSaveTable = async (e) => {

        let status = false;

        status = await onAddElement({}, 1, currentElement, true);

        setOpen(!status);
    };

    const onSaveCols = async (e) => {


        for (let i = 0; i < cols.count; i++) {
            await onAddElement({ tag: 'div', type: 'layout', layout: "fg-child", width: cols.widths[i] }, undefined, currentElement);
        }


        onCancel();

    };

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
            width="450px"
            footer={
                <div style={{ padding: 5 }}>
                    <Button onClick={onCancel}>Cancel</Button>
              
                    {/* {currentElement.layout == 'table' ? <Button type="primary" onClick={onSaveTable}>Save</Button>*/}
                    {currentElement.layout === 'Flex' || currentElement.layout === 'Grid' ?

                        <Button type="primary" onClick={onSaveCols}>Add</Button>
                        :
                        <>
                            <Button onClick={onAddBefore}>Before</Button>
                            <Button type="primary" onClick={onAdd}>Append</Button>

                        </>}
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

            <div style={{ height: '60vh', overflow: 'auto' }}>

                {/* {currentElement.layout == 'table' ? <Table onSelect={onSelect} element={currentElement} /> : */}
                    {currentElement.layout === 'Flex' || currentElement.layout === 'Grid' ?
                        <Columns setCols={setCols} />
                        : 

                <TagComponent
                    onSelect={onSelect}
                    tag={tag}
                    width={'100%'}
                    gridStyle={{ width: '100%', textAlign: 'center' }} />}
            </div>
        </Modal>



    </>

}

export default AddElement;