import { Checkbox, Input, Menu, Dropdown, message, Radio, Button, Tooltip, Slider, Space, ColorPicker } from 'antd';
import { useEffect, useState } from 'react';

import ThemeServices from '../../../../lib/services/theme';
import { CgGlobeAlt } from 'react-icons/cg'
import { MdRestartAlt } from 'react-icons/md'
import { DeleteOutlined, FieldTimeOutlined, PlusOutlined } from '@ant-design/icons';
import { FaTimes } from 'react-icons/fa';

export default function Color({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const [colorPicker, setColorPicker] = useState(false);
    const [color, setColor] = useState(style.backgroundColor);
    const [colors, setColors] = useState([]);
    const [isGradient, setIsGradientType] = useState(false);

    const [gradientType, setGradientType] = useState('linear');
    const [gradientDirection, setGradientDirection] = useState(180);
    const [gradientColors, setGradientColors] = useState([]);


    const laod = async () => {
        try {
            const resColors = await ThemeServices.getColors();

            if (resColors.colors)
                setColors(resColors.colors.data);

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {

        laod();

    }, []);

    useEffect(() => {

        if (!properties)
            return;

        const c = properties['background-color'];
        if (c)
            setColor(c.color || c.value);

        if (properties['background'])
            if (!properties["background"]['gradient'])
                return;

        const background = properties['background'];
        if (background) {
            const colors = background['colors'] || [];
            setGradientType(background['type'])
            setGradientDirection(background['dir'])
            setGradientColors(colors.map(color => { return { color: color.color, stop: color.stop } }));
            setIsGradientType(colors.length > 0);
        } else {
            setGradientType('linear')
            setGradientDirection(180)
            setGradientColors([]);
            setIsGradientType(false);
        }


    }, [properties]);






    const onChangeColor = (value) => {

        if (!properties['background-color'])
            properties['background-color'] = {};

        properties['background-color'].value = value;
        style.setProperty('background-color', value, stylePriority.backgroundColor);
        setColor(value);
        onChangeStyle();
    }


    const onChangeGlobalColor = ({ key }) => {
        const item = colors[key];

        const { variable, color } = item;

        if (!properties['background-color'])
            properties['background-color'] = {};
        properties['background-color'].value = `var(${variable})`;
        properties['background-color'].color = color;

        style.setProperty('background-color', `var(${variable})`, stylePriority.backgroundColor);
        setColor(color);
        onChangeStyle();
    }



    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        if (!properties['background-color'])
            properties['background-color'] = {};

        properties['background-color'].priority = priority;

        if (isGradient) {
            if (!properties['background'])
                properties['background'] = {};
            properties['background'].priority = priority;

            setStylePriority({ ...stylePriority, 'background':priority });
            style.setProperty('background', style.background, priority);
        }

        setStylePriority({ ...stylePriority, [name]: priority });
        style.setProperty('background-color', style[name], priority);

        onChangeStyle();

    }

    useEffect(() => {

        if (!isGradient)
            return;

        if (!properties['background'])
            properties['background'] = {};

        if (isGradient) {
            const value = getGradient(gradientColors);



            properties['background'].value = `${value}`;
            style.setProperty('background', `${value}`, stylePriority.background);

        } else {



            properties['background'].value = null;
            style.setProperty('background', null, stylePriority.background);


            style.setProperty('background-color', properties['background-color'].value, stylePriority.backgroundColor);
        }


    }, [gradientType, gradientColors, gradientDirection, isGradient])

    const onChangeGradientType = (e) => {
        setGradientType(e.target.value);

        if (!properties['background'])
            properties['background'] = {};
        properties['background']['type'] = e.target.value;



        onChangeStyle();

    }

    const onChangeGradientDirection = (value) => {
        setGradientDirection(value);
        properties['background']['dir'] = value;
        onChangeStyle();


    }

    const onGradientColorChange = (index, color) => {
        if (!properties['background'])
            properties['background'] = {};
        const updatedGradientColors = [...gradientColors];
        updatedGradientColors[index] = { ...updatedGradientColors[index], color: color };
        properties['background']['colors'] = updatedGradientColors;

        onChangeStyle();

        setGradientColors(updatedGradientColors);
    }

    const onGradientStopChange = (index, stop) => {
        if (!properties['background'])
            properties['background'] = {};
        const updatedGradientColors = [...gradientColors];
        updatedGradientColors[index] = { ...updatedGradientColors[index], stop };
        properties['background']['colors'] = updatedGradientColors;
        onChangeStyle();

        setGradientColors(updatedGradientColors);
    }

    const addGradientColor = () => {
        if (!properties['background'])
            properties['background'] = {};
        const updatedGradientColors = [...gradientColors];
        updatedGradientColors.push({ color: "#ffffff", stop: "100" });
        properties['background']['colors'] = updatedGradientColors;
        onChangeStyle();


        setGradientColors(updatedGradientColors);
    }

    const removeGradientColor = (index) => {
        if (!properties['background'])
            properties['background'] = {};
        const updatedGradientColors = [...gradientColors];
        updatedGradientColors.splice(index, 1);
        properties['background']['colors'] = updatedGradientColors;

        onChangeStyle();

        setGradientColors(updatedGradientColors);
    }


    const getGradient = (colors) => {
        if (gradientType === 'linear') {
            return `linear-gradient(${gradientDirection}deg, ${colors
                .map((color) => `${color.color} ${color.stop}%`)
                .join(', ')})`;
        } else if (gradientType === 'radial') {
            return `radial-gradient(circle, ${colors
                .map((color) => `${color.color} ${color.stop}%`)
                .join(', ')})`;
        }
    };

    const items = colors.map((c, i) => { return { label: c.name, key: i } });

    return <div>
        <div style={{ marginBottom: "10px" }}>
            <strong>{type}:  </strong>
            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ marginLeft: 3 }} name='backgroundColor' data-name="background-color" checked={stylePriority.backgroundColor === 'important' || (isGradient && stylePriority.background === 'important') } onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        setColor('');

                        if (properties['background-color'])
                            delete properties['background-color'];
                            if (properties['background'])
                            delete properties['background'];
                            
                        style.removeProperty('background-color');
                        style.removeProperty('background');

                        onChangeStyle();
                        setStylePriority({ ...stylePriority, "backgroundColor": "", background: '' });
                        setIsGradientType(false)

                        setGradientColors([{ color: '#ffffff', stop: 0 }, { color: '#000000', stop: 100 }]);
                    }}
                ></Button>
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>



            <ColorPicker value={color}
                allowClear={true}
                format={"hex"}
                onChangeComplete={(color, hex) => {
                    const metaColor = color.metaColor;
                    const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                    onChangeColor(rgbColor)

                }} />

            {colors && (
                <Dropdown menu={{ items, onClick: onChangeGlobalColor }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                                color={color}
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}
        </div>
        <div style={{ marginBottom: "10px" }}>
            <Checkbox checked={isGradient} onChange={() => {

                if (isGradient)
                    style.removeProperty('background');



                if (!properties['background'])
                    properties['background'] = {};

                properties['background']["gradient"] = !isGradient;

                setIsGradientType(!isGradient)



                onChangeStyle();

            }
            }>Gradient</Checkbox>
        </div>
        {isGradient && <>
            <div style={{ marginBottom: "10px" }}>
                <Radio.Group onChange={onChangeGradientType} value={gradientType}>
                    <Radio.Button value="linear">Linear</Radio.Button>
                    <Radio.Button value="radial">Radial</Radio.Button>
                </Radio.Group>
            </div>
            <div style={{ marginBottom: "10px" }}>

                Gradient angle:{' '}
                <Slider
                    min={0}
                    max={360}
                    value={gradientDirection}
                    onChange={onChangeGradientDirection}
                />



            </div>
            <div style={{ marginBottom: "10px" }}>
                {gradientColors.map((color, index) => (
                    <div style={{ marginBottom: "10px" }}>
                        <div className="flex items-center">
                            <Input
                                type="color"
                                value={color.color}
                                onChange={(e) => onGradientColorChange(index, e.target.value)}
                            />
                        </div>

                        <Slider
                            min={0}
                            max={100}
                            onChange={(value) => onGradientStopChange(index, value)}
                            value={color.stop}
                            step={1}
                        />

                        <Button size="small" style={{ lineHeight: 1 }} icon={<FaTimes />} danger onClick={() => removeGradientColor(index)}></Button>

                    </div>
                ))}
                <Button size="small" type="dashed" style={{ lineHeight: 1 }} icon={<PlusOutlined />} onClick={addGradientColor}></Button>
            </div>
        </>}


    </div>


}


