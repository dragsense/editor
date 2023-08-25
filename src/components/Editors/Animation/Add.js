


import { ExclamationCircleFilled } from '@ant-design/icons';

import { RiDeleteBin2Line } from 'react-icons/ri';

import React, { useState, useEffect, useMemo, useReducer } from "react";
import { Modal, Divider, Alert, Select, Button, Typography, theme, Tooltip } from "antd";
import Fuse from "fuse.js";
import { getAllData, getAllKeys, STYLE_STORE_NAME, updateData } from '../../../lib/db';
import { nanoid } from 'nanoid';

const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const fuseOptions = {
    tokenize: true,
    matchAllTokens: true,
    location: 0,
    distance: 0,
    key: ['type']
};



export default function Animations({ onEdit, animation, onChange, state, onDelete }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [validationResult, setValidationResult] = useState(null);

    const [animations, setAnimations] = useState([]);

    const {
        token: { colorError },
    } = theme.useToken();

    const search = useMemo(() => {
        const fuse = new Fuse(animations, fuseOptions);
        const results = fuse.search(searchTerm);
        return results;
    }, [animations]);


    useEffect(() => {

        if (!state.page?._id)
            return;


        const fetchData = async () => {



            const res = await getAllData(state.page._id, STYLE_STORE_NAME);

            const data = res?.elements ? res.elements : {};
            const elements = Object.values(data);

            setAnimations(elements)

        }

        fetchData();
        return () => {
            setAnimations([])
        }

    }, [state.page, state.animationDeleted]);


    function handleSelectOption(value) {

        const animation = animations.find(sel => sel._uid === value)

        if (!animation)
            return;

        onEdit(animation);
        setSearchTerm("");

    }

    const handleAddNew = async () => {


        const id = nanoid(8);

        const animation = {
            _uid: id,
            name: searchTerm,
            style: {
                ['0%']: {
                    selectorText: '0%',
                    properties: {},
                    _uid: nanoid(8),
                }
            }
        }

        onEdit(animation);

        await updateData(state.page._id, animation, STYLE_STORE_NAME);
        setAnimations([...animations, animation])
        onChange();
        setSearchTerm("");

    };


    function handleSearchInput(value) {

        if (value && !validateSearchInput(value)) {
            return;
        }

        setSearchTerm(value);
        setValidationResult('');

    }

    const validateSearchInput = (inputValue, option) => {
        const regex = /^[a-zA-Z_]+$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        return isValid;
    };

    const onClose = () => {
        setValidationResult('')
    };




    return <>

        <Select
            style={{
                width: '100%', marginRight: 10
            }}
            allowClear
            showSearch
            value={animation?.name}
            placeholder="Please Select Animation"
            onSearch={handleSearchInput}
            onChange={handleSelectOption}


            dropdownRender={menu => (<>


                {search.length === 0 &&
                    validationResult === 'invalid' ? (<>
                        <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message={`Please enter a valid name (e.g my-snimstion).`}>

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

            {animations.map(animation => <Option key={animation._uid} 
            value={animation._uid} label={animation.name}>
                {animation.name}
            </Option>)}
        </Select>


        <Tooltip placement="top" title="Delete Animation">
            <Button
                size='small'
                ghost
                icon={<RiDeleteBin2Line style={{ color: colorError }} />}
                onClick={(e) => {
                    e.preventDefault();

                    confirm({
                        title: 'Are you sure to delete this aniamtion?',
                        content: "This action can't be undo.",

                        icon: <ExclamationCircleFilled />,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk() {
                            onDelete(animation);
                        },
                        onCancel() {

                        },
                    });
                }}
            > </Button>
        </Tooltip>



    </>

}

