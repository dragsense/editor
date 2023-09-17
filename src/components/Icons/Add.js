import { useState, useEffect } from "react";
import { Form, Modal, Input, message } from "antd";

// Destructuring TextArea from Input
const { TextArea } = Input;

// AddIcon component definition
export default function AddIcon({ icon, onSubmit }) {

    // State for controlling the visibility of the modal
    const [iconModal, setIconModalOpen] = useState(false);
    // Form instance
    const [form] = Form.useForm();

    // Effect hook to set form values and open modal when icon prop changes
    useEffect(() => {
        if (!icon) {
            return;
        }

        form.setFieldsValue(icon);
        setIconModalOpen(true);

    }, [icon, form]);

    // Handler for modal cancel action
    const onCancel = () => setIconModalOpen(false);

    // Component return
    return (
        <>
            <Modal
                visible={iconModal}
                title="Edit Icon"
                okText="Save"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    setIconModalOpen(false);

                    form
                        .validateFields()
                        .then(async (values) => {
                            if (await onSubmit({ ...values })) {
                                form.resetFields();
                            } else {
                                setIconModalOpen(true);
                            }
                        })
                        .catch(() => {
                            setIconModalOpen(true);
                            message.error('Validate Failed.');
                        });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item 
                        label="Icon Name"
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
                        className="font-500"
                    >
                        <Input placeholder="Name" name="name" required />
                    </Form.Item>

                    <Form.Item label="Icon Classes" name="classes" className="font-500">
                        <Input placeholder="classes" name="classes" />
                    </Form.Item>
                    <Form.Item label="Icon Svg" name="svg" className="font-500">
                        <TextArea placeholder="svg" name="svg" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
