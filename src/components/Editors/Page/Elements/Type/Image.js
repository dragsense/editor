import React, { useMemo, useCallback } from 'react';

// Function to create image object
const createImageObject = (value) => {
    
    return value.value ?
        { src: value.value, alt: value.label || "image" } :
        { src: value || value, alt: "image" };
}

// Function to create custom attributes for image element
const createCustomAttributes = (_uid, pos, layout, name, onMouseMove, onClick,  onMouseEnter, onMouseLeave, image, conds, disabledStyles) => {
    return {
        onMouseMove: onMouseMove,
        onClick: onClick,
        onMouseLeave,
        onMouseEnter,
        src: image.src, alt: image.alt,
        "data-id": _uid,
        "data-pos": pos,
        "data-name": name,
        "data-layout": layout,

        "draggable": false,
        style: conds ? {} : disabledStyles
    }
}

// Function to create custom attributes for image element
const createDisbaledAttributes = (_uid, pos, name, onMouseMove, onClick,  onMouseEnter, onMouseLeave, image, conds, disabledStyles) => {
    return {
        onMouseMove: onMouseMove,
        onClick: onClick,
        onMouseLeave,
        onMouseEnter,
        src: image.src, alt: image.alt,
        style: conds ? {} : disabledStyles
    }
}

const Image = (props) => {
    const { _uid, pos, conds, layout, onMouseMove, onMouseEnter, onMouseExit, onClick, value, name, children, disabled } = props;

    // Styles for disabled image
    const disabledStyles = useMemo(() => ({
        opacity: 0.2,
        border: '1px dashed #ccc',
    }), []);

    // Create image object
    const image = useMemo(() => createImageObject(value), [value]);
   
    // Create custom attributes for image element
    const customAttributes = useMemo(() => createCustomAttributes(_uid, pos, layout, name, onMouseMove, onClick,  onMouseEnter, onMouseExit, image, conds, disabledStyles), [_uid, pos, name, onMouseMove, onClick, image, conds, disabledStyles]);

    // Clone children and add custom attributes
    const ImageElement = useMemo(() => React.cloneElement(children, { customAttributes }), [children, customAttributes]);

    const disabledAttributes = useMemo(() => createDisbaledAttributes(_uid, pos, name, onMouseMove, onClick,  onMouseEnter, onMouseExit, image, conds, disabledStyles), [_uid, pos, name, onMouseMove, onClick, image, conds, disabledStyles]);

    // Clone children and add custom attributes for disabled element
    const disabledElement = useMemo(() => React.cloneElement(children, { customAttributes: disabledAttributes }), [children, customAttributes]);

    // Return disabled element if disabled, else return ImageElement
    return disabled ? disabledElement : ImageElement;
};

export default Image;