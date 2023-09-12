
import React, { Children, useMemo } from 'react';

const General = ({ conds,
    onMouseMove,
    onClick,
    onScroll,
    name,
    innerWraaper, value, children }) => {



    const spanElement = innerWraaper ? (<>
        {React.isValidElement(value) ? value : <div
            dangerouslySetInnerHTML={{ __html: value }}
         
        />
        }
        {innerWraaper}</>
    ) : <span style={{ userSelect: 'none', color: "#cccccc" }}>{name}</span>;



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

export default General;