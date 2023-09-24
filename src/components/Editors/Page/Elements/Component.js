

// Importing necessary libraries and components
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { message } from 'antd';
import ElementMapping from './ElementMapping';

import { InlineSkeleton } from './Elements'
import { getAllData } from "../../../../lib/db";

import { getStateValue, updateStateValue, pageSetting, generateCascadeRelationsStates, generateCascaderCollStates, getStateRef, generateCascader } from '../../../../lib/element/elementNode';
import DocumentServices from '../../../../lib/services/documents';
import { debounce } from "../../../../lib/utils";

// Function to generate collection states
const generateCollectionStates = async (collection) => {
    const relStates = await generateCascadeRelationsStates(collection)
    const collStates = generateCascaderCollStates({
        docsLength: 0,
        loading: 0,
        error: 0,
        maxPage: 0,
        states: collection.states || {},
    }, "COLLECTION", "COLSTATES")

    if (collStates.length > 0) {
        collStates[0].children = [
            ...pageSetting,
            { type: 'array', label: 'DOCUMENTS', value: 'DOCUMENTS' },
            ...collStates[0].children, ...relStates, { label: 'PAGE', value: 'page' },
            { label: 'LIMIT', value: 'limit' }
        ]
    }
    return collStates;
}

// Function to generate form states
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

    // Destructuring props
    const { component, node, _states, _setStates, setting, children, _id, onUpdateStates } = props;

    // Initializing states
    const [states, setStates] = useState({});
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(false);
    const [colStates, setColStates] = useState({ loading: 0, error: 0 });
    const [colPanelStates, setPanelColStates] = useState(null);
    const [panelStates, setPanelStates] = useState(null);
    const [isFilterChange, setFilters] = useState(false);



    // Function to load component
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

                            if (setting?.populatedRelationships) {
                                if (!colStates.filters)
                                    colStates.filters = {};

                                for (let i = 0; i <= collection.populatedRelationships?.length; i++) {
                                    const rel = collection.populatedRelationships[i];
                                    if (rel) {
                                        colStates.filters[`__related_${i}__`] = {
                                            name: 'Related',
                                            type: 'RELATIONSHIPS',
                                            filterKey: [rel._id],
                                            defaultValue: setting.populatedRelationships[rel._id] ? setting.populatedRelationships[rel._id].map(v => v._id) : []
                                        }
                                    }
                                }
                            }

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

                            loadDocuments(states);
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
            message.error("Something was wrong." || e?.message)
        } finally {
            setLoading(false)
        }
    };


    // Function to get value based on element type
    const getValue = useCallback((elem, value = '') => {
        const { type, key } = elem;

        switch (type) {
            case 'PROPS':
                return getStateValue(key, _states);
            case 'STATES':
                return getStateValue(key, states);
            default:
                return value;
        }
    }, [_states, states]);

    // Function to generate filters
    const generateFilters = () => {
        if (!colStates.filters)
            return [];

        return Object.values(colStates.filters).map(filter => {
            const { triggerType: type, triggerKey: key, defaultValue: value } = filter;

            let defaultValue = getValue({ type, key }, value);

            // If the default value includes 'all', replace it with an empty string
            if (typeof defaultValue === 'string' && defaultValue.includes('all')) {
                defaultValue = '';
            }

            return { name: filter.name, filterKey: [filter.type, ...filter.filterKey], defaultValue: defaultValue || '' }
        });
    };

    // Use useMemo to optimize performance by avoiding unnecessary re-renders
    const filters = useMemo(generateFilters, [colStates.filters]);

    // Function to load documents from the server
    const loadDocumentsFromServer = async (collectionId, filters, selectedRelationships, withRelationship, page, limit, sortBy, sort) => {
        const res = await DocumentServices.getAllFilteredDocuments(collectionId,
            { filters, withRelationship, selectedRelationships },
            parseInt(page || 1),
            parseInt(limit || 25),
            sortBy || 'createdAt',
            sort || 'acs'
        );
        return res;
    }

    // Function to get filtered documents
    const getFilteredDocuments = async (collectionId, docs, filters, selectedRelationships, withRelationship) => {
        const res = await DocumentServices.getFilteredDocuments(collectionId, { documentIds: docs.map(doc => doc._id), filters, selectedRelationships, withRelationship });
        return res;
    }

    // Main function to load documents
    const loadDocuments = async (collection) => {
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

            // If docs array is not empty, get filtered documents
            if (Array.isArray(docs) && docs?.length > 0) {
                const res = await getFilteredDocuments(collectionId, docs, filters, selectedRelationships, withRelationship);
                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;
            }
            // Else, load documents from the server
            else {
                const res = await loadDocumentsFromServer(collectionId, filters, selectedRelationships, withRelationship, page, limit, sortBy, sort);
                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

                // If loadMore is true, append new documents to the existing ones
                if (loadMore)
                    documents = [...(collection.documents || []), ...documents];
            }

            // Update the collection states
            const newStates = {
                ...collection,
                page,
                documents,
                states,
                maxPage,
                loading: 0
            }

            // Use setTimeout to simulate network delay
            setTimeout(async () => {
                setColStates(newStates);
            }, 1000);

        } catch (e) {
            // In case of error, update the collection states
            setColStates({
                ...collection,
                loading: 0,
                error: 1,
            });
        }
    }


    // Function to handle component loading
    const handleLoadComponent = useCallback(() => {
        loadComponent();
    }, []);

    // Function to handle document loading
    const handleLoadDocuments = useCallback(() => {
        // If there are no filters and no filter change, return
        if (filters.length <= 0 && !isFilterChange)
            return;

        // Set loading and error states
        setColStates(prevState => ({ ...prevState, loading: 1, error: 0 }));

        // Load documents
        loadDocuments(colStates);

        // Reset filter change flag
        setFilters(false);
    }, [states, _states, filters, isFilterChange]);

    // Use useEffect to call handleLoadComponent on component mount
    useEffect(() => {
        handleLoadComponent();
    }, [handleLoadComponent]);

    // Use useEffect to call handleLoadDocuments when states, _states, filters, isFilterChange, or colStates change
    useEffect(() => {
        handleLoadDocuments();
    }, [states]);

    // Function to evaluate expressions
    const evaluateExpression = (expression, scrollTop, scrollLeft, delta) => {
        let result = expression;
       
        result = result.replace(/\[left]/g, scrollLeft);
        result = result.replace(/\[top]/g, scrollTop);
        result = result.replace(/\[delta]/g, delta);
       
        try {
            return eval(result);
        } catch (e) {
            message.error("Invalid expression:" + e?.message);
            return null;
        }
    }

    // Function to handle scroll event
    const onScroll = (onScroll, iframeDocument) => {

        // If no onScroll input, return
        if (!onScroll)
            return;

        // Get scroll top and left values
        const scrollTop = iframeDocument.pageYOffset;
        const scrollLeft = iframeDocument.pageXOffset;
        const delta = onScroll.delta;

        // If there are scroll values, evaluate expressions
        if (onScroll?.valueX || onScroll?.valueY) {

            let valueX = onScroll?.valueX ? evaluateExpression(onScroll.valueX, scrollTop, scrollLeft, delta) : '';
            let valueY = onScroll?.valueY ? evaluateExpression(onScroll.valueY, scrollTop, scrollLeft, delta) : '';

            // If expressions are valid, call onChange function
            if (valueX !== null && valueY !== null) {
                onChange([{ elem: onScroll.stateValueX || {}, value: valueX }, { elem: onScroll.stateValueY || {}, value: valueY }], node, null);
            }
        }
    }



    // Function to handle scroll event
    const handleScrollEvent = useCallback((e) => {
        //e.preventDefault();
        // Loop through each event and call onScroll function
        for (const key in events) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeDocument = iframe.contentWindow;
                onScroll(events[key], iframeDocument);
            }
        }
    }, [events]);

    // Function to add scroll event listener
    const addScrollEventListener = useCallback((iframeDocument) => {
        iframeDocument.addEventListener('scroll', handleScrollEvent);
    }, [handleScrollEvent]);

    // Function to remove scroll event listener
    const removeScrollEventListener = useCallback((iframeDocument) => {
        iframeDocument.removeEventListener('scroll', handleScrollEvent);
    }, [handleScrollEvent]);

    useEffect(() => {
        // If there are no events, return
        if (!events) return;

        const iframe = document.querySelector("#ac-editor-iframe-doc");

        if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            // Add scroll event listener
            addScrollEventListener(iframeDocument);
        }

        // Cleanup function to remove event listener when component unmounts
        return () => {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                // Remove scroll event listener
                removeScrollEventListener(iframeDocument);
            }
        };
    }, [events, addScrollEventListener, removeScrollEventListener]);

    // Function to load documents based on panel states
    const loadDocumentsBasedOnPanelStates = useCallback(() => {
        if (!colPanelStates) return;
        loadDocuments({ ...colStates, ...colPanelStates });
    }, [colPanelStates]);

    // Function to update states based on panel states
    const updateStatesBasedOnPanelStates = useCallback(() => {
        if (!panelStates) return;

        // If component is not disabled, generate cascader states and update them
        if (!component.disabled) {
            let cascaderStates;
            if (node.type === 'form') {
                cascaderStates = generateFormStates(panelStates, 'FORM', 'FORMSTATES');
                onUpdateStates('FORMSTATES', cascaderStates, setPanelStates);
            } else {
                cascaderStates = generateCascader(panelStates, 'STATES', 'STATES');
                onUpdateStates('STATES', cascaderStates, setPanelStates);
            }
        }

        // Update states
        setStates(panelStates);
    }, [panelStates]);

    // Use useEffect to call loadDocumentsBasedOnPanelStates when colPanelStates changes
    useEffect(() => {
        loadDocumentsBasedOnPanelStates();
    }, [loadDocumentsBasedOnPanelStates]);

    // Use useEffect to call updateStatesBasedOnPanelStates when panelStates changes
    useEffect(() => {
        updateStatesBasedOnPanelStates();
    }, [updateStatesBasedOnPanelStates]);



    // Function to check if the key is a filter key
    const isFilterKey = useCallback((type, key) => {
        return Object.values(colStates.filters || {}).some(filter => {
            return (
                filter.triggerType === type && // Check if triggerType matches
                filter.triggerKey.some(trigger => key.includes(trigger)) // Check for intersection
            );
        });
    }, [colStates.filters]);

    // Function to update state values
    const updateStateValues = useCallback((elem, withValue, state, value) => {
        updateStateValue(elem, withValue, state, value);
    }, []);

    // Function to handle page changes
    const handlePageChange = useCallback(async (key, value, withValue) => {
        if (isNaN(value) || isNaN(withValue))
            value = colStates.page;

        const totalPages = Math.ceil(colStates.maxPage / colStates.limit);
        const page = { max: totalPages, min: 1, defaultValue: colStates.page }
        updateStateValue({ type: 'COLSTATES', key }, withValue, { page }, value);

        if (colStates.page === page.defaultValue)
            return;

        if (colStates.loadMore) {
            if (Math.abs(colStates.page - page.defaultValue) > 1) {
                return;
            }

            if (colStates.page < page.defaultValue) {
                setColStates({ ...colStates, loading: 1, error: 0 });
                await loadDocuments({ ...colStates, page: page.defaultValue });
            } else if (colStates.page > page.defaultValue - 1) {
                const documents = colStates.documents.slice(0, -(colStates.limit || 1))
                setColStates({ ...colStates, page: page.defaultValue, documents })
            }
        } else {
            setColStates({ ...colStates, loading: 1, error: 0 });
            await loadDocuments({ ...colStates, page: page.defaultValue });
        }
    }, [colStates]);

    // Main function to set value
    const setValue = async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;

        // Check if the key is a filter key
        const filterKey = isFilterKey(type, key);
        setFilters(filterKey);

        switch (type) {
            case 'PROPS':
                updateStateValues(elem, withValue, _states, value);

                _setStates({ ..._states });
                break;
            case 'STATES':

                updateStateValues(elem, withValue, states, value);
                setStates({ ...states });
                break;
            case 'COLSTATES':
                if (key[0] === 'page') {
                    await handlePageChange(key, value, withValue);
                }
                break;
            case 'FORMSTATES':
                if (states[key[0]]) {
                    states[key[0]][key[1]] = value
                    setStates({ ...states });
                }
                break;
            default:
                break;
        }
    };

    // Function to get states reference based on type
    const getStatesRefBasedOnType = (mapType, maKey, states, _states, colStates) => {


        let statesRef = {};
        if (mapType == 'STATES')
            statesRef = states[maKey[0]];
        else if (mapType == 'PROPS')
            statesRef = _states[maKey[0]];
        else if (mapType == 'COLSTATES') {
            statesRef.states = {};
            if (maKey[0] === 'DOCUMENTS' && colStates.documents) {
                statesRef.states = colStates.documents.reduce((result, doc, idx) => {
                    result[idx] = { value: doc._id + ":" + doc.name, idx };
                    return result;
                }, {});
            } else if (maKey[0] === 'RELATIONSHIPS' && colStates.populatedRelationships) {
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
        return statesRef;
    }

    // Function to set states based on type
    const onSetStates = useCallback(async (key, value, type) => {
        // Switch case to handle different types
        switch (type) {
            case 'PROPS':
                const prop = getStateRef(key, _states)
                if (prop) {
                    prop.defaultValue = value
                    _setStates({ ..._states });
                }
                break;
            case 'STATES':
                const state = getStateRef(key, states)
                if (state) {
                    state.defaultValue = value
                    setStates({ ...states });
                }
                break;
            default:
                break;
        }
    }, [states, _states])

    // Function to handle onClick event
    const onClick = useCallback((fun, stateValue, withValue) => {
        // Check if node and onClick event exist
       
        if (fun) {
            setValue(fun, stateValue?.value || stateValue, withValue?.value || withValue);
        }
    }, [states, colStates, _states])

    // Function to handle onChange event
    const onChange = useCallback((values, node, all = false) => {
        let allvalues = [];
        if (all) {
            let options = [];
            if (node.options) {
                options = node.options.split(",");
                options = Object.values(options).map((val) => val.split(":")[0]);
            }

            if (node.map) {
                let statesRef = {};
                const maKey = node.map.key || [];
                const mapType = node.map.type || '';
                statesRef = getStatesRefBasedOnType(mapType, maKey, states, _states, colStates);

                if (statesRef && statesRef.states) {
                    const states = Object.values(statesRef.states).map((val) => val.value.split(":")[0]);
                    options = [...(new Set([...options, ...states]))];
                }
            }
            allvalues = options;
        }
        // Use a debounce function to limit the frequency of the loop
        const debouncedSetValue = debounce((values, allvalues) => {
            for (const elem of values) {
                let value = elem.value;
                const elemToChange = elem.elem;
                if (value === 'all')
                    value = allvalues.join(",");

                    setValue(elemToChange, value, '');
            }
        }, 100); // 300ms delay

        debouncedSetValue(values, allvalues);
        
        return allvalues;
    }, [states, colStates, _states])

    // Function to handle onSubmit event
    const onSubmit = useCallback((states) => {
        setStates({ ...states });
    }, [states])

    // Function to render children components
    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            return child && React.cloneElement(child, {
                key: child.props?._uid,
                fun: {
                    onChange,
                    onClick,
                    onSubmit
                },
                disabled: component.disabled,
                _id: component._id,
                _states: states,
                _props: _states,
                onSetStates: onSetStates,
                _setStates: setStates,
                colStates: colStates
            })
        })
    };

    // Function to render the component
    const renderComponent = useCallback(() => {
        if (loading) {
            return <InlineSkeleton />
        } else {
            return <ElementMapping {...props} map={node.map}
                _states={states}
                _props={_states}
            >
                {renderChildren()}
            </ElementMapping>
        }
    }, [loading, props, node.map, states, _states, renderChildren]);


    return <span style={{ border: '#ff7875 solid 1px', display: 'inline-block', width: '-webkit-fill-available' }}
        data-name={`${component.disabled ? 'disabled-' : ''}component`}
    >
        {renderComponent()}
    </span>


};


export default Component;