import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Divider, Alert, Select, Button, Typography } from "antd";
import Fuse from "fuse.js";
import { debounce } from '../../../../lib/utils';
import { STYLE_STORE_NAME, getAllData, getData, searchSelector, updateData } from '../../../..//lib/db';
import { nanoid } from "nanoid";

const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const fuseOptions = {
    keys: ['selectorText']
};

function SearchableSelector({ state, onSelect, animation = false, isConverted = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [selectors, setSelectors] = useState([]);

    const selector = state.selector;

    const fuse = useMemo(() => new Fuse(selectors, fuseOptions), [selectors]);
    const searchResults = useMemo(() => fuse.search(searchTerm), [fuse, searchTerm]);

    const fetchData = async () => {
        const res = await getAllData(state.page._id, STYLE_STORE_NAME);
        const data = res?.elements ? res.elements : {};
        const filteredElements = Object.values(data)
            .filter((element) => {
                const type = element.type === state.elementType 
                const isName = state.node?.selectors?.some(s => s.selector === element.selectorText) || false;
                return type || isName || state.node?.selector === element.selectorText;
            }
            
            );
        setSelectors(filteredElements);
    };

    const fetchAnimationsData = async () => {
        const res = await getData(state.page._id, animation._uid, 'id', STYLE_STORE_NAME);
        const data = res?.style ? res.style : {};
        setSelectors(Object.values(data));
    };

    useEffect(() => {
        if (!state.page) return;
        if (animation) fetchAnimationsData();
        else fetchData();
        return () => {
            setSelectors([]);
        };
    }, [state.elementType, state.node?.selectors, state.page, state.selectorDeleted, animation, isConverted]);

    useEffect(() => {
        if (!state.selectorDeleted) return;
        const filterSelectors = selectors.filter(sel => sel._uid !== state.selectorDeleted);
        setSelectors(filterSelectors);
    }, [state.selectorDeleted]);

    const handleSelectOption = (value) => {
        const selectedSelector = selectors.find(sel => sel._uid === value);
        if (!selectedSelector) return;

        let selected = {};
        if (animation) {
            if (!selectedSelector.style) selectedSelector.style = {};
            if (!selectedSelector.style[selectedSelector.selectorText]) 
                selectedSelector.style[selectedSelector.selectorText] = {};
            const properties = selectedSelector.style[selectedSelector.selectorText].properties || {};
            selected = {
                store: STYLE_STORE_NAME,
                properties,
                selectorText: selectedSelector.selectorText
            };
        } else {
            const key = state.media || 'normal';
            if (!selectedSelector.style[key]) selectedSelector.style[key] = {};
            if (!selectedSelector.style[key]["root"]) selectedSelector.style[key]["root"] = {};
            const properties = selectedSelector.style[key]["root"].properties || {};
            selected = {
                _uid: selectedSelector._uid,
                store: STYLE_STORE_NAME,
                properties,
                selectorText: selectedSelector.selectorText
            };
        }

        onSelect(selected);
        setSearchTerm("");
    };

    const handleAddNew = async () => {
        if (!validateSearchInput(searchTerm)) {
            setValidationResult('invalid');
            return;
        }

        try {
            const selectorText = searchTerm.trim();
            const id = nanoid(8);

            if (animation) {
                if (!animation.style) animation.style = {};
                animation.style[selectorText] = {
                    selectorText,
                    _uid: id,
                    type: state.elementType,
                    properties: {}
                };
                await updateData(state.page._id, animation, STYLE_STORE_NAME);
                onSelect({
                    selectorText,
                    _uid: id,
                    properties: {}
                });
                setSelectors([...selectors, {
                    selectorText,
                    _uid: id,
                    properties: {}
                }]);
            } else {
                const style = {
                    _uid: id,
                    selectorText,
                    type: state.elementType,
                    style: {}
                };
                onSelect({
                    selectorText,
                    _uid: id,
                    properties: {}
                });
                await updateData(state.page._id, style, STYLE_STORE_NAME);
                setSelectors([...selectors, style]);
            }
            setSearchTerm("");
            setValidationResult('valid');
        } catch (e) {
            console.error("Error adding new selector:", e);
        }
    };

    const handleSearchInput = useCallback(
        debounce((value) => {
            if (value && !validateSearchInput(value)) {
                setValidationResult('invalid');
                return;
            }
            setSearchTerm(value);
            setValidationResult('valid');
        }, 500),
        []
    );

    const validateSearchInput = (inputValue) => {
        const regex = animation ? /^(100|[1-9][0-9]?|0)%|from|to$/ : /^([.#][a-zA-Z0-9_-]+)(\s+[.#][a-zA-Z0-9_-]+)*$/;
        return regex.test(inputValue);
    };

    const onClose = () => {
        setValidationResult('');
    };

    return (
        <>
            <Select
                style={{ width: '100%' }}
                allowClear
                showSearch
                value={selector?.selectorText}
                placeholder="Please Select Selectors"
                onSearch={handleSearchInput}
                onChange={handleSelectOption}
                optionFilterProp="label"
                dropdownRender={menu => (
                    <>
                        {searchResults.length === 0 && validationResult === 'invalid' ? (
                            <>
                                <Alert 
                                    style={{ margin: '5px 0' }} 
                                    type="error" 
                                    onClose={onClose} 
                                    closable 
                                    message={`Please enter a valid CSS selector name ${animation ? '(e.g. to, from OR 0% - 100%)' : '(e.g. .my-class)'}.`}
                                />
                                <Divider style={{ margin: '4px 0' }} />
                            </>
                        ) : searchTerm !== '' && (
                            <div>
                                <Button onClick={handleAddNew}>
                                    Add new: {searchTerm}
                                </Button>
                                <Divider style={{ margin: '4px 0' }} />
                            </div>
                        )}
                        {menu}
                    </>
                )}
            >
                {selectors.map((value, index) => (
                    <Option key={index} value={value._uid} label={value.selectorText}>
                        {value.selectorText}
                    </Option>
                ))}
            </Select>
        </>
    );
}

export default SearchableSelector;
