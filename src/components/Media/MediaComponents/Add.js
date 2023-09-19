import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message } from "antd";

// Subcomponent to display media file size
const MediaFileSize = ({ size }) => (
  <p>File Size: <strong>{size} Bytes </strong></p>
);

// Subcomponent to display media dimensions
const MediaDimensions = ({ dimensions }) => (
  dimensions && (
    <p>
      Dimensions: <strong>{dimensions?.width} x {dimensions?.height}</strong>
    </p>
  )
);

// This is a subcomponent to display media details.
const MediaDetails = ({ media }) => (
  <>
    <MediaFileSize size={media?.size} />
    <MediaDimensions dimensions={media?.dimensions} />
  </>
);

// Function to handle form submission
const handleFormSubmit = async (form, onSubmit, setMediaModalOpen) => {
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
}

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

  return (
    <>
      <Modal
        visible={mediaModal}
        title="Edit Media"
        okText="Save"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => handleFormSubmit(form, onSubmit, setMediaModalOpen)}
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