


import { useEffect, useState } from "react";
import usePageStates, { useComponentsStates } from "@/components/Editor/PageProvider";

import { Space, Cascader, Form, Button, Select, Radio } from "antd";

const { Option } = Select;
import {
    QuestionCircleFilled,
    PlusOutlined,
    MinusCircleOutlined,
    EditOutlined
} from '@ant-design/icons';


import { fetcher } from "@/lib/fetch";

const generateCascader = (state) => {
    let children = null;

    if (state.type === 'OBJECT')
        children = state.defaultValue.map(value => { return { label: value.key, value: value.key } });
    else if (state.type === 'ARRAY OBJECT') {
        const root = state.defaultValue[0];
        const child = root.defaultValue;
        children = [{ label: root.key, value: root.key, children: child.map(value => { return { label: value.key, value: value.key } }) }];
    }
    else if (state.type === 'ARRAY')

        children = undefined;


    return {
        label: state.key, value: state.key, type: state.type, children
    }
}


export function FilterEventComponent({ currentNode, states,  collections }) {

    const { modify } = usePageStates();

    const { getCurrentComponent } = useComponentsStates();

    const [docStates, setDocStates] = useState([]);

    const [eventType, setEventType] = useState(1);

    const [rels, setRel] = useState({});
    const [onClick, setOnClick] = useState({ value: '', key: '', rel: '' });
    const [onChange, setOnChange] = useState({ key: '', rel: '' });

    useEffect(() => {

        if (!currentNode || !getCurrentComponent())
            return;

        if (getCurrentComponent().filter)
            setRel(getCurrentComponent().filter)


        setOnClick(currentNode.element.onFilterClick);
        setOnChange(currentNode.element.onFilterChange);

    }, [currentNode]);

    useEffect( () => {

        if (!onChange?.rel)
            return;


        const coll = collections.find(col => col.name == onChange?.rel);


        setDocStates(coll.states.map(state => generateCascader(state)));



    }, [onChange?.rel]);

    useEffect( () => {

        if (!onClick?.rel)
            return;

          

        const coll = collections.find(col => col.name == onClick?.rel);


        setDocStates(coll.states.map(state => generateCascader(state)));



    }, [onClick?.rel]);


    const onChangeOnClick = (value) => {


        setOnClick({ ...onClick, value });


    }
    const onChangeOnClickKey = (value) => {

        setOnClick({ ...onClick, key: value });

    }
    const onChangeOnClickRel = (value) => {
        setOnClick({ ...onChange, rel: value });
    }



    const onChangeOnChangeKey = (value) => {
        setOnChange({ ...onChange, key: value });
    }

    const onChangeOnChangeRel = (value) => {
        setOnChange({ ...onChange, rel: value });
    }

    const onSave = () => {

        if (eventType == 1) {
            currentNode.element.onFilterClick = onClick;

            currentNode.element.onChangeClick = undefined;
        } else
            if (eventType == 2) {
                currentNode.element.onChangeClick = onChange;
                currentNode.element.onFilterClick = undefined;
            }


        modify();
    }


    return <div className="wrapper">
        <h4>Filter Events <QuestionCircleFilled /></h4>

        <div className="hr-line"></div>

        <label>onClick </label>  <Radio checked={eventType == 1} onChange={() => setEventType(1)} />
        &nbsp;
        <label> onChange</label> <Radio checked={eventType == 2} onChange={() => setEventType(2)} />

        <br />
        <br />

        <Form layout="vertical">
            <Space direction="vertical" className="wrapper">


                {eventType == 1 ? <Form.Item label="OnClick" className="font-500">

                    <Select onChange={onChangeOnClickRel}
                        value={onClick?.rel}
                        style={{ width: '100%', marginBottom: 5 }} placeholder="Select Collection">
                        <Option value="">None</Option>
                        {Object.keys(rels).map(key =>
                            <Option value={key}>
                                {key}
                            </Option>
                        )}

                    </Select>


                    <Cascader
                        options={
                            [...docStates.filter(s => !s.children),
                            { label: 'relationship', value: 'relationship', children: null }]}
                        onChange={onChangeOnClickKey}
                        value={onClick?.key}
                        placeholder="Select Filter Key"
                        style={{ margin: '10px 0' }}
                    />


                    {onClick?.key && onClick.key[0] == 'relationship' ?
                        <Cascader
                            options={[
                                { label: '_id', value: '_id', children: null },
                                { label: 'none', value: '', children: null }
                            ]}
                            onChange={onChangeOnClick}
                            value={onClick?.value}
                            placeholder="Select Relationshp Key"
                            style={{ margin: '10px 0' }}
                        />
                        :
                        <Cascader
                            options={states}
                            onChange={onChangeOnClick}
                            value={onClick?.value}
                            placeholder="Select Value"
                            style={{ margin: '10px 0' }}
                        />}



                </Form.Item> :


                    <Form.Item label="OnChange" className="font-500">

                        <Select onChange={onChangeOnChangeRel}
                            value={onChange?.rel}
                            style={{ width: '100%', marginBottom: 5 }} placeholder="Select Collection">
                            <Option value="">None</Option>
                            {Object.keys(rels).map(key =>
                                <Option value={key}>
                                    {key}
                                </Option>
                            )}

                        </Select>



                        <Cascader
                            options={
                                [...docStates.filter(s => !s.children),
                                { label: 'relationship', value: 'relationship', children: null }]}
                            onChange={onChangeOnChangeKey}
                            value={onChange?.key}
                            placeholder="Select Filter Key"
                            expandTrigger="hover"
                            style={{ margin: '10px 0' }}
                        />



                    </Form.Item>}


            </Space>
        </Form>

        <Button onClick={onSave} className="ac-tabs-btn">Update</Button>
    </div>
};


