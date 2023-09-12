
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '../../../../../lib/utils'

const Select = (props) => {
    const { onChange, value, onClick, conds, children, innerWraaper } = props;

    const ref = useRef(null);
    const [values, setValues] = useState('');

    const onChangeValue = (e) => {

        const fun = (e) => {
            let selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);

            if (selectedValues.includes("all"))
            selectedValues = ['all'];
                //selectedValues = Array.from(e.target.options).filter(option => option.value !== 'all').map(opt => opt.value);
                

            onChange(selectedValues.join(','), selectedValues.includes("all"));
        }


        if (onChange)
            debounce(fun(e), 500)
    }

    useEffect(() => {

        if (!ref.current)
            return;

        if (typeof value === 'string') {
            const selectElement = ref.current;
            const selectedOptions = value.split(',');
            if (selectElement) {
                const optionsLength = selectElement.options.length;
                const selectedLength = selectedOptions.length;

                if (selectedLength > 0) {
                    for (let i = optionsLength - 1; i > -1; i--) {
                        selectElement.options[i].selected = selectedOptions.includes(selectElement.options[i].value);
                    }
                }
            }
        }

    }, [value, ref.current])

  
    const SelectElement = <div style={{ display: 'inline-block' }}><div style={{
            outline: '1px dashed #bdbdbd', cursor: 'pointer',
            padding: '10px',
            borderRadius: 5,
            display: 'inherit',
        }} className="ac-000-yrbQEpZzT">
        {React.cloneElement(children, { customAttributes: { ref, onChange: onChangeValue } }, innerWraaper)}

    </div>
    </div>



    return conds ? SelectElement : null;

};

export default Select;