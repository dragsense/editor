import { Form, Select, Divider, Card } from "antd";
import { QuestionCircleFilled } from '@ant-design/icons';
import { useState, useCallback, useEffect } from "react";

const { Option } = Select;

import { useDrag } from 'react-dnd';

import { MdDragIndicator } from 'react-icons/md'

import AddFormTypes from './AddFormTypes'

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'email', label: 'EMAIL' },
    { value: 'tel', label: 'TEL' },
    { value: 'password', label: 'PASSWORD' },
    { value: 'select', label: 'SELECT' },
    { value: 'file', label: 'FILE' },
    { value: 'radio', label: 'RADIO GROUP' },
    { value: 'checkbox', label: 'CHECKBOX GROUP' },
    { value: 'range', label: 'RANGE' },
    { value: 'url', label: 'URL' },
    { value: 'time', label: 'TIME' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'week', label: 'WEEK' },
    { value: 'hidden', label: 'HIDDEN' },
    { value: 'textarea', label: 'TEXTAREA' },

];


export default function AddState({ state, onChangeState }) {


    const [{ isDragging, opacity }, drag, dragPreview] = useDrag({
        item: () => { return { state } },
        type: 'formItem',
        end: (item, monitor) => {

        },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            isDragging: monitor.isDragging()
        }),
    });

    return (
        <>

            <Form layout="vertical">


                <Divider orientation="left" orientationMargin="0">

                    <span ref={drag} style={{
                        cursor: 'grab', display: 'inline-flex',
                        alignItems: 'center'
                    }}><MdDragIndicator size={23} />
                        {`[${state.key}]`} </span></Divider>


                <AddFormTypes state={state} onChangeState={onChangeState} />



            </Form>



        </>


    );
};

