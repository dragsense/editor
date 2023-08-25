
import { useState, useEffect } from "react";
import { Input, Space, Select, Checkbox, Tooltip, Button, InputNumber } from "antd";
import { MdRestartAlt } from "react-icons/md";

const units = ["px", "%", "em", "rem"];
const positions = ["static", "fixed", "sticky", "relative", "absolute"];
const { Option } = Select;

export default function Position({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {

    const [topUnit, setTopUnit] = useState(units[0]);
    const [leftUnit, setLeftUnit] = useState(units[0]);
    const [bottomUnit, setBottomUnit] = useState(units[0]);
    const [rightUnit, setRightUnit] = useState(units[0]);

    useEffect(() => {
        if (!properties) return;

        setTopUnit(getUnit(`top`) || 'px');
        setLeftUnit(getUnit(`left`) || 'px');
        setBottomUnit(getUnit(`bottom`) || 'px');
        setRightUnit(getUnit(`right`) || 'px');
    }, [properties]);

    const getUnit = (property) => {
        return properties[property]?.unit;
    };


    const onChangePosition = (value) => {

        if (!properties['position'])
            properties['position'] = {};

        properties['position'].value = value;

        style.setProperty("position", value, stylePriority.position);
        onChangeStyle(); setStylePriority({ ...stylePriority });
    };

    const onChange = (value, name) => {


        let unit = ''
        if (name === "top") {
            value = value + topUnit;
            unit = topUnit;
        }
        else if (name === "right") {
            value = value + rightUnit;
            unit = rightUnit;

        }
        else if (name === "bottom") {
            value = value + bottomUnit;
            unit = bottomUnit;

        }
        else if (name === "left") {
            value = value + leftUnit;
            unit = leftUnit;

        }

        if (!properties[name])
            properties[name] = {};

        properties[name].value = value;
        properties[name].unit = unit;


        style.setProperty(name, value, stylePriority[name]);
        onChangeStyle(); setStylePriority({ ...stylePriority });
    };

    const onChangeUnit = (unit, setValue, propName) => {
        const val = `${parseFloat(style[propName] ?? 0) + unit}`;

        if (!properties[propName])
            properties[propName] = {};

        properties[propName].unit = unit;
        properties[propName].value = val;

        setValue(unit);

        style.setProperty(propName, val, stylePriority[propName]);
        onChangeStyle(); setStylePriority({ ...stylePriority });

    };

    const onChangePriority = (e) => {
        const name = e.target.name;
        const priority = e.target.checked ? "important" : "";


        if (!properties[name])
            properties[name] = {};

        properties[name].priority = priority;
        setStylePriority({ ...stylePriority, [name]: priority });
        style.setProperty(name, style[name], priority);
        onChangeStyle();

    };

    const resetStyle = (e) => {
        e.preventDefault();

        if (properties['position'])
            delete properties['position'];

        style.removeProperty('position');

        if (properties['left'])
            delete properties['left'];

        style.removeProperty("left");

        if (properties['top'])
            delete properties['top'];


        style.removeProperty("top");

        if (properties['bottom'])
            delete properties['bottom'];

        style.removeProperty("bottom");

        if (properties['right'])
            delete properties['right'];

        style.removeProperty("right");

        onChangeStyle(); 
        setStylePriority({ ...stylePriority,
             position: '', 
             left: '',
              right: '', 
              top: '', 
              bottom: '' });

    };

    return (
        <>

            <div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '70%' }}
                        size="small"
                        value={style.position}
                        onChange={onChangePosition}


                    >
                        {positions.map((position, i) => (
                            <Option key={i} value={position}>
                                {position}
                            </Option>
                        ))}
                    </Select>
                    <Checkbox
                        name="position"
                        size="small"
                        checked={stylePriority.position === "important"}
                        onChange={onChangePriority}
                    >
                        !
                    </Checkbox>
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
                        name="top"
                        size="small"
                        placeholder="top"
                        value={parseFloat(style.top)}
                        onChange={(value) => onChange(value, 'top')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={topUnit}
                                onChange={(value) => onChangeUnit(value, setTopUnit, "top")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="top"
                                size="small"
                                checked={stylePriority.top === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>

                    <InputNumber
                        name="right"
                        size="small"
                        placeholder="right"
                        value={parseFloat(style.right)}
                        onChange={(value) => onChange(value, 'right')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={rightUnit}
                                onChange={(value) => onChangeUnit(value, setRightUnit, "right")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="right"
                                size="small"
                                checked={stylePriority.right === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />

                </div>

                <div style={{ marginBottom: "10px" }}>


                    <InputNumber
                        name="bottom"
                        size="small"
                        placeholder="bottom"
                        value={parseFloat(style.bottom)}
                        onChange={(value) => onChange(value, 'bottom')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={bottomUnit}
                                onChange={(value) => onChangeUnit(value, setBottomUnit, "bottom")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="bottom"
                                size="small"
                                checked={stylePriority.bottom === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />

                </div>
                <InputNumber
                    name="left"
                    size="small"
                    placeholder="left"
                    value={parseFloat(style.left)}
                    onChange={(value) => onChange(value, 'left')}
                    addonAfter={
                        <>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={leftUnit}
                                onChange={(value) => onChangeUnit(value, setLeftUnit, "left")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="left"
                                size="small"
                                checked={stylePriority.left === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>

                        </>
                    }
                />

            </div>
        </>
    );
}