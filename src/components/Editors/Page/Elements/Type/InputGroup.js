import React, { useEffect, useMemo, useState, useCallback } from 'react';

// InputGroup component
const InputGroup = (props) => {
    const { labelPos, onChange, conds,
        attributes, type, mapValue, disabled, onClick, value, _uid, pos, children } = props;

    // Option value and label
    const option = useMemo(() => mapValue ? { value: mapValue.value, label: mapValue.label || mapValue.value } : { value: '' }, [mapValue]);

    // State for checked status
    const [checked, setChecked] = useState(false);

    // Function to handle value change
    const handleValueChange = useCallback((e) => {
        e.preventDefault();
        const optionValue = e.target.value;
        let newValue = '';

        // Logic for checked status
        if (checked) {
            newValue = handleCheckedStatus(type, value, optionValue);
        }
        else {
            newValue = handleUncheckedStatus(type, value, optionValue);
        }

        // Debounce onChange function
        if (onChange) {
            onChange(newValue, optionValue.trim() === 'all');
        }

        // Toggle checked status
        setChecked(!checked);
    }, [checked, onChange]);

    // Function to handle checked status
    const handleCheckedStatus = (type, value, optionValue) => {
        let newValue = '';
        if (type === 'radio' || !value)
            newValue = "''"
        else {
            const valuesArray = String(value).split(",");
            newValue = valuesArray.filter(v => v !== optionValue).join(",");
            if (newValue === 'all')
                newValue = '';
        }
        return newValue;
    };

    // Function to handle unchecked status
    const handleUncheckedStatus = (type, value, optionValue) => {
        let newValue = '';
        if (type === 'radio' || !value)
            newValue = optionValue;
        else {
            newValue = value + "," + optionValue;
            if(optionValue === 'all')
            newValue = 'all';
        }
        return newValue;
    };

    // Effect to handle checked status
    useEffect(() => {
        let isChecked = false;

        isChecked = handleIsChecked(value, type, option);

        setChecked(isChecked);
    }, [value, type, option]);

    // Function to handle isChecked status
    const handleIsChecked = (value, type, option) => {
        let isChecked = false;
        if (typeof value === 'string') {
            isChecked = type === 'radio'
                ? value === option.value || (option.value === 'all' && value.includes('all'))
                : value.split(',').some(v => v === option.value);
        } else if (typeof value === 'boolean') {
            isChecked = value === (option.value.toLowerCase() === 'true'); // Convert string to boolean
        } else if (!isNaN(Number(value))) { // Check if value is a number
            isChecked = Number(value) === Number(option.value); // Convert string to number
        }
        return isChecked;
    };

    // Input element
    const input = <>{labelPos == 0 && option.label}<input key={checked} type={type} {...attributes}
        onChange={handleValueChange}
        value={option.value}
        checked={checked === true} />  {labelPos == 1 && option.label}</>

    // Styles for disabled state
    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };

    // Cloned element with custom attributes
    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onClick: onClick,
            "data-id": _uid,
            "data-pos": pos,
            "draggable": false,
            style: { ...(conds ? {} : disabledStyles), outline: '1px dotted #bdbdbd', cursor: 'pointer', paddingInline: '1%', }
        }
    }, input);

    // Disabled element
    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            onClick: onClick,
            style: conds ? {} : disabledStyles
        }
    }, input);

    // Return disabled or cloned element based on disabled state
    return disabled ? disabledElement : clonedElement;
};

export default InputGroup;