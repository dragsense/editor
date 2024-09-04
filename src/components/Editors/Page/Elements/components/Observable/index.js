import React, { useState, useEffect, useRef, useCallback } from 'react';

const Observable = (props) => {
    const { children, states, node, updateStates } = props;
    const ref = useRef();

    const [vValue, setVisibleValue] = useState('');
    const [sTValue, setScrollTopValue] = useState('');
    const [sLValue, setScrollLeftValue] = useState('');
    const [vTValue, setVisibleTopValue] = useState(0);

    // Function to get default value from states
    const getDefaultValue = (states, key, defaultValue) => states[key] ? states[key].defaultValue : defaultValue;

    const tagName = getDefaultValue(states, 'tagName', 'div');
    const onScroll = getDefaultValue(states, 'onScroll', false);
    const scrollTop = getDefaultValue(states, 'scrollTop', 50);
    const scrollLeft = getDefaultValue(states, 'scrollLeft', 50);
    const scrollTopValue = getDefaultValue(states, 'scrollTopValue', '');
    const scrollLeftValue = getDefaultValue(states, 'scrollLeftValue', '');
    const onVisible = getDefaultValue(states, 'onVisible', false);
    const calculateVisibility = getDefaultValue(states, 'calculateVisibility', false);
    const oneTime = getDefaultValue(states, 'oneTime', false);
    const threshold = getDefaultValue(states, 'threshold', 0.1);
    const visibleValue = getDefaultValue(states, 'visibleValue', '');
    const inVisibleValue = getDefaultValue(states, 'inVisibleValue', '');

    const handleScroll = useCallback(() => {
        if (onScroll) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeWindow = iframe.contentWindow;
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const top = iframeWindow.pageYOffset || iframeDocument.documentElement.scrollTop;
                const left = iframeWindow.pageXOffset || iframeDocument.documentElement.scrollLeft;
                setScrollTopValue(top > scrollTop ? scrollTopValue : '');
                setScrollLeftValue(left > scrollLeft ? scrollLeftValue : '');
            }
        }
    }, [onScroll, scrollTop, scrollLeft, scrollTopValue, scrollLeftValue]);

    useEffect(() => {
        if (onScroll) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeWindow = iframe.contentWindow;
                iframeWindow.addEventListener('scroll', handleScroll);
                return () => iframeWindow.removeEventListener('scroll', handleScroll);
            }
        }
    }, [handleScroll, onScroll]);

    const observerRef = useRef(null);

    const handleVisibility = useCallback(() => {
        if (ref.current && onVisible) {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                            setVisibleValue(visibleValue);
                            if (oneTime) {
                                observerRef.current.disconnect();
                            }
                        } else {
                            setVisibleValue(inVisibleValue);
                        }
                    });
                },
                { threshold }
            );

            observerRef.current.observe(ref.current);
        }
    }, [onVisible, threshold, visibleValue, inVisibleValue, oneTime]);

    useEffect(() => {
        handleVisibility();
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleVisibility]);

    const calculateElementTopVisibility = useCallback(() => {
        if (ref.current) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const iframeWindow = iframe.contentWindow;
    
                const rect = ref.current.getBoundingClientRect();
    
                // The viewport's dimensions relative to the iframe
                const viewportHeight = iframeWindow.innerHeight;
                const viewportTop = iframeWindow.scrollY || iframeDocument.documentElement.scrollTop;  // Top of the iframe viewport
                const viewportBottom = viewportTop + viewportHeight;  // Bottom of the iframe viewport
    
                // Element's top and bottom relative to the iframe's viewport
                const elementTop = rect.top + viewportTop;
                const elementBottom = rect.bottom + viewportTop;
    
                // Determine the visible part of the element
                const visibleTop = Math.max(viewportTop, elementTop);
                const visibleBottom = Math.min(viewportBottom, elementBottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
                // Calculate the percentage of the element's height that is visible
                const elementHeight = rect.height;
                console.log(elementHeight, visibleHeight)
                const visiblePercentageVertical = (visibleHeight / elementHeight) * 100;
    
                setVisibleTopValue(visiblePercentageVertical);
            }
        }
    }, []);
    

    useEffect(() => {
        if (calculateVisibility) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeWindow = iframe.contentWindow;
                iframeWindow.addEventListener('scroll', calculateElementTopVisibility);
                return () => iframeWindow.removeEventListener('scroll', calculateElementTopVisibility);
            }
        }
    }, [calculateVisibility, calculateElementTopVisibility]);

    useEffect(() => {
        updateStates('updatedVisibleValue', vValue);
    }, [vValue]);

    useEffect(() => {
        updateStates('updatedTopValue', sTValue);
    }, [sTValue]);

    useEffect(() => {
        updateStates('updatedLeftValue', sLValue);
    }, [sLValue]);

    const deAttach = useCallback(() => {
        if (oneTime) {
            const iframe = document.querySelector("#ac-editor-iframe-doc");
            if (iframe) {
                const iframeWindow = iframe.contentWindow;
                iframeWindow.removeEventListener('scroll', calculateElementTopVisibility);
            }
        }
    }, [oneTime, calculateElementTopVisibility]);

    useEffect(() => {
        if (vTValue) {
            updateStates('visibleY', vTValue);
            if (vTValue >= 100) deAttach();
        }
    }, [vTValue, oneTime]);

    return React.createElement(tagName, { ref }, children);
};

export default Observable;