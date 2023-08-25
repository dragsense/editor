import { useState, useEffect, useReducer, useMemo } from "react";
import { message, Select, Form, Checkbox, Button, Popconfirm, Divider, InputNumber, Input, Radio } from "antd";
import { debounce, throttle } from '../../../../../../../lib/utils';

import {

    PlusOutlined,
    MinusCircleOutlined,
    EditOutlined
} from '@ant-design/icons';


import DocumentServices from "../../../../../../../lib/services/documents";

import AddFilter from './AddFilter';

const initial = {
    documents: [],
    collection: null,
    document: null,
    relationship: null,
    loading: false
}
const { Option } = Select;


const reducer = (state, action) => {


    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "documents":
            return { ...state, documents: action.data, }
        case "collection":
            return { ...state, collection: action.data, }
        case "relDocument":
            return { ...state, relDocument: action.data, }
        case "document":
            return { ...state, document: action.data, }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function ElemnetCollection({
    state,
    setState,
    cascaderStates,
    setIsChange }) {

    const [current, setCurrent] = useState(null);


    const [states, dispatch] = useReducer(reducer, initial);
    const [componentStates, setComponentStates] = useState([]);
    const [documentStates, setDocumentStates] = useState([]);

    const [documentSeacrh, setDocumentSeacrh] = useState('');


    useEffect(() => {

        if (!cascaderStates)
            return;

            const extractedChildren = cascaderStates
            .filter(state => state.type === 'STATES' || state.type === 'PROPS')
        setComponentStates(extractedChildren);

        const extractedAndFilteredChildren = cascaderStates
            .filter(state => state.type === 'COLSTATES')
            .flatMap(state => {
                const allowedValues = [
                    '_id',
                    'name',
                    'slug',
                    'RELATIONSHIPS',
                    'STATES'
                ];

                return state.children.filter(child =>
                    allowedValues.includes(child.value)
                );
            });

        setDocumentStates(
            extractedAndFilteredChildren
        );


    }, [cascaderStates]);


    const filters = useMemo(() => {

        let _filters = [];

        if (!state.filters)
            return _filters;

        _filters = Object.values(state.filters).map(filter => {
            // const key = filter.type ? [filter.type,
            // ...(Array.isArray(filter.key) ? filter.key : [])] : []
            let defaultValue = filter?.defaultValue;

            // if (key[0] == '__relationship__')
            //     defaultValue = filter.defaultRelationshipsFilter?.map(val => val._id);

            return { key: filter.key, name: filter.name, defaultValue }
        }
        )

        return _filters;

    }, [state.filters]);

    const loadDocuments = async () => {

        try {

            dispatch({ type: 'start' });

            const res = await DocumentServices.searchWithFilters(
                state._id,
                documentSeacrh,
                { filters, selectedRelationships: state.selectedRelationships },
                parseInt(state.page || 1),
                parseInt(state.limit || 25),
                state.sortBy || 'createdAt',
                state.sort || 'acs'
            );

            dispatch({ type: 'documents', data: res.documents });


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }

    }

    useEffect(() => {

        if (!documentSeacrh || !state)
            return;

        const delayedLoadDocuments = debounce(() => {
            throttle(loadDocuments(), 500);
        }, 500);

        delayedLoadDocuments();

    }, [documentSeacrh]);

    const handleLimitChange = (value) => {
        setState({ ...state, limit: value });
        setIsChange(true);

    };

    const handlePageChange = (value) => {
        setState({ ...state, page: value });
        setIsChange(true);


    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        setState({ ...state, sort: sortValue });
        setIsChange(true);


    };

    const handleSortByChange = (value) => {
        setState({ ...state, sortBy: value });
        setIsChange(true);

    };

    const handleLeftRangeChange = (value) => {

        if (!state.pagination)
            state.pagination = {}

        setState({ ...state, pagination: { ...state.pagination, leftRange: value } });
        setIsChange(true);

    };

    const handleRightRangeChange = (value) => {

        if (!state.pagination)
            state.pagination = {}

        setState({ ...state, pagination: { ...state.pagination, rightRange: value } });
        setIsChange(true);

    };

    const handleNearRangeChange = (value) => {

        if (!state.pagination)
            state.pagination = {}

        setState({ ...state, pagination: { ...state.pagination, nearRange: value } });
        setIsChange(true);

    };


    const handleDotsChange = (e) => {


        e.preventDefault();

        const value = e.target.value;

        if (!state.pagination)
            state.pagination = {}

        setState({ ...state, pagination: { ...state.pagination, dots: value } });
        setIsChange(true);

    };


    const onChangeLoadMore = () => {
        setState({ ...state, loadMore: !state.loadMore });
        setIsChange(true);


    };



    const onChangeRelationships = (value, options) => {
        setState({ ...state, selectedRelationships: value });
        setIsChange(true);
    }


    const onChangeDocuments = (value, options) => {

        const docs = options.map(val => { return { _id: val.value, name: val.label } });

        setState({ ...state, docs })

        setIsChange(true);
    }



    const onChangeWithRelationship = () => {

        setState({ ...state, withRelationship: !state.withRelationship });
        setIsChange(true);


    }


    const onAddFilter = (newState) => {

        if (!state.filters)
            state.filters = {}

        newState.key = 'filter_' + newState.name;
        newState.editMode = undefined;
        state.filters[newState.key] = newState;

        setState({ ...state, filters: { ...state.filters } });
        setCurrent(null);
        setIsChange(true);




    }

    const onEditFilter = (key) => {

        if (state.filters[key]) {
            setCurrent({ editMode: true, ...state.filters[key] });
        }


    }

    const onRemoveFilter = (key) => {

        if (state.filters[`${key}`]) {

            delete state.filters[key];

            setState({ ...state, filters: { ...state.filters } });
            setIsChange(true);
        }



    }


    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}

            {menu}
        </>
    }



    return <Form layout="vertical">

        <Divider orientation="left" orientationMargin="0">Current: {state.name} </Divider>

        <Form.Item label="Limit">
            <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={10}
                value={state.limit}
                onChange={handleLimitChange}
            />
        </Form.Item>

        <Form.Item label="Page">
            <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={1}
                value={state.page}
                onChange={handlePageChange}
            />
        </Form.Item>

        <Form.Item label="Sort">
            <Radio.Group onChange={handleSortChange} value={state.sort}>
                <Radio.Button value="asc">Ascending</Radio.Button>
                <Radio.Button value="desc">Descending</Radio.Button>
            </Radio.Group>
        </Form.Item>

        <Form.Item label="Sort By">
            <Select
                style={{ width: '100%' }}
                defaultValue="createdAt" // Replace 'fieldName' with the initial sort field name
                onChange={handleSortByChange}
                value={state.sortBy}
                multiple
            >
                <Option value="_id">_id</Option>
                <Option value="name">Name</Option>
                <Option value="slug">slug</Option>
                <Option value="createdAt">createdAt</Option>
                <Option value="updatedAt">updatedAt</Option>

            </Select>
        </Form.Item>

        <Form.Item label="Load More?">
            <Checkbox onChange={() => onChangeLoadMore()}
                checked={state.loadMore}>Yes</Checkbox>
        </Form.Item>

        {state.relationships && <><Form.Item label="With Relationship" >
            <Checkbox onChange={() => onChangeWithRelationship()}
                checked={state.withRelationship} >Yes</Checkbox>
        </Form.Item>


            {state.withRelationship && <Form.Item label="Relationships">

                <Select
                    style={{ width: '100%' }}
                    placeholder="Select Relationships"
                    showSearch
                    clearIcon
                    onChange={onChangeRelationships}
                    mode="multiple"

                    optionFilterProp="label"
                    dropdownRender={dropdownRender}
                    value={state.selectedRelationships ? state.selectedRelationships : []}

                >

                    <Option value="" label="">NONE</Option>

                    {Array.isArray(state.relationships) &&
                        state.relationships.map(relationship => <Option
                            key={relationship._id}
                            value={relationship._id}
                            label={relationship.name}>{relationship.name}</Option>)}
                </Select>

            </Form.Item>}

        </>
        }



        <Divider orientation="center" orientationMargin="0">Filters: </Divider>
        {current ?
            <AddFilter
                current={current}
                onAdd={onAddFilter}
                setCurrent={setCurrent}
                componentStates={componentStates}
                documentStates={documentStates}
                relationships={state.selectedRelationships}
                withRelationship={state.withRelationship} /> : <>{

                    filters.map((filter, idx) => <div style={{ paddingBottom: 10 }}>
                        <b>Name: {filter.name} </b>
                        <EditOutlined onClick={() => onEditFilter(filter.key)} />  &nbsp;

                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete this filter?"
                            onConfirm={() => onRemoveFilter(filter.key)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <MinusCircleOutlined />
                        </Popconfirm>
                    </div>
                    )}

                <Button type="dashed" onClick={() => setCurrent({})} block icon={<PlusOutlined />}>
                    Add Filter
                </Button> </>
        }

        <Divider orientation="center" orientationMargin="0">Docuemnt: </Divider>

        <Form.Item label="Docuemnts" >

            <Select
                style={{ width: '100%' }}
                placeholder="Select Documents"
                showSearch
                clearIcon
                mode="multiple"
                onChange={onChangeDocuments}
                onSearch={(v) => {

                    if (!states.loading)
                        setDocumentSeacrh(v)
                }
                }
                dropdownRender={dropdownRender}
                value={Array.isArray(state.documents) ? state.documents.map(val => val._id) : []}
                defaultValue={Array.isArray(state.documents) ? state.documents.map(val => val._id) : []}

                optionFilterProp="label"
            >
                {Array.isArray(state.documents) &&
                    state.documents.map((document, index) => <Option
                        key={index} disabled
                        value={document._id}
                        label={document.name}>{document.name}</Option>)}
                <Option value="" label="">All</Option>

                {states.documents.map(document => <Option key={document._id} value={document._id} label={document.name}>{document.name}</Option>)}
            </Select>

        </Form.Item>

        <Divider orientation="center" orientationMargin="0">Pagination</Divider>

        <Form.Item label="Near Range">
            <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={5}
                value={state.pagination?.nearRange}
                onChange={handleNearRangeChange}
            />
        </Form.Item>

        <Form.Item label="Left Range">
            <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={1}
                value={state.pagination?.leftRange}
                onChange={handleLeftRangeChange}
            />
        </Form.Item>

        <Form.Item label="Right Range">
            <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={1}
                value={state.pagination?.rightRange}
                onChange={handleRightRangeChange}
            />
        </Form.Item>

        <Form.Item label="Dots">
            <Input
                style={{ width: '100%' }}
                defaultValue={"..."}
                value={state.pagination?.dots}
                onChange={handleDotsChange}
            />
        </Form.Item>

    </Form>
};