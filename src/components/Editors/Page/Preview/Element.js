

import React, { useMemo } from 'react';

import { InlineSkeleton } from './Elements';

const Element = ({   tagName, customAttributes = {}, attributes, classes, children = null }) => {


    return tagName ? React.createElement(
        tagName,
        {
            ...customAttributes,
            ...attributes,
            className: classes
        },
        children
    ) : <InlineSkeleton />
};

export default Element;