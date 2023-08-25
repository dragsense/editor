import React, { useState, useEffect } from "react";
import { Slider, Input, Switch, Checkbox, Tooltip, Button, ColorPicker } from "antd";
import { rgbToHex } from '../../../../lib/utils';
import { MdRestartAlt } from "react-icons/md";

const ShadowBox = ({ style, properties, onChangeStyle }) => {

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [blurRadius, setBlurRadius] = useState(0);
    const [spreadRadius, setSpreadRadius] = useState(0);
    const [color, setColor] = useState("#000000");
    const [inset, setInset] = useState(false);
    const [stylePriority, setStylePriority] = useState({
        boxShadow: "",
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



        if (properties['box-shadow']) {
            const { color, offsetXValue, offsetYValue, blurRadiusValue, spreadRadiusValue, insetValue } = properties['box-shadow'];
            setInset(insetValue === "inset");
            setOffsetX(parseFloat(offsetXValue));
            setOffsetY(parseFloat(offsetYValue));
            setBlurRadius(parseFloat(blurRadiusValue || "0"));
            setSpreadRadius(parseFloat(spreadRadiusValue || "0"));
            setColor(color);
            setStylePriority(priorities);
        }
    }, [properties]);

    const handleOffsetXChange = (value) => {


        const shadow = `${inset ? "inset" : ""} ${value}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;

        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;
        properties["box-shadow"].offsetXValue = value;

        onChangeStyle();
        setOffsetX(value);

    };

    const handleOffsetYChange = (value) => {

        const shadow = `${inset ? "inset" : ""} ${offsetX}px ${value}px ${blurRadius}px ${spreadRadius}px ${color}`;



        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;
        properties["box-shadow"].offsetYValue = value;
        setOffsetY(value);
        onChangeStyle();



    };

    const handleBlurRadiusChange = (value) => {

        const shadow = `${inset ? "inset" : ""} ${offsetX}px ${offsetY}px ${value}px ${spreadRadius}px ${color}`;



        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;

        properties["box-shadow"].blurRadiusValue = value;
        setBlurRadius(value);
        onChangeStyle();


    };

    const handleSpreadRadiusChange = (value) => {


        const shadow = `${inset ? "inset" : ""} ${offsetX}px ${offsetY}px ${blurRadius}px ${value}px ${color}`;


        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;

        properties["box-shadow"].spreadRadiusValue = value;
        setSpreadRadius(value);
        onChangeStyle();


    };

    const handleColorChange = (value) => {


        const shadow = `${inset ? "inset" : ""} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${value}`;



        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;
        properties["box-shadow"].color = value;


        setColor(value);
        onChangeStyle();
    };

    const handleInsetChange = (checked) => {

        const shadow = `${checked ? "inset" : ""} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;

        style.setProperty(
            "box-shadow",
            shadow,
            stylePriority["box-shadow"]
        );

        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].value = shadow;
        properties["box-shadow"].insetValue = checked ? "inset" : "";

        setInset(checked);
        onChangeStyle();


    };


    const onChangePriority = (e) => {


        const priority = e.target.checked ? 'important' : '';


        if (!properties["box-shadow"])
            properties["box-shadow"] = {};

        properties["box-shadow"].priority = priority;

        style.setProperty("box-shadow", style["box-shadow"], priority);
        onChangeStyle();

        setStylePriority({ ...stylePriority, "box-shadow": priority })


    }

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <strong >Box Shadow:     </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.boxShadow === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            if (properties["box-shadow"])
                                delete properties["box-shadow"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "box-shadow": "" })

                            style.removeProperty('box-shadow');
                        }}
                    />
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Offset X:</label>
                <Slider min={-50} max={50} value={offsetX} onChange={handleOffsetXChange} />
                <Input value={offsetX} onChange={(e) => handleOffsetXChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Offset Y:</label>
                <Slider min={-50} max={50} value={offsetY} onChange={handleOffsetYChange} />
                <Input value={offsetY} onChange={(e) => handleOffsetYChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Blur Radius:</label>
                <Slider min={0} max={50} value={blurRadius} onChange={handleBlurRadiusChange} />
                <Input value={blurRadius} onChange={(e) => handleBlurRadiusChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Spread Radius:</label>
                <Slider min={0} max={50} value={spreadRadius} onChange={handleSpreadRadiusChange} />
                <Input value={spreadRadius} onChange={(e) => handleSpreadRadiusChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Color:</label>


                <br/>
            <ColorPicker value={color}
                allowClear={true}
                format={"hex"}
                onChangeComplete={(color, hex) => {
                    const metaColor = color.metaColor;
                    const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                    handleColorChange(rgbColor)

                }} />
            </div>
            <div style={{ marginBottom: "10px", }}>
                <Switch
                    checked={inset}
                    onChange={handleInsetChange}
                />
                <span style={{ marginLeft: 8 }}>Inset</span>
            </div>
        </div>
    );
};

export default ShadowBox;