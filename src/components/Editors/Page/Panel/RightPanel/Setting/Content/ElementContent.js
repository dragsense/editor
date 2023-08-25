

import { Form, Input, Button, Popconfirm, Divider, Cascader, Image, Select } from "antd";

import { useEffect, useState } from "react";

import { PlusOutlined, EditOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';

import ContentEditor from './ContentEditor'

import MediaModal from "../../../../../../Media";
import Video from "../../../../../../Media/Video";


const { Option } = Select;

export default function ElementContent({ cascaderStates, state, setState,
    setIsChange }) {

    const [mediaModal, setMediaModal] = useState(false);
    const [type, setType] = useState("images");


    const onChange = (content) => {
        setState({ ...state, nodeValue: content })

        setIsChange(true);
    }

    const onChangeState = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setState({ ...state, state: undefined })
        else {
            const key = [...keys];
            const first = key[0];
            key.shift()
            setState({ ...state, state: { key, type: first } })
        }

        setIsChange(true);
    }

    const handleValuesChange = (e) => {
        let values = e.target.value;
        state.options = values;
        setState({ ...state });
        setIsChange(true);
    };


    const onChangeLabelPos = (val) => {
        const label = val;
        setState({ ...state, labelPos: label });
        setIsChange(true);
    };

    const onChangeMedia = (media) => {


        if (type == 'images') {
            setState({
                ...state,
                nodeValue: media[0].src,
                src: media[0]
            });
        }
        else {
            setState({
                ...state,
                srcs: media
            });
        }
        setIsChange(true);

    }

    const srcs =  type == 'images' ? state.src : [...(state.srcs ? state.srcs : [])];


    return (
        <>
            <Form layout="vertical"
                initialValues={{}}
            >

                {(['checkbox', 'radio'].includes(state.attributes['type']?.value) || state.tagName == 'select') ? <>
                    <Form.Item
                        label="Enter option values"
                    >
                        <Input.TextArea
                            placeholder="Enter option values separated by , and separated value and label by | e.g value1|label1,value2|label2"
                            value={state.options}
                            onChange={handleValuesChange}
                        />
                    </Form.Item>

                    {state.tagName !== 'select' &&
                        <Form.Item label="Label Position">
                            <Select style={{ width: '100%' }} value={state.labelPos} onChange={onChangeLabelPos}>
                                {[
                                    { label: 'Label Before', value: 0 },
                                    { label: 'Label After', value: 1 },
                                ].map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>}
                </>
                    :

                    (state.tagName == 'video' || state.tagName == 'audio') ? <>

                        <Form.Item label="srcs:">
                            <Button onClick={() => {
                                setType('videos')

                                setMediaModal(true)
                            }} icon={<UploadOutlined />}>Upload</Button>
                            <br/>
                            <br/>
                            {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                <Video src={src.src} alt={src.alt} mimetype={src.mimetype} />
                            ))}
                        </Form.Item>
                        {state.tagName == 'video' && <Form.Item label="Poster">
                            <Image
                                width="100%"
                                onClick={() => {
                                    setType('images')

                                    setMediaModal(true)
                                }}
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                alt="video poster"
                                src={state.src?.src}
                                fallback="./images/default/default-poster.png" />
                        </Form.Item>} </>
                        : state.tagName == 'img' ?

                            <Form.Item label="Image">
                                {console.log(state.src)}
                                <Image
                                    width="100%"
                                    onClick={() => {
                                        setType('images')

                                        setMediaModal(true)
                                    }}
                                    preview={false}
                                    style={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        height: '120px',
                                        cursor: 'pointer'
                                    }}
                                    alt={state.src?.alt}
                                    src={state.src?.src}
                                    fallback="./images/default/default-img.png" />

                            </Form.Item>

                            :


                            <Form.Item label="Content" className="font-500">
                                <ContentEditor disabled={state.tagName == 'hr'} state={state} onChange={onChange} />
                            </Form.Item>
                }

                <Divider orientation="center" orientationMargin="0">Dynamic Value</Divider>


                <Cascader
                    disabled={state.tagName == 'hr'}
                    options={cascaderStates}
                    onChange={onChangeState}
                    value={state.state ?
                        [state.state.type, ...(Array.isArray(state.state.key) ? state.state.key : [])] : [undefined]}
                    placeholder="Select State"
                    style={{ marginBottom: 10, width: '100%' }}
                />

            </Form>

            <MediaModal open={mediaModal} 
            multiple={type == 'videos'}
            type={type} 
            onClose={() => setMediaModal(false)} srcs={srcs} onSelect={onChangeMedia} />

        </>

    );
};

