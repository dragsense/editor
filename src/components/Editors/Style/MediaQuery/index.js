

// import React, { useEffect, useState, useRef } from 'react';
// import { Tooltip, Tag, Input, Select, Button, Space } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import Add from './Add';
// import { MdDelete } from 'react-icons/md';
// const { TextArea } = Input;
// const { Option } = Select;

// import { useCssNodeStates } from '../..';
// import Selector from '@/lib/utils/cssNode';


// export function MediaQueries({ document, mediaQuery, setMediaQuery }) {


//   const [mediaQueries, setMediaQueries] = useState([]);
//   const [current, setCurrent] = useState('');

//   const [isLoading, setIsLoading] = useState(false);
//   const [newItem, setNewItem] = useState('');

//   useEffect(async () => {
//     const sheet = document.styleSheets[0];
//     const cssRules = sheet.cssRules || sheet.rules;

//     const rules = Array.prototype.slice.call(cssRules).filter(rule => rule.type == 4)

//     setMediaQueries(rules);
//   }, []);


//   useEffect(async () => {

//     if (!mediaQuery) setCurrent('');

//   }, [mediaQuery]);

//   function handleChange(index) {

//     if (index == undefined || index <= -1 || index > mediaQueries.length) {
//       setMediaQuery(null);
//       return;
//     }

//     setCurrent(index);
//     const res = mediaQueries[index];
//     setMediaQuery(res);

//   }

//   let selectOptions = mediaQueries.map((item, i) => {
//     const name = /\(([^)]+)\)/.exec(item.conditionText)[1];
//     return <Option key={name} value={i}> {name + " " + i} </Option>
//   });

//   const handleSearch = (value) => {
//     const filteredOptions = mediaQueries.filter(item => item.conditionText.includes(value));
//     if (filteredOptions.length <= 0)
//       setNewItem(value.trim());
//     else
//       setNewItem('');
//   };

//   const addNewQuery = async (mediaText) => {

//     //try {

//     console.log(mediaText);
//     let sheet = document.styleSheets[0];
//     const index = sheet.insertRule(`${mediaText}`, sheet.cssRules.length);

//     const rule = sheet.cssRules[index];

//     console.log(rule);

//     setMediaQueries([...mediaQueries, rule]);
//     setCurrent(mediaQueries.length);
//     setMediaQuery(rule);

//     //}
//     // catch (e) { }
//   }





//   return <Space size={2} align='start' direction='vertical'>
//     <label className='styling-label' style={{ textTransform: 'capitalize' }}>Media Queries: </label>
//     <Space size={2} align='start'>

//       <Select
//         allowClear
//         showSearch
//         value={current}
//         style={{ width: '200px' }}
//         loading={isLoading}
//         placeholder="Please select"
//         onChange={handleChange}
//         onSearch={handleSearch}
//         optionFilterProp="children"
//         filterOption={(input, option) => (option?.key ?? '').includes(input)}

//         dropdownRender={menu => (
//           <div>
//             {newItem && <Add addNewQuery={addNewQuery}
//               newItem={newItem}
//               setNewItem={setNewItem}
//               setIsLoading={setIsLoading} />}
//             {menu}
//           </div>
//         )}
//       >
//         {selectOptions}
//       </ Select>

//       <Tooltip placement="top" title="Delete Selector">
//         <Button
//           icon={<MdDelete size="medium" />}
//           onClick={(e) => {
//             e.preventDefault();

//             if (mediaQuery && current >= 0) {

//               let sheet = document.styleSheets[0];
//               let cssRules = sheet.cssRules || sheet.rules;

//               const index = Array.prototype.slice.call(cssRules).indexOf(mediaQuery);

//               mediaQueries.splice(current, 1);
//               sheet.deleteRule(index);

//               setCurrent('');
//               setMediaQuery(null);

//             }

//           }}
//           className="ac-icons-btn"
//         > </Button>
//       </Tooltip>
//     </Space>
//     <span>{mediaQuery && <span>media: <b>{mediaQuery.conditionText} </b></span>}</span>
//   </Space>

// }


import React, { useState, useEffect, useMemo, useReducer } from "react";
import { Modal, Divider, Alert, Select, Button, Typography } from "antd";
import Fuse from "fuse.js";

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



function SearchableMediaQuery({ selectors, onSelect, selector }) {


  const [minMax, setMinMax] = useState('portrait');
  const [searchTerm, setSearchTerm] = useState("");
  const [validationResult, setValidationResult] = useState(null);


  const search = useMemo(() => {
    const fuse = new Fuse(selectors, fuseOptions);
    const results = fuse.search(searchTerm);
    return results;
  }, [searchTerm]);


  function handleSelectOption(value) {

    onSelect(value);
  }

  const handleAddNew = () => {
    onSelect(searchTerm, true);

  };


  function handleSearchInput(value) {

    if (value && !validateSearchInput(value)) {
      return;
    }

    setSearchTerm(value);
    setValidationResult('');

  }

  const validateSearchInput = (inputValue, option) => {
    const regex = /^\.[a-zA-Z][\w-]*$/;
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
      placeholder="Please Select Screen Size"
      onSearch={handleSearchInput}
      onChange={handleSelectOption}


      dropdownRender={menu => (<>


        {search.length === 0 &&
          validationResult === 'invalid' ? (<>
            <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message="Please enter a valid CSS class name (e.g. .my-class).">

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

      {selectors.map(s => <Option value={s.selectorText}>
        {s.selectorText}
      </Option>)}
    </Select>


  </>
  );
}

export default SearchableMediaQuery;
