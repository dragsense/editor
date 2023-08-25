import StateList from "./StateList";

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'image', label: 'IMAGE' },
    { value: 'date', label: 'DATE' },
    { value: 'time', label: 'TIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'boolean', label: 'BOOLEAN' },
];

export default function StateComponent({ states, handleEditState }) {
    return (
        <StateList states={states} />
    );
};

