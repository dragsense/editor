import React, { Children, useMemo, useCallback } from 'react';

// Function to create custom attributes for the element
const createCustomAttributes = (_uid, pos, onMouseMove, name, onClick, onScroll,  onMouseEnter, onMouseLeave, conds, disabledStyles) => {
    return {
        onMouseMove,
        onScroll,
        onMouseEnter,
        onMouseLeave,
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


// Function to create custom attributes for the element
const createDisbaledAttributes = (_uid, pos, onMouseMove, name, onClick, onScroll,  onMouseEnter, onMouseLeave, conds, disabledStyles) => {
    return {
        onMouseMove,
        onScroll,
        onMouseEnter,
        onMouseLeave,
        onClick: onClick ? onClick : (e) => {
            const currentElement = e.target;  
            if (currentElement.tagName.toLowerCase() === 'a' ||
            currentElement.parentNode.tagName.toLowerCase() === 'a') {
            // Prevent the default behavior for anchor links
            e.preventDefault();
            }
        },
   
        style: conds ? {} : disabledStyles
    }
}


const General = ({ _uid, conds, disabled, onMouseMove, onClick, onScroll, onMouseEnter,
    onMouseExit, name, innerWraaper, value, children, pos }) => {

    // Styles to be applied when the element is disabled
    const disabledStyles = useMemo(() => ({
        opacity: 0.2,
        border: '1px dashed #ccc',
    }), []);

    // Create custom attributes for the element
    const customAttributes = createCustomAttributes(_uid, pos, onMouseMove, name, onClick, onScroll, onMouseEnter, onMouseExit, conds, disabledStyles);

    // Create span element based on the innerWrapper
    const spanElement = useMemo(() => {
        return (value || innerWraaper?.length > 0) ?  (<>
            {React.isValidElement(value) ? value : <div
                dangerouslySetInnerHTML={{ __html: value }}
                data-child={`child-${_uid}`}
                style={{
                    display: 'inline',
                    cursor: 'text',
                }}
            />}
            {innerWraaper}</>
        ) : <span style={{ userSelect: 'none', color: "#cccccc" }}>add content here</span>;
    }, [innerWraaper, value, _uid, name]);

    // Clone the element with custom attributes and span element
    const clonedElement = useMemo(() => React.cloneElement(children, { customAttributes }, spanElement), [children, customAttributes, spanElement]);

    // Create disabled child based on the innerWrapper
    const disabledChild = useMemo(() => {
        return !innerWraaper ? [] : (<>
            {React.isValidElement(value) ? value : value && <span
                dangerouslySetInnerHTML={{ __html: value }}
            />}
            {innerWraaper}</>
        );
    }, [innerWraaper, value]);

    const disabledAttributes = createDisbaledAttributes(_uid, pos, onMouseMove, name, onClick, onScroll, onMouseEnter, onMouseExit, conds, disabledStyles);



    // Clone the element with custom attributes and disabled child
    const disabledElement = useMemo(() => React.cloneElement(children, { customAttributes: disabledAttributes }, disabledChild), [children, customAttributes, disabledChild]);

    // Return disabled element if disabled, else return clonedElement
    return disabled ? disabledElement : clonedElement;

};

export default General;