


// import { useEffect, useState } from "react";
// import usePageStates from "@/components/Editor/PageProvider";

// import { Space, Cascader, Form, Button, Input, Radio, Select } from "antd";
// const { Option } = Select;
// import {
//     QuestionCircleFilled,
//     PlusOutlined,
//     MinusCircleOutlined,
//     EditOutlined
// } from '@ant-design/icons';



// export function EventComponent({ currentNode, states, collections }) {

//     const { modify } = usePageStates();

//     const [eventType, setEventType] = useState(1);
//     const [options, setOptions] = useState(null);
//     const [onClick, setOnClick] = useState({ value: '', key: '', withKey: '' });
//     const [onChange, setOnChange] = useState({ key: '' });

//     useEffect(() => {

//         if (!currentNode)
//             return;

//         setOnClick(currentNode.onClick);
//         setOnChange(currentNode.onChange);


//     }, [currentNode]);




//     const onChangeOnClick = (event) => {
//         event.preventDefault();

//         const value = event.target.value;

//         setOnClick({ ...onClick, value });
//     }
//     const onChangeOnClickKey = (value) => {

//         setOnClick({ ...onClick, key: value });

//     }
//     const onChangeOnClickWithKey = (value) => {

//         setOnClick({ ...onClick, withKey: value });
//     }

//     const onChangeCollection = (value) => {
//         setOnClick({ ...onClick, rel: value });


//     }


//     const onChangeOnChangeKey = (value) => {
//         setOnChange({ ...onChange, key: value });
//     }



//     const onSave = () => {


//         if (eventType == 1) {
//             currentNode.onClick = onClick;

//             currentNode.onChange = undefined;
//         }
//         else
//             if (eventType == 2) {
//                 currentNode.onChange = onChange;

//                 currentNode.onClick = undefined;
//             }

//         modify();
//     }


//     return <div className="wrapper">
//         <h4>Events <QuestionCircleFilled /></h4>

//         <div className="hr-line"></div>

//         <label>onClick </label>  <Radio checked={eventType == 1} onChange={() => setEventType(1)} />
//         &nbsp;
//         <label> onChange</label> <Radio checked={eventType == 2} onChange={() => setEventType(2)} />



//         <br />
//         <br />

//         <Form layout="vertical">
//             <Space direction="vertical" className="wrapper">



//                 {eventType == 1 ? <Form.Item label="OnClick" className="font-500">


//                     <Form.Item label="Key" className="font-500">
//                         <Cascader options={[...states.filter(s => s.type !== 'ARRAY'),
//                             { label: 'pagination', value: 'pagination', children: null }]} value={onClick?.key} onChange={onChangeOnClickKey}>
//                         </Cascader>


//                     </Form.Item>


//                     {onClick?.key && onClick.key[0] === 'pagination' ? <Select onChange={onChangeCollection}
//                         value={onClick?.rel}
//                         style={{ width: '100%', marginBottom: 5 }} placeholder="Select Collection">
//                         <Option value="">None</Option>
//                         {collections.map(col =>
//                             <Option value={col.name}>
//                                 {col.name}
//                             </Option>
//                         )}

//                     </Select> :


//                         <Form.Item label="With Key" className="font-500">
//                             <Cascader options={states} value={onClick?.withKey} onChange={onChangeOnClickWithKey}>
//                             </Cascader>
//                         </Form.Item>}

//                     <Input placeholder="Value" name="update"
//                         onChange={onChangeOnClick}
//                         value={onClick?.value}
//                         required />


//                 </Form.Item> :
//                     <Form.Item label="OnChange" className="font-500">


//                         <Form.Item label="Key" className="font-500">
//                             <Cascader options={states} value={onChange?.key} onChange={onChangeOnChangeKey}>
//                             </Cascader>
//                         </Form.Item>


//                     </Form.Item>}

//             </Space>
//         </Form>

//         <Button onClick={onSave} className="ac-tabs-btn">Update</Button>
//     </div>
// };





import { useEffect, useState } from "react";

import { Cascader, Form, Input, Radio, Select } from "antd";
const { Option } = Select;


