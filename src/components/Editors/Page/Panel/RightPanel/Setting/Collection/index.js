
import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementCollection from './ElementCollection';

import { getAllData, storePage } from "../../../../../../../lib/db";


export default function Collection({ state, onUpdate, cascaderStates }) {

    const [collectionState, setState] = useState(null);
    const [isChange, setIsChange] = useState(false);

    const fetchCollection = async () => {
        const _id = state.page._id;
        const node = await getAllData(_id);

        if (!node) {
            setState({});
        }
        if (node.attached) {
            const collection = await getAllData(node.attached);

            if (!node.collStates)
                node.collStates = {}

            if (collection) {
                setState({
                    ...node.collStates,
                    relationships: collection.populatedRelationships,
                    states: undefined
                });
            }
        }

    }


    useEffect(() => {
        fetchCollection();
    }, []);


    const onElementUpdate = async () => {

        if (!collectionState)
            return;

        const _id = state.page._id;
        const element = await getAllData(_id);

        if (element) {
            element["collStates"] = { ...collectionState };
            await storePage(element);
        }

        if (state.states['COLLECTION'])
            state.states['COLLECTION'].setStates(collectionState);
        setIsChange(false);
    }

    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>


        <Card>
            <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
                {collectionState ? <ElementCollection
                    cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={collectionState}
                    setState={setState} /> :
                    <span>Collection not attached.</span>}
            </div>
            <Divider orientation="center" orientationMargin="0"></Divider>

            <div style={{ textAlign: 'right' }}>
                <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
            </div>
        </Card>


    </>
        : <span>Please Select the node</span>
}