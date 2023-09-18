import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '../../../../../lib/utils'

// Function to handle onChange event
const handleOnChange = (e, onChange) => {
    let selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);

    if (selectedValues.includes("all"))
        selectedValues = ['all'];

    onChange(selectedValues.join(','), selectedValues.includes("all"));
}

// Function to handle useEffect
const handleUseEffect = (value, ref) => {
    if (!ref.current)
        return;

    if (typeof value === 'string') {
        const selectElement = ref.current;
        const selectedOptions = value.split(',');
        if (selectElement) {
            const optionsLength = selectElement.options.length;
            const selectedLength = selectedOptions.length;

            if (selectedLength > 0) {
                for (let i = optionsLength - 1; i > -1; i--) {
                    selectElement.options[i].selected = selectedOptions.includes(selectElement.options[i].value);
                }
            }
        }
    }
}

const Select = (props) => {
    const { onChange, pos, value, _uid, onClick, disabled, conds, children, innerWraaper } = props;

    const ref = useRef(null);
    const [values, setValues] = useState('');

    const onChangeValue = (e) => {
        if (onChange)
            debounce(() => handleOnChange(e, onChange), 300)
    }

    useEffect(() => {
        handleUseEffect(value, ref);
    }, [value, ref.current])

    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };

    const SelectElement = <div style={{ display: 'inline-block' }}><div data-id={_uid}
        data-pos={pos} draggable={false} style={{
            outline: '1px dashed #bdbdbd', cursor: 'pointer',
            padding: '10px',
            borderRadius: 5,
            display: 'inherit',
            ...(conds ? {} : disabledStyles),
        }} className="ac-000-yrbQEpZzT">
        {React.cloneElement(children, { customAttributes: { ref, onChange: onChangeValue } }, innerWraaper)}

    </div>
    </div>



    const disabledElement = React.cloneElement(children, {
        customAttributes: {

            ref,
            onClick: onClick,
            style: conds ? {} : disabledStyles,
            onChange: onChangeValue
        }
    }, innerWraaper);



    return disabled ? disabledElement : SelectElement;

};

export default Select;