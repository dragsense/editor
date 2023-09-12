
import React, { Children, useMemo } from 'react';

const Icon = ({ _uid, conds, onMouseMove, onClick, value, layout, disabled, children, pos }) => {


    const disabledStyles = {
        pointerEvents: 'none',
        opacity: 0.2,
    };



    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onClick,
            onMouseMove: onMouseMove,

            dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
            "data-id": _uid,
            "data-pos": pos,
            "draggable": false,
            style: { ...(conds ? {} : disabledStyles) }
        }
    });

    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            onMouseMove: onMouseMove,

            dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
            onClick: onClick,
            style: conds ? {} : disabledStyles
        }
    });


    return disabled ? disabledElement : clonedElement;



};

export default Icon;