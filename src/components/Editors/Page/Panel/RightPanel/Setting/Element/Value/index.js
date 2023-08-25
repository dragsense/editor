// import React, { Children, useEffect, useRef, useState } from "react";
// import usePageStates, {useComponentsStates} from "@/components/Editor/PageProvider";
// import dynamic from 'next/dynamic';

// import {
//   QuestionCircleFilled,
// } from "@ant-design/icons";
// import { Cascader, Select, Input, Checkbox } from "antd";

// const { Option } = Select;
// import TextEditor from './TextEditor';
// import Image from './Image';

// import HtmlEditor from './HtmlEditor';

// const ContentEditor = dynamic(
//   () => import('./ContentEditor'), {
//   ssr: false
// })


// export default function Value({ currentNode,
//   states,
//   docStates,
//   relStates,
//   documents,
//   collection,
//   relationships }) {

//   const [content, setContent] = useState('');
//   const [state, setState] = useState([]);
//   const [prop, setProp] = useState([]);
//   const [relationship, setRelationship] = useState(false);
//   const [filter, setFilter] = useState({filterKey: [], filterValue: [], is: false});
//   const [document, setDocument] = useState("");
//   const [docKey, setDocKey] = useState([]);
//   const [relKey, setRelKey] = useState([]);
//   const [global, setGlobal] = useState([
//     { label: 'title', value: 'title', children: null },
//     { label: 'desc', value: 'desc', children: null },
//     { label: 'status', value: 'status', children: null },
//     { label: 'image', value: 'image', children: null },
//     { label: 'content', value: 'content', children: null },
//     { label: 'mobileLogo', value: 'mobileLogo', children: null },
//     { label: 'logo', value: 'logo', children: null },  
//     { label: 'placeholder', value: 'placeholder', children: null },
//   ]);
//   const [mapState, setMapState] = useState({ is: false, value: '' });
//   const [tagName, setTagName] = useState('');

//   const { modify } = usePageStates();
//   const { getCurrentComponent } = useComponentsStates();
//   useEffect(() => {

//     if (!currentNode)
//       return;


//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' ||
//     currentNode.element.tagName == 'option' 
//     ) {
//       setContent(currentNode.element.nodeValue);
//       setState(currentNode.element.state);
//       setProp(currentNode.element.prop);
//       setDocKey(currentNode.element.docKey);
//       setRelKey(currentNode.element.relKey);
//     }
//     else
//       if (currentNode.element.childNodes[0]) {
//         const _node = currentNode.element.childNodes[0];
//         setContent(_node.nodeValue);
//         setState(_node.state);
//         setProp(_node.prop);
//         setDocKey(_node.docKey);

//         setRelKey(_node.relKey);

//       }

//     setRelationship(currentNode.element.relationship);

//     setDocument(currentNode.element.document);
//     setMapState({ ...mapState, is: (currentNode.element.map?.length > 0) });
//     setTagName(currentNode.element.tagName);

//     if (getCurrentComponent())
//     if (getCurrentComponent().filter)
//     setFilter(getCurrentComponent().filter)

//     const comp = getCurrentComponent();



//     if (comp && currentNode.element.collection) {
//         if(comp.filter)
//         setFilter(comp.filter[currentNode.element.collection]);
//     }


//   }, [currentNode]);

//   const onSave = (_content) => {


//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' ||
//     currentNode.element.tagName == 'option'
//     )
//     currentNode.element.nodeValue = _content;
//     else {
//       currentNode.element.childNodes[0].nodeValue = _content;
//     }

//     modify();
//   }

//   const onChange = (state) => {

//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input'
//     ||    currentNode.element.tagName == 'option'
//     )
//     currentNode.element.element.state = state;
//     else {
//       currentNode.element.childNodes[0].state = state;
//     }

//     setState(state);

//     modify();
//   }

//   const onChangeProp = (state) => {

//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' ||
//     currentNode.element.tagName == 'option'
//     )
//     currentNode.element.prop = state;
//     else {
//       currentNode.element.childNodes[0].prop = state;
//     }

//     setProp(state);

//     modify();
//   }

//   const onChangeMapKey = (state) => {

//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' || 
//     currentNode.element.tagName == 'option')
//     currentNode.element.mapKey = state;
//     else {
//       currentNode.element.childNodes[0].mapKey = state;
//     }

//     setMapState({ ...mapState, value: state });

//     modify();
//   }

//   const onChangeDocKey = (state) => {

//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' ||
//     currentNode.element.tagName == 'option')
//     currentNode.element.docKey = state;
//     else {
//       currentNode.element.childNodes[0].docKey = state;
//     }

//     setDocKey(state);

//     modify();
//   }


//   const onChangeRelKey = (state) => {

//     if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' || 
//     currentNode.element.tagName == 'option')
//     currentNode.element.relKey = state;
//     else {
//       currentNode.element.childNodes[0].relKey = state;
//     }

//     setRelKey(state);

//     modify();
//   }


//   const onChangeRelationship = (state) => {
//     currentNode.element.relationship = state;

//     if (!state) {
//       if (currentNode.element.tagName == 'img' || currentNode.element.tagName == 'input' || 
//       currentNode.element.tagName == 'option')
//       currentNode.element.relKey = undefined;
//       else {
//         currentNode.element.childNodes[0].relKey = undefined;
//       }

//       setRelKey([]);
//     }

//     setRelationship(state);
//     getCurrentComponent().refresh = {collection};
//     //modify();
//   }

//   const onChangeFilter = (state) => {
//     getCurrentComponent().filter = {...getCurrentComponent().filter,
//        [collection]: {...filter, is: state}
//       };

