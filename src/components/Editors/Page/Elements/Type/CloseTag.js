import React, { useMemo } from 'react';

// Function to create custom attributes for the element
const createCustomAttributes = ({ _uid, pos, name, onMouseMove, onClick }) => ({
    onMouseMove: onMouseMove,
    onClick: onClick,
    key:_uid,
    "data-id": _uid,
    "data-pos": pos,
    "data-name": name,
    "draggable": false,
});

// Function to create a disabled style for the element
const createDisabledStyles = () => ({
    opacity: 0.2,
    border: '1px dashed #ccc',
});

const CloseTag = (props) => {
    const { _uid, pos, name, children, conds, onMouseMove, onClick, disabled } = props;

    // useMemo to optimize performance by memoizing the output of createCustomAttributes and createDisabledStyles
    const customAttributes = useMemo(() => createCustomAttributes({ _uid, pos, name, onMouseMove, onClick }), [_uid, pos, name, onMouseMove, onClick]);
    const disabledStyles = useMemo(createDisabledStyles, []);

    // Clone the children element with custom attributes
    const CloseElement = React.cloneElement(children, { customAttributes });

    // Clone the children element with custom attributes and disabled styles if conditions are not met
    const disabledElement = React.cloneElement(children, { customAttributes: { ...customAttributes, style: conds ? {} : disabledStyles } });
    // Return the disabled element if disabled prop is true, else return the CloseElement
    return disabled ? disabledElement : CloseElement;
};

export default CloseTag;