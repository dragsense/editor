
import React, { Children, useMemo } from 'react';

const Icon = ({ _uid, conds, onClick, value, layout, disabled, children, pos }) => {


    const disabledStyles = {
        pointerEvents: 'none',
        opacity: 0.2,
    };



    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onClick,
            key:_uid,
            dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
            "data-id": _uid,
            "data-pos": pos,
            "draggable": false,
            style: { ...(conds ? {} : disabledStyles) }
        }
    });

    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
            onClick: onClick ? onClick : (e) => e.preventDefault(),
            style: conds ? {} : disabledStyles
        }
    });


    return disabled ? disabledElement : clonedElement;



};

export default Icon;