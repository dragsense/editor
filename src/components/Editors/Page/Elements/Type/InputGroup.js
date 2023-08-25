
import React, { useEffect, useMemo, useState } from 'react';

const InputGroup = (props) => {
    const { labelPos, onChange, conds, 
        attributes, type, mapValue, disabled, onClick, value, _uid, pos, children } = props;

    const option = mapValue ? { value: mapValue.value, label: mapValue.label || mapValue.value } : { value, label: value };

    const [checked, setChecked] = useState(false);

    const onChangeValue = (e) => {
        e.preventDefault();

        if (onChange) {
            const optionValue = e.target.value;
            let newValue = value;
            if (checked) {
                newValue = type == 'radio' ? "" : value.replace(optionValue, "").replace(/(^,|,$)/g, "");
            } else {
                newValue = type == 'radio' ? optionValue : value ? value + "," + optionValue : optionValue;
            }
            onChange(_uid, newValue, optionValue == 'all');
        }
        else
            setChecked(!checked);


    }


    useEffect(() => {
        const isChecked = type == 'radio' ? value == option.value || (option.value == 'all' && value.includes('all')) : value.split(',').find(v => v == option.value);
        setChecked(isChecked);
    }, [value])

    const input = <>{labelPos == 0 && option.label}<input type={type} {...attributes} onChange={onChangeValue}
        value={option.value}
        checked></input>  {labelPos == 1 && option.label}</>

const disabledStyles = {
    opacity: 0.2,
    border: '1px dashed #ccc',
};

    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            "data-id": _uid,
            "data-pos": pos,
            "draggable": false,
            style: { ...(conds ? {} : disabledStyles), outline: '1px dotted #bdbdbd', cursor: 'pointer', paddingInline: '1%', }
        }
    }, input);

 


    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            onClick: onClick,
            style:  conds ? {} : disabledStyles
        }
    });


    return disabled ? disabledElement : clonedElement;


};

export default InputGroup;