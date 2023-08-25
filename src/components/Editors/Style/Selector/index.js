


import React, { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import { Modal, Divider, Alert, Select, Button, Typography } from "antd";
import Fuse from "fuse.js";
import { debounce } from '../../../../lib/utils';


import { STYLE_STORE_NAME, getAllData, getData, searchSelector, updateData } from '../../../..//lib/db';
import { nanoid } from "nanoid";


const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const fuseOptions = {
    tokenize: true,
    matchAllTokens: true,
    location: 0,
    distance: 0,
    key: ['selectorText']
};



function SearchableSelector({ state, onSelect, animation = false }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [selectors, setSelectors] = useState([]);

    const selector = state.selector;

    const search = useMemo(() => {
        const fuse = new Fuse(selectors, fuseOptions);
        const results = fuse.search(searchTerm);
        return results;
    }, [selectors]);

    const fetchData = async () => {
        const res = await getAllData(state.page._id, STYLE_STORE_NAME);

        const data = res?.elements ? res.elements : {};

        const filteredElements = Object.values(data)
            .filter((element) => element.type === state.elementType);

        setSelectors(filteredElements)
    }


    const fetchAniamtionsData = async () => {


        const res = await getData(state.page._id, animation._uid, 'id', STYLE_STORE_NAME);

        const data = res?.style ? res.style : {};

        setSelectors(Object.values(data))
    }


    useEffect(() => {

        if (!state.page)
            return;

    
        if (animation)
            fetchAniamtionsData();
        else
            fetchData();
        return () => {
            setSelectors([])
        }

    }, [state.elementType, state.page, state.selectorDeleted, animation]);

    useEffect(() => {

        if (!state.selectorDeleted)
            return;

        const filterSelectors = selectors.filter(sel => sel._uid !== state.selectorDeleted)
        setSelectors(filterSelectors)


    }, [state.selectorDeleted]);

    function handleSelectOption(value) {

        const selector = selectors.find(sel => sel._uid === value)

        if (!selector)
            return;

            let selected = {};

        if (animation) {

            if (!selector.style)
                selector.style = {}

            if (!selector.style[selector.selectorText])
                selector.style[selector.selectorText] = {}

            const properties = selector.style[selector.selectorText].properties || {};

            selected = {
                store: STYLE_STORE_NAME,
                properties,
                selectorText: selector.selectorText
            }

        } else {
            const key = state.media || 'normal';

            if (!selector.style[key])
                selector.style[key] = {}

            if (!selector.style[key]["root"])
                selector.style[key]["root"] = {}

            const properties = selector.style[key]["root"].properties || {};

            selected = {
                _uid: selector._uid,
                store: STYLE_STORE_NAME,
                properties,
                selectorText: selector.selectorText
            }
        }

        if (selector)
            onSelect(selected);
        else
            onSelect(null);

        setSearchTerm("");

    }

    const handleAddNew = async () => {

        try {


            const selectorText = searchTerm.trim();
            const id = nanoid(8);


            if (animation) {
                if (!animation.style)
                    animation.style = {}

                animation.style[selectorText] = {
                    selectorText,
                    type: state.elementType,
                    properties: {
                    }
                }


                await updateData(state.page._id, animation, STYLE_STORE_NAME)

                await onSelect({
                    selectorText,
                    _uid: id,
                    properties: {},
                });

                setSelectors([...selectors, {
                    selectorText,
                    _uid: id,
                    properties: {}
                }])

            }
            else {
                const id = nanoid(8);

                const style = {
                    _uid: id,
                    selectorText,
                    type: state.elementType,
                    style: {
                    }
                }

                await onSelect({
                    selectorText,
                    _uid: id,
                    properties: {},
                });

                await updateData(state.page._id, style, STYLE_STORE_NAME)
                setSelectors([...selectors, style])
            }
            setSearchTerm("");



        } catch (e) {
        } finally {
        }


    };

    const handleSearchInput = useCallback(
        debounce(async (value) => {
            if (value && !validateSearchInput(value)) {
                return;
            }
            setSearchTerm(value);
            setValidationResult('');
        }, 500),
        []
    );



    const validateSearchInput = (inputValue, option) => {
        const regex = animation ? /^(100|[1-9][0-9]?|0)%|from|to$/ : /^(?:[^ ]* ?[^ ]*)?$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        return isValid;
    };

    const onClose = () => {
        setValidationResult('')
    };


    return (<>

        <Select
            style={{
                width: '100%',
            }}
            allowClear
            showSearch
            value={selector?.selectorText}
            placeholder="Please Select Selector"
            onSearch={handleSearchInput}
            onChange={handleSelectOption}

            optionFilterProp="label"
            dropdownRender={menu => (<>


                {search.length === 0 &&
                    validationResult === 'invalid' ? (<>
                        <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message={`Please enter a valid CSS selector name ${animation ? '(e.g. to, from OR 0% - 100%)' : '(e.g. .my-class)'}.`}>

                        </Alert>
                        <Divider style={{ margin: '4px 0' }} />
                    </>) :
                    searchTerm !== '' && <div>
                        <Button onClick={handleAddNew}>
                            Add new: {searchTerm}
                        </Button>
                        <Divider style={{ margin: '4px 0' }} />
                    </div>
                }

                {menu}


            </>)}

        >

            {selectors.map((value) => <Option value={value._uid} label={value.selectorText}>
                {value.selectorText}
            </Option>)}
        </Select>




    </>
    );
}

export default SearchableSelector;