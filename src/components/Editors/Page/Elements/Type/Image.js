
import React, { useMemo } from 'react';

const Image = (props) => {
    const { _uid, pos, conds, onClick, value,name, children, disabled } = props;

    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };
    const image =
        value.value ?
            { src: value.value, alt: value.label || "image" } :
            { src: value, alt: "image" };

    const ImageElement = React.cloneElement(children, {
            customAttributes: {
                key:_uid,
                src: image.src, alt: image.alt,
                "data-id": _uid,
                "data-pos": pos,
                "data-name": name,
                "draggable": false,
                style: conds ? {} : disabledStyles

            }

        })

        const disabledElement = React.cloneElement(children, {
            customAttributes: {
                src: image.src, alt: image.alt,
                onClick: onClick,
                style: conds ? {} : disabledStyles
            }
        });
    
    
        return disabled ? disabledElement : ImageElement;


};

export default Image;