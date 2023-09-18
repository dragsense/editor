import { useState, useCallback } from "react";
import { Button, Popconfirm, List, Typography } from "antd";
import {
    ExclamationCircleFilled,
    PlusOutlined,
    MinusCircleOutlined,
    EditOutlined
} from "@ant-design/icons";
import AddCondition from "./Add";

// Initial condition object
const initialCondition = { key: '', value: '', name: '', relation: 'AND', valueState: undefined };

export default function ElementCondition({ cascaderStates, state, setState, setIsChange }) {

    // State for current condition
    const [currentCondition, setCurrentCondition] = useState(null);

    // Extract conditions from state
    const conditions = state.conditions || {};

    // Function to handle addition of new condition
    const onAdd = useCallback((newCondition) => {
        const key = "cond-" + newCondition.name.toLowerCase();
        setState((prevState) => ({
            ...prevState,
            conditions: { ...prevState.conditions, [key]: newCondition },
        }));
        setCurrentCondition(null);
        setIsChange(true);
    }, [setState, setIsChange]);

    // Function to handle removal of a condition
    const onRemove = useCallback((key) => {
        const updatedConditions = { ...state.conditions };
        delete updatedConditions[key];
        setState((prevState) => ({
            ...prevState,
            conditions: updatedConditions,
        }));
        setIsChange(true);
    }, [setState, setIsChange]);

    // Function to handle editing of a condition
    const onEdit = useCallback((key) => {
        setCurrentCondition(conditions[key]);
        setIsChange(true);
    }, [conditions, setIsChange]);

    // Render AddCondition component if currentCondition is present, else render list of conditions
    return currentCondition ? (
        <AddCondition
            states={cascaderStates}
            current={currentCondition}
            onAdd={onAdd}
            setCurrent={setCurrentCondition}
        />
    ) : (
        <>
            {Object.entries(conditions).map(([key, condition], idx) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} key={key}>
                    <Typography.Text>{condition.name}</Typography.Text>
                    <div>
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(key)} />
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete this condition?"
                            onConfirm={() => onRemove(key)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" icon={<MinusCircleOutlined />} />
                        </Popconfirm>
                    </div>
                </div>
            ))}
            <Button type="dashed" style={{margin: '5px 0'}} onClick={() => setCurrentCondition(initialCondition)} block icon={<PlusOutlined />}>
                Add Condition
            </Button>
        </>
    );
}