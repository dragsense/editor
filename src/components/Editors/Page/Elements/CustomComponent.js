
import React, { useEffect, useMemo } from "react";



import ElementSetting from "./ElementSetting";
import { getStateValue, updateStateValue, generateCascaderCollStates, getStateRef, generateCascader } from '../../../../lib/element/elementNode';


const CustomComponent = (props) => {

    const { children, customPath, node, _states, _props, onUpdateStates, mapValue, mapIndex } = props;


    const loadComponent = async (path) => {
    };

    useEffect(() => {
        loadComponent(customPath);
    }, [])

    const states = useMemo(() => {
        if (!_states) {
            return {};
        }

        return Object.keys(_states).reduce((accumulator, key) => {
            accumulator[key] = _states[key].defaultValue;
            return accumulator;
        }, {});

    }, [_states]);

    const computedProps = useMemo(() => {
        if (!_props) {
            return {};
        }

        return Object.keys(_props).reduce((accumulator, key) => {
            accumulator[key] = _props[key].defaultValue;
            return accumulator;
        }, {});
    }, [_props]);

    const updateStates = (key, value, type) => {
        if(onUpdateStates)
        onUpdateStates(key, value, type)
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