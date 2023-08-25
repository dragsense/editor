import React, { useState } from 'react';
import { Image, Button, Popconfirm, Modal, Form, Popover, Input, message, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import MediaModal from "../../../../Media";

const ImageElement = ({ children, node, onSave }) => {

    const [mediaModal, setMediaModal] = useState(false);


    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();



    const onChangeMedia = async (media) => {


        node.nodeValue = media[0].src;
        node.src = media[0];
        console.log(node);
        onSave();
    }

    const content = <div>
        <Form layout="vertical">
            <Form.Item>
                <Image
                    width="100%"
                    onClick={() => {
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
                    alt={node.src?.alt}
                    src={node.src?.src}
                    fallback="/images/default/default-img.png" />

            </Form.Item>

        </Form>
    </div>




    return <>
        <Popover content={content} title="Image" trigger="click">
            {children}
        </Popover>

        <MediaModal open={mediaModal} 
            type={"images"} 
            onClose={() => setMediaModal(false)} srcs={node?.src} onSelect={onChangeMedia} />
    </>


};

export default ImageElement;

