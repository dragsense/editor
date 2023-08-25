
import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementForm from './ElementForm';


import { getAllData } from "../../../../../../../lib/db";


export default function Form({ state, cascaderStates }) {

    const [formState, setState] = useState({});


    const fetchForm = async () => {

        const _id = state.page._id;
        const node = await getAllData(_id);

        if (!node)
            return;

        setState({ ...node });
    }


    useEffect(() => {

        if(!state.page)
        return;

        fetchForm();

    }, [state.page]);


    return formState._id ? <> 
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card><ElementForm  state={formState}  />
            </Card>
        </div>
      
    </>
        : <span>Please Select the node</span>
}