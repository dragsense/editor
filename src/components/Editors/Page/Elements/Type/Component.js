import React, { Children, useMemo, useCallback } from 'react';

// Styles to be applied when the element is disabled
const disabledStyles = {
    opacity: 0.2,
    border: '1px dashed #ccc',
};

// Function to create custom attributes for the element
const createCustomAttributes = (_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles) => {
    return {
        onMouseMove,
        onScroll,
        onClick: onClick ? onClick : (e) => {
            // Prevent the default behavior for anchor links
            e.preventDefault();
        },
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

    // Create a span element if innerWraaper is not provided
    const spanElement = useMemo(() => {
        return innerWraaper.length > 0 && innerWraaper ? innerWraaper : <span
            data-child={`child-muted`}
            dangerouslySetInnerHTML={{ __html: value }}
            style={{ userSelect: 'none', color: "#cccccc" }}></span>;
    }, [innerWraaper, value]);

    // Clone the element with custom attributes
    const clonedElement = useMemo(() => {
        return React.cloneElement(children, createCustomAttributes(_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles), spanElement);
    }, [children, _uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles, spanElement]);

    // Clone the element with custom attributes and disabled child
    const disabledElement = useMemo(() => {
        return React.cloneElement(children, createCustomAttributes(_uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles), spanElement);
    }, [children, _uid, pos, onMouseMove, onClick, onScroll, conds, disabledStyles, spanElement]);

    // Return disabled element if disabled, else return clonedElement
    return disabled ? disabledElement : clonedElement;

};

export default Component;