import React, { useMemo, useCallback } from 'react';
import { nanoid } from 'nanoid';

// Function to create poster object
const createPoster = (value, tag, host) => {
    return value.value ? { src: host + value.value, alt: value.label || tag } : { src: value, alt: tag };
}

// Function to create sources array
const createSources = (srcs, poster, tag, host) => {
    let sources = srcs.map((media, index) => {
        return <source key={index} src={host+media.src} type={media.mimetype} />
    });

    if (srcs.length <= 0 && tag === 'audio') {
        sources = [<source key={'default'} src={poster.src} type="audio/mp3" />]
    }

    return sources;
}

// Function to create disabled styles object
const createDisabledStyles = () => {
    return {
        opacity: 0.2,
        border: '1px dashed #ccc',
    };
}

const Media = (props) => {
    const { tag, pos, _uid, host, value, conds, onMouseMove, onClick, children, disabled } = props;

    // useMemo to avoid unnecessary re-renders and improve performance
    const poster = useMemo(() => createPoster(value, tag, host), [value, tag]);

    const srcs = Array.isArray(value.srcs) ? value.srcs : [];

    // useMemo to avoid unnecessary re-renders and improve performance
    const sources = useMemo(() => createSources(srcs, poster, tag, host), [srcs, poster, tag]);

    // useMemo to avoid unnecessary re-renders and improve performance
    const key = useMemo(() => nanoid(4), [value.srcs]);

    // useMemo to avoid unnecessary re-renders and improve performance
    const disabledStyles = useMemo(() => createDisabledStyles(), []);

    // useCallback to avoid unnecessary re-renders and improve performance
    const InputsElement = useCallback(() => (
        <div data-id={_uid} data-pos={pos} draggable={false} style={{
            border: '10px solid transparent',
            outline: '1px dashed #bdbdbd',
            cursor: 'pointer',
            display: 'inline-block',
            ...(conds ? {} : disabledStyles),
        }}>
            {React.cloneElement(children, {
                key,
                customAttributes: {
                    width: 320, height: 'auto', controls: true,
                    poster: tag === 'video' ? poster.src : undefined,
                    alt: poster.alt,
                    onMouseMove: onMouseMove,
                }
            }, [...sources, `Your browser does not support the ${tag} element.`])}
        </div>
    ), [children, conds, disabledStyles, key, onMouseMove, poster, sources, tag, _uid, pos]);

    // useCallback to avoid unnecessary re-renders and improve performance
    const disabledElement = useCallback(() => (
        React.cloneElement(children, {
            customAttributes: {
                width: 320, height: 'auto', controls: true,
                poster: tag === 'video' ? poster.src : undefined,
                alt: poster.alt,
                onMouseMove: onMouseMove,
                onClick: onClick,
                style: conds ? {} : disabledStyles
            }
        }, [...sources, `Your browser does not support the ${tag} element.`])
    ), [children, conds, disabledStyles, onMouseMove, onClick, poster, sources, tag]);

    return disabled ? disabledElement() : InputsElement();
};

export default Media;