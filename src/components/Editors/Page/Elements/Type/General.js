import React, { Children, useMemo, useCallback } from 'react';

// Function to create custom attributes for the element
const createCustomAttributes = (_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles) => {
    return {
        onMouseMove,
        onScroll,
        onClick: onClick ? onClick : (e) => {
            const currentElement = e.target;  
            if (currentElement.tagName.toLowerCase() === 'a' ||
            currentElement.parentNode.tagName.toLowerCase() === 'a') {
            // Prevent the default behavior for anchor links
            e.preventDefault();
            }
        },
        "data-id": _uid,
        "data-pos": pos,
        "draggable": false,
        style: conds ? {} : disabledStyles
    }
}

const General = ({ _uid, conds, disabled, onMouseMove, onClick, onScroll, name, innerWraaper, value, children, pos }) => {

    // Styles to be applied when the element is disabled
    const disabledStyles = useMemo(() => ({
        opacity: 0.2,
        border: '1px dashed #ccc',
    }), []);

    // Create custom attributes for the element
    const customAttributes = createCustomAttributes(_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles);

    // Create span element based on the innerWrapper
    const spanElement = useMemo(() => {
        return innerWraaper ? (<>
            {React.isValidElement(value) ? value : <div
                dangerouslySetInnerHTML={{ __html: value }}
                data-child={`child-${_uid}`}
                style={{
                    display: 'inline',
                    cursor: 'text',
                }}
            />}
            {innerWraaper}</>
        ) : <span style={{ userSelect: 'none', color: "#cccccc" }}>{name}</span>;
    }, [innerWraaper, value, _uid, name]);

    // Clone the element with custom attributes and span element
    const clonedElement = useMemo(() => React.cloneElement(children, { customAttributes }, spanElement), [children, customAttributes, spanElement]);

    // Create disabled child based on the innerWrapper
    const disabledChild = useMemo(() => {
        return !innerWraaper ? [] : (<>
            {React.isValidElement(value) ? value : <span
                dangerouslySetInnerHTML={{ __html: value+disabled }}
            />}
            {innerWraaper}</>
        );
    }, [innerWraaper, value]);

    // Clone the element with custom attributes and disabled child
    const disabledElement = useMemo(() => React.cloneElement(children, { customAttributes }, disabledChild), [children, customAttributes, disabledChild]);

    // Return disabled element if disabled, else return clonedElement
    return disabled ? disabledElement : clonedElement;

};

export default General;