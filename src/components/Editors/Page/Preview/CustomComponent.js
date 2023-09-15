
import React, { useEffect, useMemo } from "react";



import ElementSetting from "./ElementSetting";
import { getStates } from '../../../../lib/element/elementNode';


const CustomComponent = (props) => {

    const { children, customPath, node, _states, _props, onSetStates, mapValue, mapIndex } = props;


    const loadComponent = async (path) => {
    };

    useEffect(() => {
        loadComponent(customPath);
    }, [])

    const getStateValue = (key) => {
        if (!_states || key) {
            return null;
        }
        return getStates(key, _states)

    };

    const getPropValue = (key) => {
        if (!_states || key) {
            return null;
        }
        return getStates(key, _props)

    };


    const updateState = (key, value) => {
        if (onSetStates)
            onSetStates(key, value, 'STATES')
    }

    const updateProp = (key, value) => {
        if (onSetStates)
            onSetStates(key, value, "PROPS")
    }

    return (
        <span style={{border: '#ffaa4f5e solid 1px', display:'inline-block', width: '-webkit-fill-available'  }}>

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

        </span>
    );


};


export default CustomComponent;