

import { PlusOutlined } from "@ant-design/icons";
import ElementList from "./ElementList";
import { Alert, Button, theme } from 'antd';
import { useReducer, useState } from "react";
import { getData, updateData } from "../../../../../../lib/db";

const onCopyElement = async (currentElement, pageId, _id) => {

    if (Array.isArray(currentElement.childNodes)) {
        await Promise.all(currentElement.childNodes.map(async (_uid) => {
            const child = await getData(pageId, _uid);

            await onCopyElement(child, pageId, _id);
            await updateData(_id, child);
        }));
    }
}


export function Elements({ state, dispatch, pageId }) {



    const onDelete = async (index) => {
        try {
            dispatch({ type: 'delete', index });
        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

        }
    }



    async function onAdd(element) {


        dispatch({ type: 'start' });

        try {

            const currentElement = await getData(pageId, element._uid);
            await onCopyElement(currentElement, pageId, state.pageId);
            await updateData(state.pageId, currentElement);

            dispatch({ type: 'add', element });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });

        }

    }

    const {
        token: { colorPrimary, colorPrimaryBg, },
    } = theme.useToken();

    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const buttonStyle = {
        backgroundColor: isDraggingOver ? colorPrimaryBg : 'transparent',
    };

    return <div style={{ padding: 5 }}>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}
        <br />

        <Button
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={(e) => {

                const tag = JSON.parse(e.dataTransfer.getData('text/plain'));

                onAdd({ _uid: tag._uid, name: tag.name })
                setIsDraggingOver(false);


            }} type="dashed" style={{ ...buttonStyle, margin: '10px 0', height: 50, width: '100%', textAlign: 'center' }}>
            Drop Here <PlusOutlined />
        </Button>

        <br />
        <br />
        <ElementList
            state={state}
            onDelete={onDelete}
        />


    </div>

};



