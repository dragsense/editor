
import React, { Children, useMemo } from 'react';

const General = ({ _uid, conds, onClick, disabled, name, innerWraaper, value, children, pos }) => {


    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };


    const spanElement = innerWraaper.length > 0 && innerWraaper ? innerWraaper : <span
        key={`child-${_uid}`}
        data-child={`child-muted`}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ userSelect: 'none', color: "#cccccc" }}></span>;


    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            onClick: onClick ? onClick : (e) => e.preventDefault(),
            "data-id": _uid,
            "data-pos": pos,
            "data-name": name,
            "draggable": false,
            style: {
                ...(conds ? {} : disabledStyles),
            } 
        }
    }, spanElement);




    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            onClick: onClick ? onClick : (e) => e.preventDefault(),
            style: conds ? {} : disabledStyles
        }
    }, spanElement);


    return disabled ? disabledElement : clonedElement;


};

export default General;