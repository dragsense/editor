
import React, { Children, useMemo } from 'react';



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


    const disabledStyles = {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };


    const spanElement = innerWraaper.length > 0 && innerWraaper ? innerWraaper : <span

        data-child={`child-muted`}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ userSelect: 'none', color: "#cccccc" }}></span>;


    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onMouseMove: onMouseMove,
            onScroll: onScroll,
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
            "data-name": name,
            "draggable": false,
            style: {
                ...(conds ? {} : disabledStyles),
            }
        }
    }, spanElement);




    const disabledElement = React.cloneElement(children, {
        customAttributes: {
            onMouseMove: onMouseMove,
            onScroll: onScroll,

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
    }, spanElement);


    return disabled ? disabledElement : clonedElement;


};

export default Component;