import React, { Children, useMemo, useCallback } from 'react';

// Styles to be applied when the element is disabled
const disabledStyles = {
    opacity: 0.2,
    border: '1px dashed #ccc',
};

// Function to create custom attributes for the element
const createCustomAttributes = (_uid, pos,  onMouseMove, name, onClick, onScroll, conds, disabledStyles) => {
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
        "data-name": name,
        "data-id": _uid,
        "data-pos": pos,
        "draggable": false,
        style: conds ? {} : disabledStyles
    }
}

const Component = ({
    _uid,
    onMouseMove,
    conds,
    onScroll,
    onClick,
    disabled,
    name,
    innerWraaper,
    value,
    children,
    pos }) => {

   
    const spanElement = useMemo(() => {
        return (value || innerWraaper?.length > 0) ?  (<>
             {value}
            {innerWraaper}</>
        ) : <span style={{ userSelect: 'none', color: "#cccccc" }}>add content here</span>;
    }, [innerWraaper, value]);

    const customAttributes = createCustomAttributes(_uid, pos, onMouseMove, name, onClick, onScroll, conds, disabledStyles);

    const clonedElement = useMemo(() => React.cloneElement(children, { customAttributes }, spanElement), [children, customAttributes, spanElement]);

    // Clone the element with custom attributes and disabled child
    const disabledElement = useMemo(() => {
        return React.cloneElement(children, createCustomAttributes(_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles), spanElement);
    }, [children, _uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles, spanElement]);

    // Return disabled element if disabled, else return clonedElement
    return disabled ? disabledElement : clonedElement;

};

export default Component;