

import React, { useState, useCallback, useEffect } from "react";
import ElementMapping from './ElementMapping';

import { getData, getAllData } from "../../../../lib/db";
import { updateStateValue, getStateRef, generateCascader } from '../../../../lib/element/elementNode';

const ElementComponent = (props) => {

    const { node, _id, fun, children, onUpdateStates } = props;

    const [states, setStates] = useState(node.states);
    const [state, setState] = useState(null);


    const setValue = async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;


        switch (type) {
            case 'Menu': case 'Flex': case 'Tabs': case 'Accordion': case 'Sider':
            case 'Grid': case 'Container': case 'Slider': case 'Gallery': case 'Dropdown':
            case 'Dropdown': case 'Observable': case 'Modal': case 'GoToTop':
                updateStateValue(elem, withValue, states, value);
                setStates({ ...states });
            default:
                return;
        }

    }



    useEffect(() => {

        if (!node)
            return;

        setStates({ ...node.states });
        const cascaderStates = generateCascader(node.states, node.name, node.cname);
        onUpdateStates(node.cname, cascaderStates, setStates)

    }, []);

    useEffect(() => {

        if (!state)
            return;
        const { elem, stateValue, withValue } = state;
        setValue(elem, stateValue, withValue);
    }, [state]);

    const onClick = useCallback(async (node, stateValue, withValue) => {

        if (node && node.onClick) {
            const elem = node.onClick;
            setState({ elem, stateValue, withValue })

            if (fun?.onClick)
                fun.onClick(node, stateValue, withValue)
        }

    }, [states]);

    const updateStates = useCallback(async (key, value, updateKey = 'defaultValue') => {

        const stateRef = states[key];

        if (!stateRef)
            return;

        if (key === 'items') {


            const oldValues = Array.isArray(states['items'].states) ? states['items'].states : []
            const values = Array.from({ length: parseInt(value) }, (_, index) => {
                return oldValues[index] || `${states['items'].text || "Item"} ${index + 1}`
            });
            states['items'] = {
                ...(states['items'] || {}),
                states: values
            };


            states['total'] = { ...(states['total'] || {}), max: value, defaultValue: value };
            if (states['currentIndex']) {
                const loop = states['loop'] ? states['loop'].defaultValue : false;

                states['currentIndex']['max'] = loop ? value + 1 : value;
                states['currentIndex']['min'] = loop ? -1 : 0;
            }

        } else
            stateRef[updateKey] = value;

        setStates({ ...states });
    }, [states]);



    const onChange = useCallback(async (values, node, all = false) => {




        for (const elem of values) {
            let value = elem.value;
            const onChange = elem.elem;
            setValue(onChange, value, '');
        }


        if (fun?.onChange)
            fun.onChange(values, node, all)

    }, [states]);




    return <span style={{ border: '#ffaa4f5e solid 1px', display: 'inline-block', width: '-webkit-fill-available' }}><ElementMapping
        {...props} map={node.map}
        _cstates={states}
        updateStates={updateStates}
        fun={{
            onChange: onChange,
            onClick: onClick,
        }}
        onClick={onClick}>
        {React.Children.map(children, (child, i) => {
            return child && React.cloneElement(child, {
                index: i,
                fun: {
                    onChange: onChange,
                    onClick: onClick,
                },
                _cstates: states,
                updateStates: updateStates
            })
        })}
    </ElementMapping>
    </span>



};


export default ElementComponent;