export default function ElementEvent({ cascaderStates, state, setState, setIsChange }) {


    const [eventType, setEventType] = useState(1);

    const [states, setStates] = useState([]);

    useEffect(() => {

        if (!cascaderStates)
            return;
        setStates(cascaderStates);

        if (state.onClick)
            setEventType(2)
        else if (state.onChange)
            setEventType(1)
        else
            setEventType(0)


    }, [state]);

    const onChangeOnClickValue = (event) => {
        event.preventDefault();

        const value = event.target.value;
        if (state.onClick) {
            const onClick = state.onClick;
            onClick.value = value;
            setState({ ...state, onClick });
            setIsChange(true);
        }
    }

    const onChangeState = (keys) => {


        if (state.onClick) {

            const onClick = state.onClick ?? {};

            if (keys === undefined || keys[0] === undefined) {
                onClick.statetype = undefined;
                onClick.statekey = [];
                setState({ ...state, onClick });

            } else {
                const value = [...keys];
                onClick.statetype = value[0];
                value.shift();
                onClick.statekey = value;
                setState({ ...state, onClick });
            }
        }

        setIsChange(true);

    }



    const onChangeOnClickKey = (keys) => {

        if (keys === undefined || keys[0] === undefined) {
            setState({ ...state, onClick: undefined });

        } else {
            const value = [...keys];
            const onClick = state.onClick ?? {};
            onClick.type = value[0];
            value.shift();
            onClick.key = value;
            setState({ ...state, onClick });
        }

        setIsChange(true);


    }
    const onChangeOnClickWithKey = (keys) => {

        if (state.onClick) {

            const onClick = state.onClick ?? {};

            if (keys === undefined || keys[0] === undefined) {
                onClick.withtype = undefined;
                onClick.withkey = []
                setState({ ...state, onClick });

            } else {
                const value = [...keys];
                onClick.withtype = value[0];
                value.shift();
                onClick.withkey = value;
                setState({ ...state, onChange: undefined, onClick });
            }
        }

        setIsChange(true);

    }


    const onChangeOnChangeKey = (keys) => {


        if (keys === undefined || keys[0] === undefined) {
            setState({ ...state, onChange: undefined });

        } else {
            const value = [...keys];

            const onChange = state.onChange ?? {};
            onChange.type = value[0];
            value.shift();
            onChange.key = value;
            setState({ ...state, onChange, onClick: undefined });
        }
        setIsChange(true);

    }

    const onChangeOnChangeValue = (event) => {
        event.preventDefault();

        const value = event.target.value;
        if (state.onChange) {
            const onChange = state.onChange;
            onChange.value = value;
            setState({ ...state, onChange });
            setIsChange(true);
        }
    }



    return <Form layout="vertical">
        <Form.Item label="Event Type">

            <Radio value={1} checked={eventType == 1} onChange={(e) => setEventType(1)}>OnChange</Radio>
            <Radio value={2} checked={eventType == 2} onChange={(e) => setEventType(2)}>OnClick</Radio>


        </Form.Item>


        {eventType == 1 ? <>
            <Form.Item label="Key" className="font-500">
                <Cascader options={states}
                    value={[state.onChange?.type, ...(Array.isArray(state.onChange?.key) ? state.onChange.key : [])]}
                    onChange={onChangeOnChangeKey}>
                </Cascader>
            </Form.Item>

            <Input placeholder="Expression" name="value"
                onChange={onChangeOnChangeValue}
                value={state.onChange?.value}
            />
        </>

            :

            <>


                <Form.Item label="Key" className="font-500">
                    <Cascader options={states}
                        value={[state.onClick?.type, ...(Array.isArray(state.onClick?.key) ? state.onClick.key : [])]}

                        onChange={onChangeOnClickKey}>
                    </Cascader>


                </Form.Item>


                <Form.Item label="With Key" className="font-500">
                    <Cascader options={states}
                        value={[state.onClick?.withtype, ...(Array.isArray(state.onClick?.withkey) ? state.onClick.withkey : [])]}
                        onChange={onChangeOnClickWithKey}>
                    </Cascader>
                </Form.Item>


                <Form.Item label="Value" className="font-500">
                    <Cascader
                        options={states}
                        onChange={onChangeState}
                        value={[state.onClick?.statetype, ...(Array.isArray(state.onClick?.statekey) ? state.onClick?.statekey : [])]}
                        placeholder="Select State"
                        expandTrigger="click"
                        style={{ marginBottom: 10, width: '100%' }}
                    />





                    <Input placeholder="Expression" name="value"
                        onChange={onChangeOnClickValue}
                        value={state.onClick?.value}
                    />
                </Form.Item>



            </>
        }

    </Form>
};


