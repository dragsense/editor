import { Button, Divider, Card } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import ElementForm from './ElementForm';
import { getAllData } from "../../../../../../../lib/db";

// Memoized function to fetch form data
const useFetchForm = (pageId) => {
    const [formState, setFormState] = useState({});

    useEffect(() => {
        const fetchForm = async () => {
            const node = await getAllData(pageId);

            if (!node || node.type !== 'form')
                return;

            setFormState({ ...node });
        }

        if(pageId) {
            fetchForm();
        }
    }, [pageId]);

    return formState;
}

export default function Form({ state, cascaderStates }) {
    // Destructure page from state
    const { page } = state;

    // Use memoized function to fetch form data
    const formState = useFetchForm(page?._id);

    // Render form if formState is valid
    return (formState._id && formState.type === 'form') ? <> 
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card><ElementForm  state={formState}  />
            </Card>
        </div>
      
    </>
        :  <>  
        <Card>Please Select the form.</Card>

        </>
}
