
import React, { Children, useMemo } from 'react';

const General = ({ _uid, conds, disabled, onClick, name, innerWraaper, value, children, pos }) => {


    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };

    const spanElement = innerWraaper ? ([<>
        {React.isValidElement(value) ? value : <div
            dangerouslySetInnerHTML={{ __html: value }}
            key={`child-${_uid}`}
            data-child={`child-${_uid}`}
            style={{
                display: 'inline',
                cursor: 'text'
            }}
        />
        }
        {innerWraaper}</>
    ]) : <span style={{ userSelect: 'none', color: "#cccccc" }}>{name}</span>;



    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            onClick: onClick ? onClick : (e) => e.preventDefault(),
            "data-id": _uid,
            "data-pos": pos,
            "data-name": name,
            "draggable": false,
            style: conds ? {} : disabledStyles
        }
    }, spanElement);


    const disabledChild = !innerWraaper ? [] : ([<>
        {React.isValidElement(value) ? value : <span
            dangerouslySetInnerHTML={{ __html: value }}

        />
        }
        {innerWraaper}</>
    ]);

    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            key:_uid,
            onClick: onClick ? onClick : (e) => e.preventDefault(),
            style: conds ? {} : disabledStyles
        }
    }, disabledChild);


    return disabled ? disabledElement : clonedElement;


};

export default General;