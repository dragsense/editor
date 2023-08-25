import { message, Space, Checkbox, Slider, Select, Button, Tooltip, InputNumber, Dropdown } from 'antd';
import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'
import ThemeServices from '../../../../lib/services/theme';
import { CgGlobeAlt } from 'react-icons/cg';

const units = ['px', '%', 'em', 'rem'];
const { Option } = Select;

export default function _Spacing({ style, type, stylePriority, properties,
    setStylePriority, onChangeStyle }) {


    const [lock, setLock] = useState(true);

    const [topUnit, setTopUnit] = useState(units[0]);
    const [leftUnit, setLeftUnit] = useState(units[0]);
    const [bottomUnit, setBottomUnit] = useState(units[0]);
    const [rightUnit, setRightUnit] = useState(units[0]);

    const [variables, setVariables] = useState([]);


    useEffect(() => {

        if (!properties) {
            return;
        }

        if (properties[`${type}-top`]?.value === properties[`${type}-left`]?.value &&
            properties[`${type}-left`]?.value === properties[`${type}-bottom`]?.value &&
            properties[`${type}-bottom`]?.value === properties[`${type}-right`]?.value)
            setLock(true);
        else
            setLock(false)


        setTopUnit(properties[`${type}-top`]?.unit || 'px')

        setLeftUnit(properties[`${type}-left`]?.unit || 'px')

        setBottomUnit(properties[`${type}-bottom`]?.unit || 'px')

        setRightUnit(properties[`${type}-right`]?.unit || 'px')

    }, []);

    const load = async () => {
        try {
            const resVaraibles = await ThemeServices.getVariables();

            if (resVaraibles.variables)
                setVariables(resVaraibles.variables.data)

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {
        load();
    }, []);

    const spaces = variables.filter((variable) => variable.type === 'space').map((v, i) => { return { variable: v.variable, label: v.name, key: i } });


    const onChange = (name, value, unit) => {

        if (!lock) {


            const dataName = type + '-' + name.toLowerCase();

            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;


            style.setProperty(dataName, value, stylePriority[type + name]);
        }
        else {



            let dataName = type + '-top';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = type + '-bottom';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;

            dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = value;
            properties[dataName].unit = unit;



            style.setProperty(type + '-top', value, stylePriority[`${type}Top`]);
            style.setProperty(type + '-right', value, stylePriority[`${type}Right`]);
            style.setProperty(type + '-bottom', value, stylePriority[`${type}Bottom`]);
            style.setProperty(type + '-left', value, stylePriority[`${type}Left`]);

        }



        onChangeStyle(); setStylePriority({ ...stylePriority });



    }



    const onChangeUnit = (unit, setValue, propName) => {
        setValue(unit);
        const val = `${parseFloat(style[propName] || 0) + unit}`;

        if (!lock) {


            if (!properties[propName])
                properties[propName] = {}

            properties[propName].unit = unit;

            style.setProperty(propName, val, stylePriority[propName]);
        } else {

            let dataName = type + '-top';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = unit;

            dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = unit;

            dataName = type + '-bottom';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = unit;

            dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].unit = unit;

            style.setProperty(type + '-top', val, stylePriority[`${type}Top`]);
            style.setProperty(type + '-right', val, stylePriority[`${type}Right`]);
            style.setProperty(type + '-bottom', val, stylePriority[`${type}Bottom`]);
            style.setProperty(type + '-left', val, stylePriority[`${type}Left`]);
        }

        onChangeStyle(); setStylePriority({ ...stylePriority });


    };



    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';



        if (!lock) {

            const _name = type + '-' + name.toLowerCase()

            if (!properties[_name])
                properties[_name] = {}

            properties[_name].priority = priority;

            style.setProperty(_name, style[type + name], priority);
            setStylePriority({ ...stylePriority, [type + name]: priority })

        } else {

            let dataName = type + '-top';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].priority = priority;

            dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].priority = priority;

            dataName = type + '-bottom';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].priority = priority;

            dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].priority = priority;

            setStylePriority({
                ...stylePriority,
                [`${type}`]: priority,
                [`${type}Top`]: priority,
                [`${type}Left`]: priority,
                [`${type}Bottom`]: priority,
                [`${type}Right`]: priority,
            })
            style.setProperty(type + '-top', style[`${type}Top`], priority);
            style.setProperty(type + '-right', style[`${type}Right`], priority);
            style.setProperty(type + '-bottom', style[`${type}Bottom`], priority);
            style.setProperty(type + '-left', style[`${type}Left`], priority);

        }

        onChangeStyle();


    }

    const onChangeRightAuto = (e) => {

        if (!lock) {
            style.setProperty(`${type}-right`, 'auto', stylePriority[`${type}Right`]);
            let dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';
        }
        else {


            let dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';

            dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';


            style.setProperty(type + '-left', 'auto', stylePriority[`${type}Left`]);
            style.setProperty(type + '-right', 'auto', stylePriority[`${type}Right`]);
        }
        onChangeStyle(); setStylePriority({ ...stylePriority });

    }

    const onChangeLeftAuto = (e) => {
        if (!lock) {
            style.setProperty(type + '-left', 'auto', stylePriority[`${type}Left`]);

            let dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';
        }
        else {


            let dataName = type + '-left';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';

            dataName = type + '-right';
            if (!properties[dataName])
                properties[dataName] = {}

            properties[dataName].value = 'auto';



            style.setProperty(type + '-left', 'auto', stylePriority[`${type}Left`]);
            style.setProperty(type + '-right', 'auto', stylePriority[`${type}Right`]);
        }
        onChangeStyle(); setStylePriority({ ...stylePriority });

    }


    const resetStyle = (e) => {
        e.preventDefault();

        if (properties[type]) {
            properties[type] = {};
        }
        style.removeProperty(type);

        if (properties[`${type}-left`]) {
            delete properties[`${type}-left`];
        }
        style.removeProperty(`${type}-left`);

        if (properties[`${type}-top`]) {
            delete properties[`${type}-top`];
        }
        style.removeProperty(`${type}-top`);

        if (properties[`${type}-bottom`]) {
            delete properties[`${type}-bottom`];
        }
        style.removeProperty(`${type}-bottom`);

        if (properties[`${type}-right`]) {
            delete properties[`${type}-right`];
        }
        style.removeProperty(`${type}-right`);

        onChangeStyle();
        setStylePriority({
            ...stylePriority,
            [`${type}Left`]: '',
            [`${type}Top`]: '',
            [`${type}Right`]: '',
            [`${type}Bottom`]: '',
        });
    };


    return <div>
        <div style={{ marginBottom: "10px" }}>
            <Button type={lock ? 'primary' : 'default'} onClick={(e) => {

                e.preventDefault();
                setLock(!lock);


            }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>

            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: "right" }}

                    size="small"
                    icon={<MdRestartAlt size="small" />}
                    onClick={resetStyle}
                ></Button>
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="top"
                onChange={(value) => {

                    onChange("Top", value + topUnit, topUnit)
                }}
                type='number' name="Top"
                value={parseFloat(style[`${type}Top`])}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={topUnit}
                        onChange={(value) => onChangeUnit(value, setTopUnit, `${type}-top`)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Checkbox
                        name="Top"
                        size="small"
                        checked={stylePriority[`${type}Top`] === "important"}
                        onChange={onChangePriority}
                    >
                        !
                    </Checkbox>
                </>
                }
            />
            <Slider
                min={0}
                max={72}
                step={0.1}

                value={parseFloat(style[`${type}Top`])}
                onChange={(value) => {

                    onChange("Top", value + topUnit, topUnit)
                }} style={{ width: '100%' }}
            />

            {spaces && (
                <Dropdown menu={{
                    items: spaces, onClick: ({ key }) => {
                        const variable = spaces[key]
                        if (!variable)
                            return;

                        const value = `var(${variable.variable})`
                        onChange('Top', value, topUnit)
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

        {/* 
            <Space size={1} direction='vertical'>



                <div>
                    {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeTopUnit(u) }} style={{ color: u === topUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>

                <Input type='number' name="Top" value={parseFloat(style[`${type}Top`])} onChange={onChange} />
                <Checkbox name='Top' checked={stylePriority[`${type}Top`] === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>

            </Space> */}


        <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="right"
                onChange={(value) => {

                    onChange("Right", value + rightUnit, rightUnit)
                }}
                type='number' name="Right" value={parseFloat(style[`${type}Right`])}
                addonAfter={<>
                    <div>
                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={rightUnit}
                            onChange={(value) => onChangeUnit(value, setRightUnit, `${type}-right`)}
                        >
                            {units.map((unit, i) => (
                                <Option key={i} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                        {"  "}

                        <Checkbox
                            name="Right"
                            size="small"
                            checked={stylePriority[`${type}Right`] === "important"}
                            onChange={onChangePriority}
                        >
                            !
                        </Checkbox>

                    </div>


                </>
                }
            />
            <Slider
                min={0}
                max={72}
                step={0.1}

                value={parseFloat(style[`${type}Right`])}
                onChange={(value) => {

                    onChange("Right", value + rightUnit, rightUnit)
                }} style={{ width: '100%' }}
            />

            {spaces && (
                <Dropdown menu={{
                    items: spaces, onClick: ({ key }) => {
                        const variable = spaces[key]
                        if (!variable)
                            return;

                        const value = `var(${variable.variable})`
                        onChange('Right', value, rightUnit)
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

            {type === 'margin' && <Checkbox name="Right" checked={style[`${type}Right`] === 'auto'} onChange={onChangeRightAuto}>auto</Checkbox>}

        </div>

        {/* <Space size={1} direction='vertical'>
                <div>
                    {!lock && units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeRightUnit(u) }} style={{ color: u === rightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="Right" value={parseFloat(style[`${type}Right`])} onChange={onChange} />
                {type === 'margin' && <Checkbox name="Right" checked={style[`${type}Right`] === 'auto'} onChange={onChangeRightAuto}>auto</Checkbox>}
                {!lock && <Checkbox name="Right" checked={stylePriority[`${type}Right`] === 'important'} onChange={onChangePriority}>important</Checkbox>
                }
            </Space> */}


        <div style={{ marginBottom: "10px" }}>
            <InputNumber

                size="small"
                placeholder="bottom"
                onChange={(value) => {
                    console.log(value)
                    onChange("Bottom", value + bottomUnit, bottomUnit)
                }}
                type='number' name="Bottom" value={parseFloat(style[`${type}Bottom`])}
                addonAfter={<>
                    <Select
                        style={{ width: 60 }}
                        size="small"
                        value={bottomUnit}
                        onChange={(value) => onChangeUnit(value, setBottomUnit, `${type}-bottom`)}
                    >
                        {units.map((unit, i) => (
                            <Option key={i} value={unit}>
                                {unit}
                            </Option>
                        ))}
                    </Select>
                    {"  "}
                    <Checkbox
                        name="Bottom"
                        size="small"
                        checked={stylePriority[`${type}Bottom`] === "important"}
                        onChange={onChangePriority}
                    >
                        !
                    </Checkbox>
                </>
                }
            />
            <Slider
                min={0}
                max={72}
                step={0.1}

                value={parseFloat(style[`${type}Bottom`])}
                onChange={(value) => {

                    onChange("Bottom", value + bottomUnit, bottomUnit)
                }} style={{ width: '100%' }}
            />

            {spaces && (
                <Dropdown menu={{
                    items: spaces, onClick: ({ key }) => {
                        const variable = spaces[key]
                        if (!variable)
                            return;

                        const value = `var(${variable.variable})`
                        onChange('Bottom', value, bottomUnit)
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

        {/* <Space size={1} direction='vertical'>
                <div>
                    {!lock && units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeBottomUnit(u) }} style={{ color: u === bottomUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="Bottom" value={parseFloat(style[`${type}Bottom`])} onChange={onChange} />
                {!lock && <Checkbox name="Bottom" checked={stylePriority[`${type}Bottom`] === 'important'} onChange={onChangePriority}>important</Checkbox>
                }
            </Space> */}

        <div style={{ marginBottom: "10px" }}>
            <InputNumber
                style={{ height: '100%' }}
                size="small"
                placeholder="left"
                onChange={(value) => {

                    onChange("Left", value + rightUnit, rightUnit)
                }}
                type='number' name="Left" value={parseFloat(style[`${type}Left`])}
                addonAfter={<>



                    <div>


                        <Select
                            style={{ width: 60 }}
                            size="small"
                            value={rightUnit}
                            onChange={(value) => onChangeUnit(value, setLeftUnit, `${type}-left`)}
                        >
                            {units.map((unit, i) => (
                                <Option key={i} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                        {"  "}
                        <Checkbox
                            name="Left"
                            size="small"
                            checked={stylePriority[`${type}Left`] === "important"}
                            onChange={onChangePriority}
                        >
                            !
                        </Checkbox>
                    </div>


                </>
                }
            />
            <Slider
                min={0}
                max={72}
                step={0.1}

                value={parseFloat(style[`${type}Left`])}
                onChange={(value) => {

                    onChange("Left", value + rightUnit, rightUnit)
                }} style={{ width: '100%' }}
            />

            {spaces && (
                <Dropdown menu={{
                    items: spaces, onClick: ({ key }) => {
                        const variable = spaces[key]
                        if (!variable)
                            return;

                        const value = `var(${variable.variable})`
                        onChange('Left', value, rightUnit)
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

            {type === 'margin' && <Checkbox name="Left" checked={style[`${type}Left`] === 'auto'} onChange={onChangeLeftAuto}>auto</Checkbox>}

        </div>


        {/* <Space size={1} direction='vertical'>
                <div>
                    {!lock && units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeLeftUnit(u) }} style={{ color: u === leftUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="Left" value={parseFloat(style[`${type}Left`])} onChange={onChange} />
                {type === 'margin' && <Checkbox name="Left" checked={style[`${type}Left`] === 'auto'} onChange={onChangeLeftAuto}>auto</Checkbox>}

                {!lock && <Checkbox name="Left" checked={stylePriority[`${type}Left`] === 'important'} onChange={onChangePriority}>important</Checkbox>
                }
            </Space> */}

    </div>


}


