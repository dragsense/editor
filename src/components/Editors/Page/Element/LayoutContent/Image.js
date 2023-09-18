import React, { useState, useCallback } from 'react';
import { Image, Button, Popconfirm, Modal, Form, Popover, Input, message, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import MediaModal from "../../../../Media";

// ImageElement component for handling image related operations
const ImageElement = ({ children, node, onSave }) => {

    // State for managing media modal visibility
    const [mediaModal, setMediaModal] = useState(false);

    // Destructuring theme tokens
    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    // Function to handle media change
    const onChangeMedia = useCallback(async (media) => {
        // Updating node value and src with selected media
        node.nodeValue = media[0].src;
        node.src = media[0];
        onSave();
    }, [node, onSave]);

    // Function to handle image click
    const onImageClick = useCallback(() => {
        setMediaModal(true);
    }, []);

    // Content for the popover
    const content = <div>
        <Form layout="vertical">
            <Form.Item>
                <Image
                    width="100%"
                    onClick={onImageClick}
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

    // Render
    return (
        <>
            <Popover content={content} title="Image" trigger="click">
                {children}
            </Popover>

            <MediaModal 
                open={mediaModal} 
                type={"images"} 
                onClose={() => setMediaModal(false)} 
                srcs={node?.src} 
                onSelect={onChangeMedia} 
            />
        </>
    );

};

export default ImageElement;

