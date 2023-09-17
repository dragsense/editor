import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message } from "antd";

// This is a subcomponent to display media details.
const MediaDetails = ({ media }) => (
  <>
    <p>File Size: <strong>{media?.size} Bytes </strong></p>
    {media?.dimensions && (
      <p>
        Dimensions: <strong>{media.dimensions?.width} x {media.dimensions?.height}</strong>
      </p>
    )}
  </>
);

export default function AddMedia({ media, onSubmit }) {
    // State to handle the visibility of the modal.
    const [mediaModal, setMediaModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Whenever `media` prop changes, set form values and open the modal.
    useEffect(() => {
        if (media) {
            form.setFieldsValue(media);
            setMediaModalOpen(true);
        }
    }, [media, form]);

    // Close modal handler
    const onCancel = useCallback(() => {
        setMediaModalOpen(false);
    }, []);

    // Submit form handler
    const onFormSubmit = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const isSuccess = await onSubmit(values);
            if (isSuccess) {
                form.resetFields();
                setMediaModalOpen(false);
            } else {
                setMediaModalOpen(true);
                message.error('Error while submitting.');
            }
        } catch (error) {
            setMediaModalOpen(true);
            message.error('Validation failed.');
        }
    }, [form, onSubmit]);

    return (
      <>
        <Modal
            visible={mediaModal}
            title="Edit Media"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={onFormSubmit}
        >
            <Form form={form} layout="vertical">
                <MediaDetails media={media} />
                
                <Form.Item 
                    label="Media Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name.',
                        },
                        {
                            min: 2,
                            message: 'Name must be at least 2 characters long',
                        }
                    ]}
                >
                    <Input placeholder="Name" required />
                </Form.Item>

                <Form.Item label="Media Alt" name="alt">
                    <Input placeholder="Alt text" required />
                </Form.Item>
            </Form>
        </Modal>
      </>
    );
};