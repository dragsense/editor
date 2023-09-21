import React, { useEffect } from "react";

import ElementSetting from "./ElementSetting";
import { getStates } from '../../../../lib/element/elementNode';

// CustomComponent is a component that loads a custom component from a given path and manages its states and props
const CustomComponent = (props) => {

    const { children, customPath, node, _states, _props, onSetStates, mapValue, mapIndex } = props;

    // Function to load the custom component
    const loadComponent = async (path) => {
        // logic to load component
    };

    // useEffect to load the component when the component mounts
    useEffect(() => {
        loadComponent(customPath);
    }, [])

    // Function to get the state value for a given key
    const getStateValue = (key) => {
        if (!_states || key) {
            return null;
        }
        return getStates(key, _states)
    };

    // Function to get the prop value for a given key
    const getPropValue = (key) => {
        if (!_states || key) {
            return null;
        }
        return getStates(key, _props)
    };

    // Function to update the state for a given key and value
    const updateState = (key, value) => {
        if (onSetStates) {
            onSetStates(key, value, 'STATES')
        }
    }

    // Function to update the prop for a given key and value
    const updateProp = (key, value) => {
        if (onSetStates) {
            onSetStates(key, value, "PROPS")
        }
    }

    return (
            <ElementSetting
                {...props}
                attributes={node.attributes}
                classes={node.classes}
                conditions={node.conditions}
                mapValue={mapValue}
                mapIndex={mapIndex}
            >
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '5px', backgroundColor: '#f2f2f2', padding: '5px 10px', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>&lt;{customPath}&gt;</div>
                {children}
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '5px', backgroundColor: '#f2f2f2', padding: '5px 10px', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>&lt;/{customPath}&gt;</div>
            </ElementSetting>
    );


};


export default CustomComponent;