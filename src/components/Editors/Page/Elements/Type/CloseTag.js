
import React, { useMemo } from 'react';

const CloseTag = (props) => {
    const { _uid, pos, name, children, conds,
        onMouseMove,
        
        onClick, disabled } = props;

    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };
    const CloseElement = React.cloneElement(children, {
        customAttributes: {
            onMouseMove: onMouseMove,
            onClick: onClick,

            key:_uid,
            "data-id": _uid,
            "data-pos": pos,
            "data-name": name,
            "draggable": false,
        }
    })

    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            onMouseMove: onMouseMove,

            onClick: onClick,
            style: conds ? {} : disabledStyles
        }
    });


    return disabled ? disabledElement : CloseElement;


};

export default CloseTag;