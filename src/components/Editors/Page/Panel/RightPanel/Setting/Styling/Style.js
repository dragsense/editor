

import { Button, Input, Card, Divider, Alert, message, } from "antd";
import { useState, useCallback, useReducer, useEffect, useMemo } from "react";


import RigthSideBar from "../../../../../Style/Editor/RightSideBar";


import {

    updateStyleData, searchSelector, deleteData, STYLE_STORE_NAME
} from '../../../../../../../lib/db';




export default function Style({
    menuKeys,
    state,
    onChange,
    onDeleteSelector,
    onSelectSelector,
    onUpdateSelector }) {


    // useEffect(() => {

    //     if (!state.node)
    //         return;


    //     const fetchSelector = async () => {

    //         // if (state.selector)
    //         //     await onUpdateSelector(state.selector);

    //         const style = state.node.style;


    //         let selector = null;
    //         if (style) {

    //             if (!style[state.media || 'normal'])
    //                 style[state.media || 'normal'] = {};

    //             selector = {
    //                 selectorText: state.node.selector,
    //                 properties: style[state.media || 'normal'].properties
    //             }
    //         }


    //         return selector;
    //     }

    //     fetchSelector().then(sel => onSelectSelector(state.node.selector, ""));

    // }, [state.node, state.media])




    const onDelete = async () => {

        if (!state.selector) {
            message.error('Selector not found!')
            return;
        }

        if (state.selector.selectorText === state.node.selector) {
            message.error("Sorry this selector can't be delete!");
            return;
        }

        const selector = state.selector;
        await onDeleteSelector(selector);



    };

    const onReset = async () => {
        await onUpdateSelector({ ...state.selector, properties: {} });
    }



    const onSelect = async (newSelector, elementstate = '') => {
        await onSelectSelector(newSelector, elementstate);
    };



    return <>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


        <RigthSideBar
            state={state}
            onSelect={onSelect}
            onDelete={onDelete}
            onReset={onReset}
            onChange={() => onChange(true)}
            width={'100%'}
            mode={"light"}
            menuKeys={menuKeys}
        >
            <div style={{ textAlign: 'right', margin: 10 }}>
                <Button type="primary" disabled={!state.isStyleChange}
                    onClick={() => onUpdateSelector(state.selector)}
                >Update</Button>
            </div>

        </RigthSideBar>



    </>

}

