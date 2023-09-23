import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import { Modal, theme, Button } from 'antd';

import Draggable from 'react-draggable';

import { TagComponent } from '../Panel/LeftPanel/Tag';
import { HtmlConvertComponent } from '../Panel/LeftPanel/Convertable';

import { ToolBarButton } from "./ToolBar";
import Table from './Table'
import Columns from './Columns';

import { updateData } from '../../../../lib/db';


// Function to handle the addition of elements
const handleAddElement = async (tag, before, currentElement, onAddElement, elements=[]) => {
    let status = false;
    if (tag) {
        status = await onAddElement(tag, before, currentElement, elements);
    }
    return status;
}

// Function to handle the saving of columns
const handleSaveCols = async (cols, currentElement, onAddElement) => {
    for (let i = 0; i < cols.count; i++) {
        await onAddElement({ tag: 'div', type: 'layout', layout: "fg-child", width: cols.widths[i] }, undefined, currentElement);
    }
}

function AddElement({ onAddElement, currentElement, setCurrentElement }) {

    const draggleRef = useRef(null);
    const [cols, setCols] = useState({});

    const {
        token: { colorPrimary, colorBgElevated },
    } = theme.useToken();

    const [tag, setTag] = useState('');
    const [elements, setElements] = useState([]);


    const onSelect = (tag, elements = []) => {
        setElements(elements);
        setTag(tag);

    }

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });

    useEffect(() => {
        if (currentElement?.dataset) {
            showModal();
        } else {
            setOpen(false);
        }
    }, [currentElement]);

    const showModal = async () => {
        if (['list', 'ul', 'ol'].includes(currentElement.layout.toLowerCase())) {
            await onAddElement({ tag: 'li' }, false, currentElement);
            onCancel();
        } else {
            setOpen(true);
        }
    };


    const onAddBefore = async (e) => {
      
        let status = await handleAddElement(tag, true, currentElement, onAddElement, elements);
        onCancel();
    };

    const onAdd = async (e) => {
        let status = await handleAddElement(tag, false, currentElement, onAddElement, elements);
        onCancel();
        
    }

    const onCancel = () => {
        setCurrentElement({});
        setTag('');
        setElements([]);
    };

    const onSaveTable = async (e) => {
        let status = await onAddElement({}, 1, currentElement, true);
        setOpen(!status);
    };

    const onSaveCols = async (e) => {
        await handleSaveCols(cols, currentElement, onAddElement);
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
            width="650px"
            footer={
                <div style={{ padding: 5 }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    {currentElement.layout === 'Flex' || currentElement.layout === 'Grid' ?
                        <Button type="primary" onClick={onSaveCols} disabled={!cols.count}>Add</Button>
                        :
                        <>
                            <Button onClick={onAddBefore} disabled={!tag}>Before</Button>
                            <Button type="primary" onClick={onAdd} disabled={!tag}>Append</Button>
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
                {currentElement.layout === 'Flex' || currentElement.layout === 'Grid' ?
                    <Columns setCols={setCols} />
                    : <>
                        <TagComponent
                            onSelect={onSelect}
                            tag={tag}
                            HtmlConvertComponent={<HtmlConvertComponent onSelect={onSelect} />}
                            width={'100%'}
                            gridStyle={{ width: '100%', textAlign: 'center' }} />

                    </>
                }
            </div>
        </Modal>
    </>
}

export default AddElement;