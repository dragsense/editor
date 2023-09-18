import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message } from "antd";

import AddGeneralTypes from './AddGeneralTypes';

// Main function for adding object types
export default function AddObjectTypes({ newState, onAddNew, setNewState }) {

    // State for modal visibility
    const [objectTypesModal, setObjectTypesModalOpen] = useState(false);
    // Form instance
    const [form] = Form.useForm();
    // State for form values
    const [state, setState] = useState({});

    // Function to handle form value changes
    const onChange = useCallback((event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState(prevState => ({ ...prevState, [name]: value.toLowerCase() }));
    }, []);

    // Function to handle modal cancel
    const onCancel = useCallback(() => setObjectTypesModalOpen(false), []);

    // Function to handle form submission
    const onFormSubmit = useCallback(() => {
        setObjectTypesModalOpen(false);

        form
            .validateFields()
            .then(async (values) => {
                onAddNew({key: state.key, defaultValue: state.defaultValue, type: state.type});
                setNewState(null);
                form.resetFields();
            })
            .catch((info) => {
                setObjectTypesModalOpen(true);
                message.error('Validate Failed.');
            });
    }, [form, state, onAddNew, setNewState]);

    // Effect to handle new state changes
    useEffect(() => {
        if (!newState) {
            return;
        }
       
        setState(newState);
        form.setFieldsValue(newState);

        setObjectTypesModalOpen(true);

    }, [newState, form]);

    return (
        <Modal
            open={objectTypesModal}
            title={`${state?.key !== '' ? 'Add a new' : 'Edit'} inner state`}
            okText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={onFormSubmit}
            okButtonProps={{ disabled: !form.isFieldsTouched() }}
        >
            <Form form={form} layout="vertical" initialValues={{}}>
                <Form.Item 
                    label="Key"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the key.',
                        },
                        {
                            min: 2,
                            message: 'Key must be at least 2 characters long',
                        }
                    ]}
                    className="font-500"  
                    name="key"
                >
                    <Input 
                        placeholder="Key"
                        maxLength={60}
                        name="key"
                        disabled={!state.new}
                        onChange={onChange}
                        value={state.key}
                    />
                </Form.Item>
                <AddGeneralTypes setState={setState} state={state} />
            </Form>
        </Modal>
    );
};
