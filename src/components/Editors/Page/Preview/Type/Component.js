
import React, { Children, useMemo } from 'react';



const Component = ({
  
    onMouseMove,
    conds,
    onScroll,
    onClick,
    innerWraaper,
    value,
    children,
    }) => {


 

    const spanElement = innerWraaper.length > 0 && innerWraaper ? innerWraaper : <span
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
         
        }
    }, spanElement);




   


    return conds ? clonedElement : null;


};

export default Component;