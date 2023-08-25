import { message, Space, Collapse, Slider, InputNumber, Checkbox, Select, Tooltip, Button, Dropdown } from 'antd';

import { useEffect, useState } from 'react';

import { MdRestartAlt } from 'react-icons/md';

import Overflow from './Overflow';

import ThemeServices from '../../../../lib/services/theme';

import { CgGlobeAlt } from 'react-icons/cg';


const objectSizes = ['none', 'contain', 'cover', 'fill', 'scale-down'];

const units = ['px', '%', 'em', 'rem', 'vh', 'vw'];

const { Option } = Select;
const { Panel } = Collapse;

export default function Size({ style, properties, onChangeStyle }) {


    const [widthUnit, setWidthUnit] = useState(units[0]);
    const [heightUnit, setHeightUnit] = useState(units[0]);
    const [maxWidthUnit, setMaxWidthUnit] = useState(units[0]);
    const [maxHeigthUnit, setMaxHeightUnit] = useState(units[0]);

    const [minWidthUnit, setMinWidthUnit] = useState(units[0]);
    const [minHeigthUnit, setMinHeightUnit] = useState(units[0]);

    const [variables, setVariables] = useState([]);


    const [stylePriority, setStylePriority] = useState({
        width: '',
        height: '',
        maxWidth: '',
        maxHeight: '',
        minWidth: '',
        minHeight: '',
        objectFit: '',
        overflowX: '',
        overflowY: ''
    });

    const load = async () => {
        try {
            const resVaraibles = await ThemeServices.getVariables();


            if(resVaraibles.variables)
            setVariables(resVaraibles.variables.data)


        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {
        load();
    }, []);


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

        setWidthUnit(properties["width"]?.unit || 'px');
        setHeightUnit(properties["height"]?.unit || 'px')
        setMaxWidthUnit(properties["max-width"]?.unit || 'px');
        setMaxHeightUnit(properties["max-height"]?.unit || 'px');
        setMinWidthUnit(properties["min-width"]?.unit || 'px');
        setMinHeightUnit(properties["min-height"]?.unit || 'px');






    }, [properties])

    const onChange = (dataName, name, value) => {


        let unit = '';
        if (name === 'width') {
            value = value + widthUnit;
            unit = widthUnit;
        }
        else
            if (name === 'height') {
                value = value + heightUnit;
                unit = heightUnit;

            }
            else
                if (name === 'maxWidth') {
                    value = value + maxWidthUnit;
                    unit = maxWidthUnit;

                }
                else
                    if (name === 'maxHeight') {
                        value = value + maxHeigthUnit;
                        unit = maxHeigthUnit;

                    }
                    else
                        if (name === 'minWidth') {
                            value = value + minWidthUnit;
                            unit = minWidthUnit;

                        }
                        else
                            if (name === 'minHeight') {
                                value = value + minHeigthUnit;
                                unit = minHeigthUnit;

                            }

        if (!properties[dataName])
            properties[dataName] = {};

        properties[dataName].value = value;
        properties[dataName].unit = unit;

        style.setProperty(dataName, value, stylePriority[name]);

        onChangeStyle(); setStylePriority({ ...stylePriority });

    }

    const onChangeWidthUnit = (value) => {

        if (!properties["width"])
            properties["width"] = {};

        properties["width"].unit = value;

        style.setProperty('width', style.width, stylePriority.width);
        setWidthUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangeHeightUnit = (value) => {
        if (!properties["height"])
            properties["height"] = {};

        properties["height"].unit = value;
        style.setProperty('height', style.height, stylePriority.height);
        setHeightUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangeMaxWidthUnit = (value) => {
        if (!properties["max-width"])
            properties["max-width"] = {};

        properties["max-width"].unit = value;
        style.setProperty('max-width', style.maxWidth, stylePriority.maxWidth);
        setMaxWidthUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangeMaxHeightUnit = (value) => {
        if (!properties["max-height"])
            properties["max-height"] = {};

        properties["max-height"].unit = value;
        style.setProperty('max-height', style.maxHeight, stylePriority.maxHeight);
        setMaxHeightUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChangeMinWidthUnit = (value) => {
        if (!properties["min-width"])
            properties["min-width"] = {};

        properties["min-width"].unit = value;
        style.setProperty('min-width', style.minWidth, stylePriority.minWidth);
        setMinWidthUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChangeMinHeightUnit = (value) => {
        if (!properties["min-height"])
            properties["min-height"] = {};

        properties["min-height"].unit = value;
        style.setProperty('min-height', style.minHeight, stylePriority.minHeight);
        setMinHeightUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChangeSize = (value) => {

        if (!properties["object-fit"])
            properties["object-fit"] = {};

        properties["object-fit"].value = value;
        style.setProperty('object-fit', value, stylePriority.objectFit);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';

        if (!properties[_name])
            properties[_name] = {}

        properties[_name].priority = priority;

        setStylePriority({ ...stylePriority, [name]: priority })
        style.setProperty(_name, style[name], priority);
        onChangeStyle();


    }

    const onChangeVariable = (dataName, name, value, unit = undefined, label = undefined) => {


        if (!properties[dataName])
            properties[dataName] = {};


        properties[dataName].value = value;
        properties[dataName].unit = unit;
        properties[dataName].label = label;

        style.setProperty(dataName, value, stylePriority.color);

 
        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }


    const sizes = variables.filter((variable) => variable.type === 'size').map((v, i) => { return { variable: v.variable, label: v.name, key: i } });




    return style ?
        <Collapse defaultActiveKey={['1']} accordion ghost>
            <Panel header="Size" key="1">

                <div style={{ marginBottom: "10px" }}>
                    <strong>Width: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name="width" data-name="width" checked={stylePriority.width === 'important'} onChange={onChangePriority}>
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle();

                                if (properties['width'])
                                delete properties['width'];

                                setStylePriority({ ...stylePriority, width: '' });

                                style.removeProperty('width');

                            }}
                            className="ac-icons-btn"
                        />
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map((u) => (
                            <span
                                key={u}
                                onClick={(e) => {
                                    e.preventDefault();

                                    onChangeWidthUnit(u);
                                }}
                                style={{ color: u === widthUnit ? '#f88a24' : '', cursor: 'pointer' }}
                            >
                                {u.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.width)}
                            onChange={(value) => { onChange('width', 'width', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.width)}
                            onChange={(value) => { onChange('width', 'width', value); }}
                            style={{ width: '30%' }}

                        />

                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]
                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('width', 'width', value, widthUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}

                    </div>



                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>Height: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='height' data-name="height" checked={stylePriority.height === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['height'])
                                delete properties['height'];


                                onChangeStyle(); setStylePriority({ ...stylePriority, height: '' });

                                style.removeProperty('height');
                            }}
                            className="ac-icons-btn"
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeHeightUnit(u) }} style={{ color: u === heightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                            {u.toUpperCase()}
                        </span>)}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.height)}
                            onChange={(value) => { onChange('height', 'height', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.height)}
                            onChange={(value) => { onChange('height', 'height', value); }}
                            style={{ width: '30%' }}

                        />


                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('height', 'height', value, heightUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}
                    </div>

                </div>


            </Panel>
            <Panel header="Minimum Size" key="2">


                <div style={{ marginBottom: "10px" }}>
                    <strong>Min Width: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='minWidth' data-name="min-width" checked={stylePriority.minWidth === 'important'} onChange={onChangePriority}>
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['min-width'])
                                    delete properties['min-width'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, minWidth: '' });


                                style.removeProperty('min-width');

                            }}
                            className="ac-icons-btn"
                        />
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map((u) => (
                            <span
                                key={u}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChangeMinWidthUnit(u);
                                }}
                                style={{ color: u === minWidthUnit ? '#f88a24' : '', cursor: 'pointer' }}
                            >
                                {u.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.minWidth)}
                            onChange={(value) => { onChange('min-width', 'minWidth', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.minWidth)}
                            onChange={(value) => { onChange('min-width', 'minWidth', value); }}
                            style={{ width: '30%' }}

                        />

                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('min-width', 'minWidth', value, minWidthUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}

                    </div>



                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>Min Height: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='minHeight' data-name="min-height" checked={stylePriority.minHeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();


                                if (properties['min-height'])
                                    delete properties['min-height'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, minHeight: '' });

                                style.removeProperty('min-height');
                            }}
                            className="ac-icons-btn"
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeMinHeightUnit(u) }} style={{ color: u === minHeigthUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                            {u.toUpperCase()}
                        </span>)}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.minHeight)}
                            onChange={(value) => { onChange('min-height', 'minHeight', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.minHeight)}
                            onChange={(value) => { onChange('min-height', 'minHeight', value); }}
                            style={{ width: '30%' }}

                        />

                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('min-height', 'minHeight', value, minWidthUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}

                    </div>

                </div>

            </Panel>
            <Panel header="Maximum Size" key="3">



                <div style={{ marginBottom: "10px" }}>
                    <strong>Max Width: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='maxWidth' data-name="max-width" checked={stylePriority.maxWidth === 'important'} onChange={onChangePriority}>
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['max-width'])
                                    delete properties['max-width'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, maxWidth: '' });

                                style.removeProperty('max-width');

                            }}
                            className="ac-icons-btn"
                        />
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map((u) => (
                            <span
                                key={u}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChangeMaxWidthUnit(u);
                                }}
                                style={{ color: u === maxWidthUnit ? '#f88a24' : '', cursor: 'pointer' }}
                            >
                                {u.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.maxWidth)}
                            onChange={(value) => { onChange('max-width', 'maxWidth', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.maxWidth)}
                            onChange={(value) => { onChange('max-width', 'maxWidth', value); }}
                            style={{ width: '30%' }}

                        />

                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('max-width', 'maxWidth', value, minWidthUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}
                    </div>



                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>Max Height: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='maxHeight' data-name="max-height" checked={stylePriority.maxHeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['max-height'])
                                    delete properties['max-height'];


                                onChangeStyle(); setStylePriority({ ...stylePriority, maxHeight: '' });

                                style.removeProperty('max-height');
                            }}
                            className="ac-icons-btn"
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeMaxHeightUnit(u) }} style={{ color: u === maxHeigthUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                            {u.toUpperCase()}
                        </span>)}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={1200}
                            step={0.1}

                            value={parseFloat(style.maxHeight)}
                            onChange={(value) => { onChange('max-height', 'maxHeight', value); }}
                            style={{ width: '70%' }}
                        />
                        <InputNumber
                            value={parseFloat(style.maxHeight)}
                            onChange={(value) => { onChange('max-height', 'maxHeight', value); }}
                            style={{ width: '30%' }}

                        />

                        {sizes && (
                            <Dropdown menu={{
                                 items: sizes, onClick: ({ key }) => {
                                    const variable = sizes[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChangeVariable('max-height', 'maxHeight', value, minWidthUnit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}

                    </div>

                </div>

            </Panel>
            <Panel header="Object Fit" key="4" >
                <div style={{ marginBottom: "10px" }}>
                    <strong>Object Fit:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='objectFit' data-name="object-fit" checked={stylePriority.objectFit === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['object-fit'])
                                    delete properties['object-fit'];

                                onChangeStyle(); 
                                setStylePriority({ ...stylePriority, objectFit: '' });

                                style.removeProperty('object-fit');
                            }}
                        ></Button>
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <Select
                        placeholder="Select Option"
                        value={style.objectFit}
                        onChange={onChangeSize}
                        style={{ width: '100%' }}
                    >
                        {objectSizes.map(s => <Option value={s}>{s}</Option>)}
                    </Select>

                </div>
            </Panel>
            <Panel header="Overflow" key="5">
                <Overflow style={style}
                    onChangeStyle={onChangeStyle}
                    properties={properties}
                    setStylePriority={setStylePriority}
                    stylePriority={stylePriority} />
            </Panel>


        </Collapse>

        : <></>


}


