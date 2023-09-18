import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from '../../../../../lib/utils'

// Input component
const Input = (props) => {

    const { _uid, pos, onChange, value, type, onClick, children, conds, disabled } = props;

    // State for input value
    const [v, setV] = useState(value);

    // Function to handle input value change
    const onChangeValue = useCallback((e) => {
        e.preventDefault();

        const newValue = e.target.value;
        if (onChange) {
            // Debounce to limit the rate at which function is executing
            debounce(onChange(newValue), 500)
        }
        setV(newValue);
    }, [onChange]);

    // Update state when value prop changes
    useEffect(() => {
        setV(value);
    }, [value])

    // Clone children with custom attributes
    const InputElement = React.cloneElement(children, {
        customAttributes: {
            "data-id": _uid,
            "data-pos": pos,
            "data-name": 'input',
            "draggable": false,
            onClick: onClick,
            onChange: onChangeValue, 
            value: type === 'file' ? '' : v
        }
    });

    // Styles for disabled input
    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };

    // Clone children with custom attributes for disabled input
    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key: _uid,
            onClick: onClick,
            onChange: onChangeValue, 
            value: v,
            style: conds ? {} : disabledStyles
        }
    });

    // Return disabled or cloned element based on disabled state
    return disabled ? disabledElement : InputElement;

};

export default Input;