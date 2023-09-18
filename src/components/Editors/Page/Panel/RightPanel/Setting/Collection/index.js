import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementCollection from './ElementCollection';

import { getAllData, storePage } from "../../../../../../../lib/db";

// Function to fetch collection data
const fetchCollectionData = async (_id) => {
    const node = await getAllData(_id);
    let collectionState = {};

    if (node && node.attached) {
        const collection = await getAllData(node.attached);
        if (collection) {
            collectionState = {
                _id: collection._id,
                ...node.collStates,
                relationships: collection.populatedRelationships,
                states: undefined
            };
        }
    }
    return collectionState;
}

// Function to update element
const updateElement = async (_id, collectionState) => {
    const element = await getAllData(_id);
    if (element) {
        element["collStates"] = { ...collectionState };
        await storePage(element);
    }
}

export default function Collection({ state, onChange, cascaderStates }) {

    const [collectionState, setState] = useState({});
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const _id = state.page._id;
            const collectionData = await fetchCollectionData(_id);
            setState(collectionData);
        }
        fetchData();
    }, []);

    const onElementUpdate = async () => {
        if (!collectionState)
            return;

        const _id = state.page._id;
        await updateElement(_id, collectionState);

        if (state.states['COLLECTION'])
            state.states['COLLECTION'].setStates(collectionState);
        setIsChange(false);
        onChange(true)
    }

    return collectionState._id ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.name} </Divider>


        <Card>
            <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
                 <ElementCollection
                    cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={collectionState}
                    setState={setState} /> 
            </div>
            <Divider orientation="center" orientationMargin="0"></Divider>

            <div style={{ textAlign: 'right' }}>
                <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
            </div>
        </Card>


    </>
        :  <>  
        <Card>Collection not attached.</Card>

        </>
}
