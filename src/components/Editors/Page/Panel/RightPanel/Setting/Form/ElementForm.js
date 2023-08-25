

// import { useDrag } from 'react-dnd';

// import { Card, Form, Input } from 'antd';
// import { MdDragIndicator } from 'react-icons/md'
// import { useEffect } from 'react';
// import usePageStates from "@/components/Editor/PageProvider";

// function ElementComponent({ tag, onSelect, onChange }) {

//     const { setToolBarValue } = usePageStates();



//     const [{ isDragging, opacity }, drag, dragPreview] = useDrag({
//         item: () => { return { tag } },
//         type: 'form',
//         end: (item, monitor) => {

//         },
//         collect: (monitor) => ({
//             opacity: monitor.isDragging() ? 0.4 : 1,
//             isDragging: monitor.isDragging()
//         }),
//     });

//     useEffect(() => {

//         setToolBarValue({ is: !isDragging })
//     }, [isDragging])

//     const onSelectItem = (e) => {
//         e.preventDefault();

//         if (onSelect)
//             onSelect(tag);


//     }

//     return <div style={{ position: 'relative' }}>
//         <div ref={drag} style={{ cursor: 'grab', position: 'absolute', right: 5, top: 5, zIndex: 1 }}><MdDragIndicator size={23} /></div>
//         <div ref={dragPreview} style={{ textAlign: 'left', opacity, border: '1px dashed #707070', padding: 5, marginBottom: 5 }}>

//             <Form.Item label={tag.key} className="font-500">
//                 Label: <Input placeholder="Label" name="label"
//                     onChange={(e) => {
//                         e.preventDefault();
//                         tag.label = e.target.value;
//                         onChange();
//                     }}
//                     value={tag.label}
//                     type="text"
//                     required />



//                 Placeholder: <Input placeholder="placeholder" name="defaultValue"
//                     onChange={(e) => {
//                         e.preventDefault();
//                         tag.defaultValue = e.target.value;
//                         onChange();

//                     }}
//                     value={tag.defaultValue}
//                     type={tag.type}
//                     required />




//                 IsRequired?: <Input name="required"
//                     onChange={(e) => {
//                         e.preventDefault();
//                         tag.required = !s.required;
//                         onChange();
//                     }}
//                     type="checkbox"
//                     checked={tag.required}
//                     required />
//             </Form.Item>

//         </div></div>



// }

// export default ElementComponent;



// import { useState, useEffect, useReducer, useMemo } from "react";
// import { message, Select, Form, Checkbox, Tooltip, Collapse, Popconfirm, Divider } from "antd";

// const { Option } = Select;

// import {

//     QuestionCircleFilled,
//     CaretRightOutlined ,
//     EditOutlined
// } from '@ant-design/icons';

// import FormServices from "@/lib/services/forms";

// import StateComponent from './State';


// const initial = {
//     forms: [],
//     loading: false
// }


// const reducer = (state, action) => {


//     switch (action.type) {
//         case "start":
//             return { ...state, loading: true }
//         case "forms":
//             return { ...state, forms: action.data, }

//         case "finish":
//             return { ...state, loading: false }
//         default:
//             return state;
//     }
// };

// export default function ElementForm({ state, onChangeState }) {

//     const [formSeacrh, setFormSeacrh] = useState('');
//     const [states, dispatch] = useReducer(reducer, initial);

//     const load =async () => {
        
//         try {

//             dispatch({ type: 'start' });


//             const res = await FormServices.search(formSeacrh);
//             dispatch({ type: 'forms', data: res.forms });


//         } catch (e) {

//             message.error(e?.message || 'Something went wrong.');
//         } finally {

//             dispatch({ type: 'finish' });

//         }
//     }


//     useEffect( () => {

//         if (!formSeacrh)
//             return;

//             load();

//     }, [formSeacrh]);

//     const onChangeForm = (value, option) => {


//         state.form = state.form ?? {};

//         if (!value)
//             state.form = undefined;
//         else {
//             state.form._id = option.value
//             state.form.name = option.label
//         }
//         onChangeState();
//     }

//     const onChangeWithTemplate = () => {
//         if (state.form) {
//             const form = state.form;
//             form.withTemplate = !form.withTemplate;
//             onChangeState();
//         }
//     }


//     const dropdownRender = (menu) => {
//         return <>
//             {states.loading && <div>Loading...</div>}

//             {menu}
//         </>
//     }

//     return (
//         <>
//             <Form layout="vertical">
//                 <Form.Item label="Form">

//                     <Select
//                         style={{ width: '100%' }}
//                         placeholder="Select Form"
//                         showSearch
//                         clearIcon

//                         onChange={onChangeForm}
//                         onSearch={(v) => {
//                             if (!states.loading)
//                                 setFormSeacrh(v);
//                         }
//                         }

//                         optionFilterProp="label"
//                         dropdownRender={dropdownRender}
//                         value={state.form?._id}
//                     >
//                         {state.form && <Option
//                             key={0} disabled
//                             value={state.form._id}
//                             label={state.form.name}>{state.form.name}</Option>}
//                         <Option value="" label="">NONE</Option>

//                         {states.forms.map(form => <Option
//                             key={form._id}
//                             value={form._id}
//                             label={form.name}>{form.name}</Option>)}
//                     </Select>

//                 </Form.Item>

//                 {state.form && <><Form.Item label="With Template" >
//                     <Checkbox onChange={() => onChangeWithTemplate()}
//                         checked={state.form.withTemplate} >Yes</Checkbox>
//                 </Form.Item>


//                     <Divider orientation="center" orientationMargin="0">Feilds <Tooltip title="Feilds"> <QuestionCircleFilled /></Tooltip> </Divider>

                  
//                         <StateComponent states={Array.isArray(state.formStates) ? state.formStates : []} onChangeState={onChangeState} />
              

//                 </>}

//             </Form>
//         </>

//     );
// };



import { Form, Tooltip, Divider } from "antd";

import {
    QuestionCircleFilled,
} from '@ant-design/icons';


import StateComponent from './State';


export default function ElementForm({ state }) {

    return (
        <>
            <Form layout="vertical">

                <Divider
                    orientation="center"
                    orientationMargin="0">
                    States
                    <Tooltip title="Dynamic Variables"> <QuestionCircleFilled />
                    </Tooltip>: </Divider>

                <StateComponent
                    states={state.states || {}} />
 
            </Form>
        </>

    );
};
