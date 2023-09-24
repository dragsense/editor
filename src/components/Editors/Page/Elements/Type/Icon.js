import React, { Children, useMemo, useCallback } from 'react';

// Function to create custom attributes for the icon
const createCustomAttributes = (_uid, pos, onMouseMove, onClick, onMouseEnter, onMouseLeave, value, layout, conds, disabledStyles) => {
    return {
        onClick,
        onMouseMove,
        onMouseEnter,
        onMouseLeave,
        dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
        "data-id": _uid,
        "data-pos": pos,
        "draggable": false,
        style: { ...(conds ? {} : disabledStyles) }
    }
}

// Function to create custom attributes for the icon
const createDisbaledAttributes = (_uid, pos, onMouseMove, onClick, onMouseEnter, onMouseLeave, value, layout, conds, disabledStyles) => {
    return {
        onClick,
        onMouseMove,
        onMouseEnter,
        onMouseLeave,
        dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' },
        style: { ...(conds ? {} : disabledStyles) }
    }
}

const Icon = ({ _uid, conds, onMouseMove, onClick, onMouseEnter,
    onMouseExit, value, layout, disabled, children, pos }) => {

    // Styles to be applied when the icon is disabled
    const disabledStyles = useMemo(() => ({
        pointerEvents: 'none',
        opacity: 0.2,
    }), []);

    // Create custom attributes for the icon
    const customAttributes = useMemo(() => createCustomAttributes(_uid, pos, onMouseMove, onClick, onMouseEnter, onMouseExit, value, layout, conds, disabledStyles), [_uid, pos, onMouseMove, onClick, value, layout, conds, disabledStyles]);

    // Clone children and add custom attributes
    const clonedElement = useMemo(() => React.cloneElement(children, { customAttributes }), [children, customAttributes]);

    const createDisbaledAttributes = useMemo(() => createCustomAttributes(_uid, pos, onMouseMove, onClick, onMouseEnter, onMouseExit, value, layout, conds, disabledStyles), [_uid, pos, onMouseMove, onClick, value, layout, conds, disabledStyles]);

    // Clone children and add custom attributes for disabled element
    const disabledElement = useMemo(() => React.cloneElement(children, { customAttributes: createDisbaledAttributes }), [children, customAttributes]);

    // Return disabled element if disabled, else return clonedElement
    return disabled ? disabledElement : clonedElement;

};

export default Icon;