

import React, { useEffect, forwardRef, useState, useMemo, Children, useCallback } from "react";
import { message } from 'antd';
import ElementMapping from './ElementMapping';

import { InlineSkeleton } from './Elements'
import { getData, storeData, getAllData } from "../../../../lib/db";
import { formatDate } from "../../../../lib/utils";

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
        error: 0,
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
                label: "LOADING", value: 'loading',
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
    const [events, setEvents] = useState({});

    const [loading, setLoading] = useState(false);


    const [colStates, setColStates] = useState({ loading: 0, error: 0 });
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

                            const relationships = collection.populatedRelationships.reduce((result, rel) => {
                                result[rel._id] = rel.name;
                                return result;
                            }, {});

                            const states = {
                                ...node.collStates,
                                name: collection.name,
                                slug: collection.slug,
                                creator: collection.creator,
                                createdAt: collection.createdAt,
                                url: collection.url,
                                states: collection.states,
                                relationships,
                                setting: collection.setting,
                                _id: collection._id
                                , loading: 1
                            }

                            setColStates(states);

                            await laodDocumnents(states);
                        }

                    }
                    setEvents(node.events);
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

                            onUpdateStates('EVENTS', [], setEvents)

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

            if (typeof defaultValue === 'string') {
                if (defaultValue.includes('all'))
                    defaultValue = '';
            }

            // if (key[0] == '__relationship__')
            //     defaultValue = filter.defaultRelationshipsFilter?.map(val => val._id);

            return { name: filter.name, filterKey: [filter.type, ...filter.filterKey], defaultValue: defaultValue || '' }
        }
        )


        return _filters;

    }, [colStates.filters, states, _states]);


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
                const res = await DocumentServices.getFilteredDocuments(collectionId, { documentIds: docs.map(doc => doc._id), filters, selectedRelationships, withRelationship });
                console.log(res)

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
                    documents = [...(collection.documents || []), ...documents];

            }

            const newSatates = {
                ...collection,
                page,
                documents,
                states,
                maxPage,
                loading: 0
            }

            setTimeout(async () => {
                setColStates(newSatates);
            }, 1000);


        } catch (e) {
            setColStates({
                ...collection,
                loading: 0,
                error: 1,
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
        setColStates({ ...colStates, loading: 1, error: 0 });

        laodDocumnents(colStates);
        // }, 500);

        setFilters(false);


    }, [states, _states])

    const onScroll = (onScroll, iframeDocument) => {

        if (!onScroll)
            return;


        const scrollTop = iframeDocument.pageYOffset;
        const scrollLeft = iframeDocument.pageXOffset;
        const delta = onScroll.delta;

        if (onScroll?.valueX || onScroll?.valueY) {

            let valueX = '';

            if (onScroll?.valueX) {
                valueX = onScroll.valueX.replace(/\[left]/g, scrollLeft);

                valueX = valueX.replace(/\[top]/g, scrollTop);
                valueX = valueX.replace(/\[delta]/g, delta);
            }

            let valueY = '';
            if (onScroll?.valueY) {
                valueY = onScroll.valueY?.replace(/\[top]/g, scrollTop);
                valueY = valueY.replace(/\[left]/g, scrollLeft);
                valueY = valueY.replace(/\[delta]/g, delta);
            }


            try {
                valueX = eval(valueX);
                valueY = eval(valueY);



            } catch (e) {
                message.error("Invalid expression:" + e?.message);

            }

            onChange([{ elem: onScroll.stateValueX || {}, value: valueX }, { elem: onScroll.stateValueY || {}, value: valueY }], node, null);
        }

    }



    useEffect(() => {
        if (!events) return;
      
        const iframe = document.querySelector("#ac-editor-iframe-doc");
      
        const handleScroll = (e) => {
          e.preventDefault();
          for (const key in events) {
            onScroll(events[key], iframe.contentWindow);
          }
        };
      
        if (iframe) {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          iframeDocument.addEventListener('scroll', handleScroll);
        }
      
        return () => {
          const iframe = document.querySelector("#ac-editor-iframe-doc");
          if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.removeEventListener('scroll', handleScroll);
          }
        };
      }, [events]);

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
                const cascaderStates = generateFormStates(panelStates, 'FORM', 'FORMSTATES')
                onUpdateStates('FORMSTATES', cascaderStates, setPanelStates)

            } else {
                const cascaderStates = generateCascader(panelStates, 'STATES', 'STATES')
                onUpdateStates('STATES', cascaderStates, setPanelStates)
            }
        }

        setStates(panelStates);
    }, [panelStates])



    const setValue = useCallback(async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;

        const isFilterKey = Object.values(colStates.filters || {}).some(filter => {
            return (
                filter.triggerType === type && // Check if triggerType matches
                filter.triggerKey.some(trigger => key.includes(trigger)) // Check for intersection
            );
        });


        setFilters(isFilterKey);

        switch (type) {
            case 'PROPS':
                updateStateValue(elem, withValue, _states, value);
                _setStates({ ..._states });
            case 'STATES':

                updateStateValue(elem, withValue, states, value);
                setStates({ ...states });
            case 'COLSTATES':
                if (key[0] === 'page') {

                    if (isNaN(value) || isNaN(withValue))
                        value = colStates.page;

                    const totalPages = Math.ceil(colStates.maxPage / colStates.limit);
                    const page = { max: totalPages, min: 1, defaultValue: colStates.page }
                    updateStateValue(elem, withValue, { page }, value);

                    if (colStates.page === page.defaultValue)
                        return;

                    if (colStates.loadMore) {

                        if (Math.abs(colStates.page - page.defaultValue) > 1) {
                            return;
                        }

                        if (colStates.page < page.defaultValue) {
                            setColStates({ ...colStates, loading: 1, error: 0 });

                            await laodDocumnents({ ...colStates, page: page.defaultValue });
                        } else if (colStates.page > page.defaultValue - 1) {
                            const documents = colStates.documents.slice(0, -(colStates.limit || 1))
                            setColStates({ ...colStates, page: page.defaultValue, documents })
                        }


                    } else {
                        setColStates({ ...colStates, loading: 1, error: 0 });
                        await laodDocumnents({ ...colStates, page: page.defaultValue });

                    }

                }

            case 'FORMSTATES':
                if (states[key[0]]) {
                    states[key[0]][key[1]] = value
                    setStates({ ...states });
                }
            default:
        }


    }, [states, colStates, _states])

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

    const onClick = useCallback((node, stateValue, withValue) => {

        //const node = await getData(_id, id);
        if (node && node.onClick) {
            const onclick = node.onClick;
            setValue(onclick, stateValue?.value || stateValue, withValue?.value || withValue);
        }

    }, [states, colStates, _states])

    const onChange = useCallback(async (values, node, all = false) => {

        //const node = await getData(_id, id);
        for (const elem of values) {

            let value = elem.value;
            const onChange = elem.elem;


            if (value === 'all' && all) {
                let options = [];

                if (node.options) {
                    options = node.options.split(",");
                    options = Object.values(options).map((val) => val.split(":")[0]);
                }

                if (node.map) {
                    let statesRef = {};
                    const maKey = node.map.key;
                    const mapType = node.map.type;


                    if (mapType == 'STATES')
                        statesRef = getStateRef(maKey, states);
                    else
                        if (mapType == 'PROPS')
                            statesRef = getStateRef(maKey, _states);
                    if (mapType == 'COLSTATES') {
                        statesRef.states = {};

                        if (maKey[0] === 'DOCUMENTS' && colStates.documents) {


                            statesRef.states = colStates.documents.reduce((result, doc, idx) => {
                                result[idx] = { value: doc._id + ":" + doc.name, idx };
                                return result;
                            }, {});



                        } else
                            if (maKey[0] === 'RELATIONSHIPS' && colStates.populatedRelationships) {
                                const docs = colStates.populatedRelationships[maKey[1]];

                                if (docs)
                                    statesRef.states = docs.reduce((result, rel, idx) => {
                                        result[idx] = { value: rel._id + ":" + rel.name, idx };
                                        return result;
                                    }, {});
                            } else if (maKey[0] === 'PAGES') {

                                const totalPages = Math.ceil(colStates.maxPage / colStates.limit);
                                const pageArray = Array.from({ length: totalPages }, (_, index) => index + 1);

                                if (pageArray.length > 0)
                                    statesRef.states = pageArray.reduce((result, index, idx) => {
                                        result[idx] = { value: index, idx };
                                        return result;
                                    }, {});
                            }
                    }


                    if (statesRef && statesRef.states) {
                        const states = Object.values(statesRef.states).map((val) => val.value.split(":")[0]);
                        options = [...(new Set([...options, ...states]))];

                    }
                }


                value = options.join(',');

            }

            setValue(onChange, value, '');

            // if (node && node.state) {
            //     if (all && node.map) {

            //         if (value.includes('all')) {
            //             const maKey = node.map.key;
            //             const mapType = node.map.type;
            //             let map = null;
            //             if (mapType == 'STATES')
            //                 map = getStateRef(maKey, states);
            //             else
            //                 map = getStateRef(maKey, states);

            //             if (map) {
            //                 const states = Object.values(map.states).map((val) => val.split(":")[0]);
            //                 let options = node.options.split(",");
            //                 options = Object.values(options).map((val) => val.split(":")[0]);
            //                 value = [...(new Set([...options, ...states]))].join(',');

            //             }
            //         } else
            //             value = ''
            //     }


            // }
        }

    }, [states, colStates, _states])


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

                {React.Children.map(children, (child, index) => {
                    return child && React.cloneElement(child, {
                        key: index,
                        fun: {
                            onChange,
                            onClick,
                            onSubmit
                        },
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