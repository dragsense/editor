import { Input, Space, Select, Button, Slider, Tooltip, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md';
import TextShadow from '../Shadow/TextShadow';

const filterTypes = [
    'blur',
    'brightness',
    'contrast',
    'drop-shadow',
    'grayscale',
    'hue-rotate',
    'invert',
    'opacity',
    'saturate',
    'sepia',
];




export default function Filter({ style, properties,
    onChangeStyle, }) {
    const [type, setType] = useState('none');
    const [value, setValue] = useState(0);
    const [inset, setInset] = useState(0);


    const dropShadow = {
        getPropertyPriority: () => { },
        getPropertyValue: () => {
            return `${value}`;
        },
        setProperty: (_, value, priority) => {
            setValue(value);

            properties['filter']['value'] = `${type}(${value})`;
            style.setProperty('filter', `${type}(${value})`, priority);
        }
    }



    const [stylePriority, setStylePriority] = useState({
        "filter": '',
    });

    useEffect(() => {

        if (!properties) {
            return;
        }

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }

        setStylePriority(priorities);


        if (!properties["filter"])
            properties["filter"] = {};

        const filterType = properties["filter"].type;
        const filterValue = properties["filter"].value;

        setType(filterType);
        if(filterType === 'drop-shadow')
        setValue(filterValue);
        else
        setValue(parseFloat(filterValue));


    }, [properties])

    const handleTypeChange = (newType) => {

        let unit = '';

        if (newType === 'hue-rotate')
            unit = 'deg'
        else
            if (newType === 'blur')
                unit = 'px'


        if (!properties['filter'])
            properties['filter'] = {};

        properties['filter']['type'] = newType;

        style.setProperty('filter', `${newType}(${value}${unit})`, stylePriority.filter);
        setType(newType)
        onChangeStyle();

    };

    const handleValueChange = (newValue) => {

        let unit = '';

        if (type === 'hue-rotate')
            unit = 'deg'
        else
            if (type === 'blur')
                unit = 'px'

        if (!properties['filter'])
            properties['filter'] = {};

        properties['filter']['value'] = `${type}(${newValue}${unit})`;

        style.setProperty('filter', `${type}(${newValue}${unit})`, stylePriority.filter);

        setValue(newValue);
        onChangeStyle();

    };

    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        if (!properties['filter'])
            properties['filter'] = {};
        properties['filter'].priority = priority;
        setStylePriority({ ...stylePriority, filter: priority })
        style.setProperty('filter', style.filter, stylePriority.filter);
        onChangeStyle();

    }


    const maxs = type === 'hue-rotate' ? 360 : type === 'blur' ? 30 : 1;
    const steps = type === 'hue-rotate' ? 1 : 0.01;

    const isDropShadow = type === 'drop-shadow';

    return (
        style && <>

            <div>
                <div style={{ marginBottom: "10px" }}>
                    <strong>Filter: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            checked={stylePriority.filter === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}

                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties["filter"])
                                delete properties["filter"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "filter": "" })   
                                                         style.removeProperty('filter');
                            }}

                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select style={{ width: "100%" }} value={type} onChange={(value) => handleTypeChange(value)}>
                        <option value='none'>None</option>
                        {filterTypes.map((filterType) => (
                            <option key={filterType} value={filterType}>
                                {filterType}
                            </option>
                        ))}
                    </Select>
                    {(type !== 'none' && !isDropShadow) && <>
                        <Slider
                            min={0}
                            max={maxs}
                            step={steps}
                            value={value}
                            onChange={handleValueChange}
                            tooltipVisible
                        />

                    </>
                    }
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {type !== 'none' && <Input disabled value={value} onChange={(e) => handleValueChange(e.target.value)} />}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {isDropShadow && <TextShadow style={dropShadow} properties={(() => {

                        if (!properties['filter'])
                            properties['filter'] = {}

                        return properties['filter'];

                    })()}
                        onChangeStyle={onChangeStyle}

                    />}
                </div>

            </div>
        </>

    );

}