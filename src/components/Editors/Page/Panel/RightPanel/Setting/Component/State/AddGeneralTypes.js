import { Form, Space, Button, Select, Input, Checkbox, Modal, Image } from "antd";
import { useState, useEffect } from "react";
import { TYPES } from '../ElementComponent';
import MediaModal from "../../../../../../../Media";
import Video from "../../../../../../../Media/Video";
import Audio from "../../../../../../../Media/Audio";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

// Initial state for the form
const initialState = {
    key: '',
    defaultValue: null,
    values: [],
    type: 'text',
    new: true,
    states: {}
};

// Function to handle form changes
const handleFormChange = (state, setState, name, value) => {
    setState({ ...state, [name]: value });
}

// Function to handle image changes
const handleImageChange = (state, setState, type, media) => {
    if (type == 'images') {
        setState({
            ...state,
            defaultValue: media[0].src,
            src: media[0]
        });
    } else {
        setState({
            ...state,
            srcs: media
        });
    }
}

// Function to handle type changes
const handleTypeChange = (state, setState, isChange, value) => {
    if(isChange) {
        Modal.confirm({
            title: 'Switching Type',
            content: 'Are you sure you want to switch to the type? Any unsaved changes may be lost.',
            onOk: () => {
                setState({ ...initialState,states: {}, key: state.key, new: state.new, type: value });
            },
            onCancel: () => {
                // Do nothing when the user cancels the confirmation
            },
        });
    } else {
        setState({ ...state, type: value });
    }
}

export default function AddGeneralTypes({ isChange, setState, state }) {

    const [mediaModal, setMediaModal] = useState(false);
    const [type, setType] = useState("images");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Check if there is any change in the form to enable or disable the button
    useEffect(() => {
        setIsButtonDisabled(JSON.stringify(state) === JSON.stringify(initialState));
    }, [state]);

    const onChange = (event) => {
        event.preventDefault();
        let value = event.target.value;
        const name = event.target.name;
        handleFormChange(state, setState, name, value);
    }

    const onChangeBoolean = (event) => {
        event.preventDefault();
        handleFormChange(state, setState, 'defaultValue', !state.defaultValue);
    };

    const onChangeImage = (media) => {
        handleImageChange(state, setState, type, media);
    }

    const onChangeType = (value) => {
        handleTypeChange(state, setState, isChange, value);
    }

    const srcs = type == 'images' ? state.src : [...(state.srcs ? state.srcs : [])];
    // Function to handle media modal opening
    const handleMediaModalOpen = (mediaType) => {
        setType(mediaType);
        setMediaModal(true);
    }

    // Function to handle media deletion
    const handleMediaDelete = (index) => {
        const newSrcs = [...state.srcs];
        newSrcs.splice(index, 1);
        setState({ ...state, srcs: newSrcs });
    }

    return <>

        <Form.Item label="Select Type" className="font-500">
            <Select style={{ width: 120 }} value={state.type} defaultValue={state.type} onChange={onChangeType}>
                {TYPES.map(type => <Option key={type.value} value={type.value}>{type.label}</Option>)}
            </Select>
        </Form.Item>

        <Button disabled={isButtonDisabled}>Submit</Button>

        {state.type == 'boolean' ?
            <Form.Item label="Value" className="font-500">
                <Checkbox checked={state.defaultValue} onChange={onChangeBoolean} > On </Checkbox>
            </Form.Item>
            : state.type == 'image' ?

                <Form.Item label="Image" >

                    <Image

                        onClick={() => handleMediaModalOpen('images')}
                        preview={false}
                        style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                        alt={state.src?.alt}
                        src={state.src?.src}
                        fallback="/images/default/default-img.png" />
                </Form.Item>

                : state.type == 'video' ?
                    <>
                        <Form.Item label="srcs:">
                            <Button onClick={() => handleMediaModalOpen('videos')} icon={<UploadOutlined />}>Upload</Button>
                            <br />
                            <br />
                            <div style={{ display: 'flex', gap: 10 }}>
                                {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                    <div key={index} style={{ width: 320, position: 'relative' }}>
                                        <DeleteOutlined style={{ position: 'absolute', top: -20, right: 0 }} onClick={() => handleMediaDelete(index)} />
                                        <Video src={src.src} alt={src.alt} mimetype={src.mimetype} />
                                    </div>
                                ))}
                            </div>
                        </Form.Item>
                        <Form.Item label="Poster">
                            <Image

                                onClick={() => handleMediaModalOpen('images')}
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
                                fallback="/images/default/default-poster.png" />
                        </Form.Item>
                    </>
                    : state.type == 'audio' ?
                        <Form.Item label="srcs:">
                            <Button onClick={() => handleMediaModalOpen('audios')} icon={<UploadOutlined />}>Upload</Button>
                            <br />
                            <br />
                            <div  style={{ display: 'flex', gap: 10 }}>
                                {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                    <div key={index} style={{ width: 360, position: 'relative' }}>
                                        <DeleteOutlined style={{ position: 'absolute', top: -20, right: 0 }} onClick={() => handleMediaDelete(index)} />

                                        <Audio src={src.src} alt={src.alt} mimetype={src.mimetype} /></div>
                                ))}
                            </div>
                        </Form.Item>
                        :
                        <><Form.Item label="Default Value" className="font-500">
                            {state.type === 'text' ?
                               
                                <TextArea placeholder="Default Value" name="defaultValue"
                                    onChange={onChange}
                                    maxLength={1000}
                                    style={{ width: '100%' }}
                                    value={state.defaultValue}
                                    type={state.type}
                                />
                                :   <Input placeholder="Default Value" name="defaultValue"
                                    onChange={onChange}
                                    style={{ width: '100%' }}
                                    maxLength={100}
                                    value={state.defaultValue}
                                    type={state.type}
                                />
                            }</Form.Item>

                            {state.type === 'number' && <div style={{display: 'flex', gap: 10, width: '100%'}}>
                            <Form.Item   style={{ width: '50%' }} label="Min" className="font-500">
                                <Input placeholder="Min" name="min"
                                    onChange={onChange}
                                    style={{ width: '100%' }}
                                    value={state.min}
                                    maxLength={100}

                                    type="Number"
                                />
                            </Form.Item> <Form.Item label="Max"  style={{ width: '50%' }} className="font-500">
                                    <Input placeholder="Max" name="max"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        value={state.max}
                                        maxLength={100}

                                        type="Number"
                                    />
                                </Form.Item></div>}
                        </>}

        <MediaModal open={mediaModal}
            type={type}
            multiple={type == 'videos' || type == 'audios'}
            onClose={() => setMediaModal(false)} srcs={srcs} onSelect={onChangeImage} />

    </>

};

