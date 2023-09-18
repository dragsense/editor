import { useEffect, useState, useCallback } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function AddArrayTypes({ state, states, onAdd, onRemove, onChange }) {
    const [inputValue, setInputValue] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Function to handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsButtonDisabled(!e.target.value); // Disable button if no input
    };

    // Function to handle addition of values
    const handleAddValue = useCallback(() => {
        // Splitting input values and filtering out empty values
        const values = inputValue.split(",").filter((value) => value !== "");
        onAdd(values);
        setInputValue("");
        setIsButtonDisabled(true); // Disable button after adding values
    }, [inputValue, onAdd]);

    // Function to handle array value change
    const handleArrayValueChange = (e, idx) => {
        onChange(e.target.value, idx);
    };

    // UseEffect to set initial state and input value
    useEffect(() => {
        if (!states)
            states = {};

        setInputValue(Object.values(states).flatMap((value) => value.value).join(","))
    }, [state])

    return (
        <Row gutter={8}>
            <Col flex="auto">
                <Form.Item>
                    <Input.TextArea
                        maxLength={100000}
                        rows={4}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter multiple values separated by spaces"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="dashed"
                        onClick={handleAddValue}
                        block
                        icon={<PlusOutlined />}
                        disabled={isButtonDisabled} // Button is disabled if no input
                    >
                        Save
                    </Button>
                </Form.Item>
            </Col>
            <Col flex="auto">
                {Object.values(states || {}).map((value, idx) => (
                    <Form.Item key={idx}>
                        <Input
                            maxLength={500}

                            type="text"
                            placeholder={`Value #${idx + 1}`}
                            value={value.value}
                            onChange={(e) => handleArrayValueChange(e, value.idx)}
                            addonAfter={
                                <MinusCircleOutlined onClick={() => onRemove(value.idx)} />
                            }
                        />
                    </Form.Item>
                ))}
            </Col>
        </Row>
    );
}