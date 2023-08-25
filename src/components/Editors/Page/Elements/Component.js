

import React, { useEffect, forwardRef, useState, useMemo, Children, useCallback } from "react";
import { message } from 'antd';
import ElementMapping from './ElementMapping';

import { InlineSkeleton } from './Elements'
import { getData, storeData, getAllData } from "../../../../lib/db";

import { getStateValue, updateStateValue, generateCascaderCollStates, getStateRef, generateCascader } from '../../../../lib/element/elementNode';
import DocumentServices from '../../../../lib/services/documents'


const generateCollectionStates = async (collection) => {

    const defaultValues = [{ label: '_ID', value: '_id' },
    { label: 'NAME', value: 'name' },
    {
        label: 'SLUG', value: 'slug',
    },
    {
        label: 'CREATOR', value: 'creator',
    },
    {
        label: 'URL', value: 'url',
    },
    {
        label: 'Created At', value: 'createdAt',
        children: [
            { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
            { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
            { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
            { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
            { label: "Month D, YYYY", value: "MMMM D, YYYY" },
            { label: "D MMM, YYYY", value: "D MMM, YYYY" },
            { label: "MMMM DD, YYYY", value: "MMMM DD, YYYY" },
            { label: "DD MMM, YYYY", value: "DD MMM, YYYY" },

        ]
    },
    {
        label: 'SETTING', value: 'SETTING',
        children: [
            {
                label: 'TITLE', value: 'title',
            },
            {
                label: 'DESC', value: 'desc',
            },
            {
                label: 'EXCERPT', value: 'excerpt',
            },
            {
                label: 'CONTENT', value: 'content',
            },
            {
                label: 'IMAGE', value: 'image',
            }
        ]
    }

    ];

    let tempStates = [];
    let relStates = [];
    if (collection.populatedRelationships) {
        await Promise.all(collection.populatedRelationships.map(async (relation, idx) => {


            const current = generateCascader(
                relation.states || {},
                relation.name.toUpperCase(), relation._id);
            tempStates = [...tempStates, ...current];


        }));




        relStates = [
            {
                label: 'POPULATED', value: 'POPULATED',
                children: [...defaultValues, ...tempStates]
            },
            {
                type: 'array', label: 'RELATIONSHIPS', value: 'RELATIONSHIPS',
                children: collection.populatedRelationships.map((rel, idx) => {
                    return {
                        label: rel.name.toUpperCase(),
                        value: rel._id,
                        type: 'relations'
                    }
                })
            },
            {
                type: 'array', label: 'PAGES', value: 'PAGES',
                children: [{ label: 'INDEX', value: 'index' }
                ]
            },
        ];
    }


    const collStates = generateCascaderCollStates({
        docsLength: 0,
        loading: 0,
        maxPage: 0,
        states: collection.states || {},
    }, "COLLECTION", "COLSTATES")



    if (collStates.length > 0) {
        collStates[0].children = [
            ...defaultValues,
            { type: 'array', label: 'DOCUMENTS', value: 'DOCUMENTS' },
            ...collStates[0].children, ...relStates, { label: 'PAGE', value: 'page' },
            { label: 'LIMIT', value: 'limit' }
        ]
    }
    return collStates;


}

const generateFormStates = (form) => {

    let tempStates = [];
    Object.values(form.states).map(async (state, idx) => {

        const current = {
            type: state.type, label: state.key.toUpperCase(), value: state.key,
            children: [
                {
                    label: "KEY", value: 'key',
                },
                {
                    label: 'VALUE', value: 'defaultValue',
                },
                {
                    label: 'ERRORMSG', value: 'errorMessage',
                },
                {
                    label: 'ERROR', value: 'error',
                },
            ]
        }
        tempStates = [...tempStates, current];

    });

    const current = {
        label: 'SETTING', value: '__setting__',
        children: [
            {
                label: "LAODING", value: 'laoding',
            },
            {
                label: 'SUCCESSMSG', value: 'successMessage',
            },
            {
                label: "SUCCESS", value: 'success',
            },
            {
                label: 'ERRORMSG', value: 'errorMessage',
            },
            {
                label: 'ERROR', value: 'error',
            },
        ]
    }
    tempStates = [...tempStates, current];

    const formStates = [{
        type: 'array', label: 'FORM', value: 'FORMSTATES',
        children: [

            ...tempStates]
    }]

    return formStates;

}

const Component = (props) => {

    const { component, node, _states, _setStates, children, _id, onUpdateStates } = props;

    const [states, setStates] = useState({});
    const [loading, setLoading] = useState(false);


    const [colStates, setColStates] = useState({ loading: 0 });
    const [colPanelStates, setPanelColStates] = useState(null);
    const [panelStates, setPanelStates] = useState(null);
    const [isFilterChange, setFilters] = useState(false);


    const loadComponent = async (path) => {
        try {
            setLoading(true)
            const _id = component._id;

            if (_id) {

                const node = await getAllData(_id);
                if (node) {
                    if (node.attached) {
                        const collection = await getAllData(node.attached);

                        if (!node.collStates)
                            node.collStates = {}

                        if (collection) {
                            if (!component.disabled) {
                                const cascaderStates = await generateCollectionStates(collection)

                                onUpdateStates('COLLECTION', cascaderStates, setPanelColStates)
                            }

                            const states = {
                                ...node.collStates,
                                name: collection.name,
                                slug: collection.slug,
                                creator: collection.creator,
                                createdAt: collection.createdAt,
                                url: collection.url,
                                states: collection.states,
                                relationships: collection.populatedRelationships,
                                setting: collection.setting,
                                _id: collection._id
                                , loading: 1
                            }

                            setColStates(states);

                            await laodDocumnents(states);
                        }

                    }
                    setStates({
                        ...node.states,
                        ...(node.type === 'form' ? {
                            __setting__: {
                                successMessage: node.setting?.successMessage,
                                errorMessage: node.setting?.errorMessage,
                                error: 0, success: 0, loading: 0
                            }
                        } : {})
                    });
                    if (!component.disabled) {

                        if (node.type === 'form') {
                            const cascaderStates = generateFormStates(node)
                            onUpdateStates('FORMSTATES', cascaderStates, setPanelStates)

                        } else {
                            const cascaderStates = generateCascader(node.states, 'STATES', 'STATES')
                            onUpdateStates('STATES', cascaderStates, setPanelStates)
                            if (node.parent) {
                                const cascaderStates = generateCascader(node.props || {}, 'PROPS', 'PROPS')
                                onUpdateStates('PROPS', cascaderStates, null)
                            }
                        }
                    }

                }



            }
        } catch (e) {
            message.error(e?.message, "Something was wrong.")
        } finally {
            setLoading(false)

        }

    };


    const getValue = (elem, value = '') => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
            case 'PROPS':
                return getStateValue(key, _states);
            case 'STATES':
                return getStateValue(key, states);
            default:
                return value;
        }

    }


    const filters = useMemo(() => {

        let _filters = [];

        if (!colStates.filters)
            return _filters;


        _filters = Object.values(colStates.filters).map(filter => {
            // const key = filter.type ? [filter.type,
            // ...(Array.isArray(filter.key) ? filter.key : [])] : []
            const type = filter.triggerType;
            const key = filter.triggerKey;
            const value = filter.defaultValue;

            let defaultValue = getValue({ type, key }, value);


            // if (key[0] == '__relationship__')
            //     defaultValue = filter.defaultRelationshipsFilter?.map(val => val._id);

            return { filterKey: [filter.type, ...filter.filterKey], defaultValue: defaultValue || '' }
        }
        )


        return _filters;

    }, [colStates.filters]);


    const laodDocumnents = async (collection) => {
        try {
            const collectionId = collection._id;
            let limit = collection.limit || 10;
            let page = collection.page || 1;
            let sortBy = collection.sortBy || 'createdAt';
            let sort = collection.sort || 'acs';
            let loadMore = collection.loadMore;
            const withRelationship = collection.withRelationship;
            const docs = collection.docs || [];
            const selectedRelationships = collection.selectedRelationships || [];
            const states = collection.states || {};

            let documents = [];
            let maxPage = collection.maxPage || 0;


            if (Array.isArray(docs) && docs?.length > 0) {
                const res = await DocumentServices.getFilteredDocuments(collectionId, { documentIds: docs.map(doc => doc._id), selectedRelationships, withRelationship });

                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

            }
            else {


                const res = await DocumentServices.getAllFilteredDocuments(collectionId,
                    { filters, withRelationship, selectedRelationships },
                    parseInt(page || 1),
                    parseInt(limit || 25),
                    sortBy || 'createdAt',
                    sort || 'acs'
                );
                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

                if (loadMore)
                    documents = [...collection.documents, ...documents];

            }


            setColStates({
                ...collection,
                documents,
                states,
                maxPage,
                loading: 0
            });







        } catch (e) {
            console.log(e?.message)
            setColStates({
                ...collection,
                loading: 0
            });
        } finally {

        }
    }



    useEffect(() => {
        loadComponent();
    }, [])




    useEffect(() => {


        if (filters.length <= 0 && !isFilterChange)
            return;

        //debounce((colStates) => {
        setColStates({ ...colStates, loading: 0 });

        laodDocumnents(colStates);
        // }, 500);

        setFilters(false);


    }, [states])


    useEffect(() => {

        if (!colPanelStates)
            return;
        laodDocumnents({ ...colStates, ...colPanelStates });

    }, [colPanelStates])

    useEffect(() => {

        if (!panelStates)
            return;

        if (!component.disabled) {

            if (node.type === 'form') {
                const cascaderStates = generateFormStates(panelStates, 'FORM', _id)
                onUpdateStates('FORMSTATES', cascaderStates, setPanelStates)

            } else {
                const cascaderStates = generateCascader(panelStates, 'STATES', _id)
                onUpdateStates('STATES', cascaderStates, setPanelStates)
            }
        }

        setStates(panelStates);
    }, [panelStates])



    const setValue = async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;

        const isFilterKey = Object.values(colStates.filters || {}).some(filter => filter.triggerKey === key && filter.triggerType === type);
        setFilters(isFilterKey);

        switch (type) {
            case 'PROPS':
                updateStateValue(elem, withValue, _states, value);
                _setStates({ ..._states });
            case 'STATES':
                updateStateValue(elem, withValue, states, value);
                setStates({ ...states });
            case 'COLLECTION':

                if (key[0] === 'page') {

                    if (isNaN(value))
                        value = colStates.page;

                    const totalPages = Math.ceil(colStates.maxPage / colStates.limit);



                    if (!colStates.loadMore) {
                        const page = { max: totalPages + 1, min: 1, defaultValue: colStates.page }

                        updateStateValue({ key, value: "[withvalue]+[value]" }, withValue, { page }, value);

                        if (page.defaultValue >= totalPages + 1)
                            return;

                        laodDocumnents({ ...colStates, page: page.defaultValue });
                    }
                }

            case 'FORMSTATES':

                if (states[key[0]]) {
                    states[key[0]][key[1]] = value
                    setStates({ ...states });
                }
            default:
        }


    }

    const onSetStates = useCallback(async (key, value, type) => {

        switch (type) {
            case 'PROPS':
                const prop = getStateRef(key, _states)
                if (prop) {
                    prop.defaultValue = value
                    _setStates({ ..._states });
                }
            case 'STATES':
                const state = getStateRef(key, states)
                if (state) {
                    state.defaultValue = value
                    setStates({ ...states });
                }
            default:

        }

    }, [states, _states])

    const onClick = useCallback(async (node, stateValue, withValue) => {

        //const node = await getData(_id, id);
        if (node && node.onClick) {
            const onclick = node.onClick;
            setValue(onclick, stateValue?.value || stateValue, withValue?.value || withValue);
        }

    }, [states, colStates])

    const onChange = useCallback(async (node, value, all = false) => {

        //const node = await getData(_id, id);
        setValue(node.onChange, value, '');

        if (node && node.state) {


            if (all && node.map) {

                if (value.includes('all')) {
                    const maKey = node.map.key;
                    const mapType = node.map.type;
                    let map = null;
                    if (mapType == 'STATES')
                        map = getStateRef(maKey, states);
                    else
                        map = getStateRef(maKey, states);

                    if (map) {
                        const states = Object.values(map.states).map((val) => val.split(":")[0]);
                        let options = node.options.split(",");
                        options = Object.values(options).map((val) => val.split(":")[0]);
                        value = [...(new Set([...options, ...states]))].join(',');

                    }
                } else
                    value = ''
            }


        }

    }, [states])


    const onSubmit = useCallback((states) => {
        setStates({ ...states });
    }, [states])


    return <span style={{ border: '#ff7875 solid 1px', display: 'inline-block', width: '-webkit-fill-available' }}
        data-name={`${component.disabled ? 'disabled-' : ''}component`}> {loading ?
            <InlineSkeleton />
            :
            <ElementMapping {...props} map={node.map}
                _states={states}
                _props={_states}
                disabled={component.disabled}>

                {React.Children.map(children, (child) => {
                    return child && React.cloneElement(child, {
                        onChange: onChange,
                        onClick: onClick,
                        onSubmit: onSubmit,
                        disabled: component.disabled,
                        _id: component._id,
                        _states: states,
                        _props: _states,
                        onUpdateStates: onSetStates,
                        _setStates: setStates,
                        colStates: colStates
                    })
                })}
            </ElementMapping>}
    </span>



};


export default Component;