//     setFilter({...filter, is: state});
//     getCurrentComponent().refresh = {collection};
//    // modify();
//   }

//   const onChangeFilterKey = (state) => {



//     getCurrentComponent().filter = {...getCurrentComponent().filter,
//       [collection]: {...filter, filterValue: [], filterKey: state}
//      }; 
//      setFilter({...filter, filterKey: state ?  state : []});
//      getCurrentComponent().refresh = {collection};


//     //modify(); 
//   }

//   const onChangeFilterValue = (state) => {

//     getCurrentComponent().filter = {...getCurrentComponent().filter,
//       [collection]: {...filter, filterValue: state}
//      };

//      setFilter({...filter, filterValue: state});

//      getCurrentComponent().refresh = {collection};
//   // modify();
//   }


//   const onChangeDocument = (state) => {
//     currentNode.element.document = state;
//     getCurrentComponent().refresh = {collection};
//     setDocument(state);
//    // modify();
//   }

//   const showValueComponent = () => {

//     if (!tagName)
//       return;

//     let comp = null;
//     switch (tagName) {
//       case 'div':
//         comp = <>
//           <ContentEditor content={content} setContent={setContent} onSave={onSave} />
//           <HtmlEditor content={content} setContent={setContent} onSave={onSave} />
//         </>
//         break;
//       case 'img':
//         comp = <Image content={content} setContent={setContent} onSave={onSave} />
//         break;
//       default:
//         comp = <TextEditor content={content} setContent={setContent} onSave={onSave} />
//     }


//     return comp;
//   }

//   return <div className="wrapper">
//     <h4>Value <QuestionCircleFilled /></h4>
//     <div className="hr-line"></div>


//     {
//        <>

//         <h5>Filter Applied:  <Checkbox onChange={() => onChangeFilter(!filter?.is)}
//           checked={filter?.is} /></h5>

//         {filter?.is && <>

//         <Cascader
//           options={
//             [...docStates.filter(s => !s.children),
//             { label: 'relationship', value: 'relationship', children: null }]}
//           onChange={onChangeFilterKey}
//           value={filter?.filterKey}
//           placeholder="Select Filter Key"
//           expandTrigger="hover"
//           style={{ margin: '10px 0' }}
//         />

//           {filter?.filterKey[0] == 'relationship' ?
//               <Select onChange={onChangeFilterValue}
//                 value={filter?.filterValue}
//                 style={{ width: 'auto' }}
//                 placeholder="Select Relation">
//                 {relationships.map(re =>
//                   <Option value={re._id}>
//                     {re.name}
//                   </Option>
//                 )}

//               </Select>
//               : 
//             <Cascader
//               options={states.filter(s => s.type == 'BOOLEAN')}
//               onChange={onChangeFilterValue}
//               value={filter?.filterValue}
//               placeholder="Select Value"
//               expandTrigger="hover"
//               style={{ margin: '10px 0' }}
//             />}

//         </>}

//         <h5>With Relationship:  <Checkbox onChange={() => onChangeRelationship(!relationship)}
//           checked={relationship} /></h5>

//         <Select onChange={onChangeDocument} value={document} style={{ width: 'auto' }} placeholder="Select Document">
//           <Option value="">All</Option>
//           {documents.map(doc =>
//             <Option value={doc._id}>
//               {doc.name}
//             </Option>
//           )}

//         </Select>
//         <br />

//         {relationship && <Cascader
//           options={relStates}
//           onChange={onChangeRelKey}
//           value={relKey}
//           placeholder="Select Relationshp Key"
//           expandTrigger="hover"
//           style={{ margin: '10px 0' }}
//         />}


//         <Cascader
//           options={docStates}
//           onChange={onChangeDocKey}
//           value={docKey}
//           placeholder="Select Document Key"
//           expandTrigger="hover"
//           style={{ margin: '10px 0' }}
//         />



//       </>}



//     <h5>State Applied:</h5>


//     {mapState.is && <>
//       <Checkbox onChange={() => onChangeMapKey(!mapState.value)}
//         checked={mapState.value} />  &nbsp;
//       <label> Map Value</label>

//       <br />
//     </>}



//     <Cascader
//       options={global}
//       onChange={onChangeProp}
//       value={prop}
//       placeholder="Select Page State"
//       expandTrigger="hover"
//       style={{ marginBottom: 10 }}
//     />
//     <br />
//     <Cascader
//       options={states}
//       onChange={onChange}
//       value={state}
//       placeholder="Select State"
//       expandTrigger="hover"
//       style={{ marginBottom: 10 }}
//     />

//     <h5>Plain Value:</h5>
//     {showValueComponent()}

//     {/* getCurrentComponent() && <Space direction="vertical" className="wrapper">
//       <Form.Item label="Key" className="font-500"> */}

//     {/* <select style={{ width: 120 }} onChange={onChangekey}>
//                               <option value='none'>none</option>
//                               {states.map(s => <option value={s.value}>{s.value}</option>)}
//                           </select> */}
//     {/* <Cascader options={states} onChange={onChangekey}>
//         </Cascader>
//       </Form.Item>

//       <Form.Item label="mapKey" className="font-500"> */}

//     {/* <select style={{ width: 120 }} onChange={onChangekey}>
//                           <option value='none'>none</option>
//                               {states.map(s => <option value={s.value}>{s.value}</option>)}
//                           </select> */}
//     {/* <Cascader options={states} onChange={onChangeMapkey}>
//         </Cascader>
//       </Form.Item>
//       <NodeStates currentNode={state} />   */}


//   </div >


// }



export default function ElementValue({ }) {

  return <></>

}

