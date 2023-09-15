
import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../../../../../lib/utils'

const Input = (props) => {



    const { _uid, pos, onChange, value,
        type,
        onClick, children, conds, disabled } = props;

    const [v, setV] = useState(value);

    const onChangeValue = (e) => {
        e.preventDefault();



        const v = e.target.value;
        if (onChange) {
            debounce(onChange(v), 500)

        }
        setV(v);

    }


    useEffect(() => {
        setV(value);

    }, [value])


    // const InputElement = <div style={{ display: 'inline-block' }}><div data-id={_uid}
    //     data-pos={pos} draggable={false} style={{
    //         outline: '1px dashed #bdbdbd', cursor: 'pointer',
    //         padding: '10px',
    //         borderRadius: 5,
    //         display: 'inherit',
    //     }} className="ac-000-yrbQEpZzT">

    //     {}


    // </div>
    // </div>

    const InputElement = React.cloneElement(children, {
        customAttributes: {

            "data-id": _uid,
            "data-pos": pos,
            "data-name": 'input',
            "draggable": false,
            onClick: onClick,
            onChange: onChangeValue, value: type === 'file' ? '' : v
        }
    });

    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };


    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key: _uid,
            onClick: onClick,
            onChange: onChangeValue, value: v,
            style: conds ? {} : disabledStyles
        }
    });


    return disabled ? disabledElement : InputElement;



};

export default Input;