// import { Form, Space, Input, Button, Checkbox, Cascader, Select } from "antd";
// const { Option } = Select;
// import { QuestionCircleFilled } from '@ant-design/icons';
// import { useEffect, useState } from "react";
// import  { useComponentsStates } from "@/components/Editor/PageProvider";
// import ImageComponent from "@/components/dashboard/media/Images";
// import dynamic from 'next/dynamic';
// import { fetcher } from "@/lib/fetch";

// import FormState from './FormState';

// const ContentEditor = dynamic(
//     () => import('@/components/Panel/RightPanel/Setting/Element/Value/ContentEditor'), {
//     ssr: false
// })
// export default function ComponentStates({ currentComponent }) {


//     const [_state, _setState] = useState(null);
//     const [state, setState] = useState([]);

//     const { modify } = useComponentsStates();


//     useEffect(() => {

//         if (!currentComponent)
//             return

//         if (currentComponent.states)
//             setState(currentComponent.states);


//     }, [currentComponent])



//     const onSave = () => {
//         currentComponent.states = state;
//         currentComponent.pagination = !currentComponent.pagination;
//         modify();
//     }

//     const onChange = () => {

//         setState([...state])
//     }



//     return (
//         <>
//             <div className="wrapper">
//                 <h2>{currentComponent.name}</h2>
//                 <div className="hr-line"></div>
//                 <Form layout="vertical">


//                     <Space size={1} direction="vertical" className="wrapper">
//                         {currentComponent.form ?
//                             state.map(s => <FormState tag={s} onChange={onChange}/>)
//                             : state.filter(s => s.key !== 'filteration').map((s, idx) =>
//                                 <Form.Item label={s.key} className="font-500">
//                                     {s.type === 'OBJECT' ? s.defaultValue.map((nestedState, idxx) =>
//                                         <div className="inner-box border">
//                                             <div className="wrapper">
//                                                 <h6>{"Object Keys"} <QuestionCircleFilled /></h6>
//                                                 <Form.Item label={nestedState.key} className="font-500">

//                                                     {nestedState.type === 'IMAGE ARRAY' ?
//                                                         <ImageComponent
//                                                             image={nestedState.defaultValue}
//                                                             onSelect={(image) => {
//                                                                 nestedState.defaultValue = [...nestedState.defaultValue, image.path]
//                                                                 onChange()
//                                                             }
//                                                             }
//                                                             onRemove={(image) => {

//                                                                 let index = nestedState.defaultValue.indexOf(image);
//                                                                 if (index !== -1) {
//                                                                     nestedState.defaultValue.splice(index, 1);
//                                                                 }
//                                                                 onChange()
//                                                             }} /> :
//                                                         nestedState.type === 'IMAGE' ?
//                                                             <ImageComponent
//                                                                 image={nestedState.defaultValue}
//                                                                 onSelect={(image) => {
//                                                                     nestedState.defaultValue = image.path
//                                                                     onChange()
//                                                                 }
//                                                                 }
//                                                                 onRemove={() => {
//                                                                     nestedState.defaultValue = ''
//                                                                     ///images/default/default-img.png
//                                                                     onChange()
//                                                                 }} />
//                                                             : nestedState.type === 'CONTENT' ? <ContentEditor content={s.defaultValue} onSave={
//                                                                 (_contnet) => {
//                                                                     nestedState.defaultValue = _contnet
//                                                                     onChange();
//                                                                 }} /> : nestedState.type === 'BOOLEAN' ?

//                                                                 <Checkbox checked={nestedState.defaultValue} onChange={() => {
//                                                                     nestedState.defaultValue = !nestedState.defaultValue;
//                                                                     onChange();
//                                                                 }} />

//                                                                 : <>
//                                                                     <Input placeholder="Value" name={nestedState.key}
//                                                                         onChange={(e) => {
//                                                                             let value = e.target.value;

//                                                                             if (value > nestedState.max)
//                                                                                 value = nestedState.max;
//                                                                             else
//                                                                                 if (value < nestedState.min)
//                                                                                     value = nestedState.min;

//                                                                             console.log(nestedState);

//                                                                             nestedState.defaultValue = value
//                                                                             onChange()
//                                                                         }}
//                                                                         type={nestedState.type}
//                                                                         value={nestedState.defaultValue}
//                                                                         required />
//                                                                     {nestedState.min ? `min : ${nestedState.min},` : ''}
//                                                                     {nestedState.max ? ` max : ${nestedState.max}` : ''}
//                                                                 </>
//                                                     }
//                                                 </Form.Item>
//                                             </div>
//                                         </div>
//                                     )
//                                         : s.type === 'ARRAY' ?
//                                             <Input placeholder="Value" name={s.key}
//                                                 onChange={(e) => {
//                                                     const value = e.target.value;
//                                                     s.defaultValue = value.split(',');
//                                                     onChange();
//                                                 }}
//                                                 value={s.defaultValue}
//                                                 required /> :
//                                             s.type === 'IMAGE ARRAY' ?
//                                                 <ImageComponent
//                                                     image={s.defaultValue}
//                                                     onSelect={(image) => {

//                                                         s.defaultValue = [...s.defaultValue, image.path]
//                                                         onChange();
//                                                     }
//                                                     }
//                                                     onRemove={(image) => {

//                                                         let index = s.defaultValue.indexOf(image);
//                                                         if (index !== -1) {
//                                                             s.defaultValue.splice(index, 1);
//                                                         }
//                                                         s.defaultValue;
//                                                         onChange();
//                                                     }} /> :
//                                                 s.type === 'IMAGE' ?
//                                                     <ImageComponent
//                                                         image={s.defaultValue}
//                                                         onSelect={(image) => {
//                                                             s.defaultValue = image.path
//                                                             onChange();
//                                                         }
//                                                         }
//                                                         onRemove={() => {
//                                                             ///images/default/default-img.png
//                                                             s.defaultValue = '';
//                                                             onChange('', idx);
//                                                         }} /> : s.type === 'CONTENT' ? <ContentEditor content={s.defaultValue} onSave={
//                                                             (_contnet) => {
//                                                                 s.defaultValue = _contnet
//                                                                 onChange();
//                                                             }} /> : s.type === 'BOOLEAN' ?

//                                                         <Checkbox checked={s.defaultValue} onChange={() => {
//                                                             s.s = !s.defaultValue;
//                                                             onChange();
//                                                         }} /> : <>
//                                                             <Input placeholder="Value" name={s.key}
//                                                                 onChange={(e) => {
//                                                                     let value = e.target.value;



//                                                                     if (value > s.max)
//                                                                         value = s.max;
//                                                                     else
//                                                                         if (value < s.min)
//                                                                             value = s.min;

//                                                                     s.defaultValue = value;

//                                                                     onChange();
//                                                                 }}
//                                                                 type={s.type}
//                                                                 value={s.defaultValue}
//                                                                 required />
//                                                             {s.min ? `min : ${s.min}, ` : ''}
//                                                             {s.max ? ` max : ${s.max}` : ''}
//                                                         </>
//                                     }


//                                 </Form.Item>
//                             )}
//                     </Space>


//                     <Form.Item className="text-right">
//                         <Space>
//                             <Button type="primary" onClick={onSave}> Save </Button>
//                         </Space>
//                     </Form.Item>
//                 </Form>
//             </div>

//         </>

//     );
// };

