import { Form, Space, Input, Button, message, Cascader, Select, } from "antd";
import { useState, useReducer, useEffect } from "react";
import { debounce, throttle } from '../../../../../../../lib/utils';


import DocumentServices from "../../../../../../../lib/services/documents";

const initial = {
    documents: [],
    loading: false
}

const { Option } = Select;

const reducer = (state, action) => {


    switch (action.type) {
        case "start":
            return { ...state, loading: true }

        case "documents":
            return { ...state, documents: action.data, }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function AddFilter({
    current,
    setCurrent,
    onAdd,
    componentStates,
    documentStates,
    relationships,
    withRelationship = false }) {


    const [newFilter, setNewFilter] = useState(current);
    const [documentSeacrh, setDocumentSeacrh] = useState('');
    const [states, dispatch] = useReducer(reducer, initial);


    const loadDocuments = async () => {
        try {

            dispatch({ type: 'start' });


            const promises = relationships.map(relationship => {
                return DocumentServices.search(relationship, documentSeacrh);
            });

            const results = await Promise.all(promises);

            const documents = results.map(result => result.documents);

            dispatch({ type: 'documents', data: documents });


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }


    useEffect(() => {

        if (!documentSeacrh || !Array.isArray(relationships))
            return;


        const delayedLoadDocuments = debounce(() => {
            throttle(loadDocuments(), 500);
        }, 500);

        delayedLoadDocuments();


    }, [documentSeacrh]);

    const onChangeFilterKey = (keys) => {

        if (keys === undefined || keys[0] === undefined)
            setNewFilter({})
        else {
            const key = [...keys];
            const first = key[0];
            key.shift()
            setNewFilter({ ...newFilter, filterKey: key, type: first })
        }
    }


    const onChangeTriggerKey = (keys) => {


        if (newFilter) {

            if (keys === undefined || keys[0] === undefined) {
                setNewFilter({ ...newFilter, triggerType: undefined, triggerKey: [] });
            } else {
                const value = [...keys];
                value.shift();
                setNewFilter({ ...newFilter, triggerType: keys[0], triggerKey: value })
            }
        }
    }


    const onChangeFilterDefaultRelationships = (e, options) => {


        if (newFilter && options) {

            newFilter.defaultRelationshipsFilter = options.map(val => { return { _id: val._id, name: val.label } });

            setNewFilter({ ...newFilter });

        }

    }


    const onChangeFilterName = (e) => {

        if (newFilter) {
            let value = e.target.value;
            setNewFilter({ ...newFilter, name: value })
        }

    }


    const onChangeFilterDefault = (e) => {

        if (newFilter) {
            let value = e.target.value;
            setNewFilter({ ...newFilter, defaultValue: value });
        }

    }



    const onSubmit =
        async (e) => {
            e.preventDefault();

            await onAdd(newFilter);

        }

    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}

            {menu}
        </>
    }


    return (
        <>
            <Form.Item label="Filter Name" >
                <Input placeholder="Name"
                    onChange={onChangeFilterName}
                    value={newFilter?.name}
                    disabled={newFilter?.editMode}
                    required />
            </Form.Item>
            <Form.Item label="Filter Key" >
                <Cascader options={documentStates}
                    value={newFilter ?
                        [newFilter.type,
                        ...(Array.isArray(newFilter.filterKey) ? newFilter.filterKey : [])] : [undefined]}
                    onChange={onChangeFilterKey} style={{ width: '100%' }}>
                </Cascader>
            </Form.Item>
            {newFilter?.type && <>


                <Form.Item label="Default Value" >

                    {newFilter.type == '__relationship__' && withRelationship ? <Select
                        style={{ width: '100%' }}
                        placeholder="Select Relationship"
                        showSearch
                        clearIcon
                        mode="multiple"
                        onChange={onChangeFilterDefaultRelationships}
                        onSearch={(v) => {

                            if (!states.loading)
                                setDocumentSeacrh(v)
                        }
                        }
                        dropdownRender={dropdownRender}
                        optionFilterProp="label"
                        value={Array.isArray(newFilter.defaultRelationshipsFilter) ? newFilter.defaultRelationshipsFilter.map(val => val._id) : []}
                    >
                        {Array.isArray(newFilter.defaultRelationshipsFilter) &&
                            newFilter.defaultRelationshipsFilter.map((relationship, index) => <Option
                                key={index} disabled
                                value={relationship._id}
                                label={relationship.name}>{relationship.name}</Option>)}

                        <Option value="" label="">All</Option>

                        {states.documents.map(document => <Option key={document._id} value={document._id} label={document.name}>{document.name}</Option>)}
                    </Select> : <Input placeholder="Value"
                        onChange={onChangeFilterDefault}
                        value={newFilter.defaultValue}
                        required />}


                </Form.Item>



                <Form.Item label="Trigger Key" >
                    <Cascader options={componentStates}
                        value={[newFilter.triggerType,
                        ...(Array.isArray(newFilter.triggerKey) ? newFilter.triggerKey : [])]}
                        onChange={onChangeTriggerKey} style={{ width: '100%' }}>
                    </Cascader>
                </Form.Item>


            </>
            }
            <div style={{ textAlign: 'right' }}>

                <Button type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>   &nbsp;
                <Button type="primary" onClick={onSubmit} disabled={!newFilter.name || !newFilter.type}> Add </Button> </div>

        </>

    );
};

