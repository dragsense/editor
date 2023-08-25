import React, { useState, useEffect, useMemo, useReducer } from "react";
import { Divider, Input, Select, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Fuse from "fuse.js";

const { Option } = Select;

const fuseOptions = {
    tokenize: true,
  matchAllTokens: true,
 location: 0,
 distance: 0,
};



function SearchableSelector({ selectors, onSelect, onDelete }) {

    const [searchTerm, setSearchTerm] = useState("");

    const search = useMemo(() => {
        const fuse = new Fuse(selectors, fuseOptions);
        const results = fuse.search(searchTerm);
        return results;
    }, [searchTerm]);


    function handleSelectOption(value) {
        onSelect(value);
    }

  
    function handleSearchInput(value) {
        setSearchTerm(value);

    }
 

    return (<><Select
        style={{
            width: '200px',
        }}
        allowClear
        showSearch
        value={searchTerm}
        placeholder="Please Select"
        onSearch={handleSearchInput}
        option={selectors}
        dropdownRender={menu => (
            <div>
                {search.length <= 0 && <><Option value={searchTerm}>{searchTerm}</Option>
            <Divider style={{ margin: '4px 0' }} /></>}
                {menu}
            </div>
            
        )} 
    >

    </Select>

    <Tooltip placement="top" title="Delete Selector">
                    <Button
                        icon={<DeleteOutlined size="medium" />}
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(searchTerm);
                        }}
                        className="ac-icons-btn"
                    > </Button>
                </Tooltip>
    </>
    );
}

export default SearchableSelector;