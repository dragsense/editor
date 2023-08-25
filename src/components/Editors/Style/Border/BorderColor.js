import ThemeServices from '../../../../lib/services/theme';
import { Tooltip, Space, Checkbox, message, Button, Dropdown, ColorPicker } from 'antd';
import { useEffect, useState } from 'react';
import { CgGlobeAlt } from 'react-icons/cg'

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'


const units = ['px', '%', 'em', 'rem'];

export default function BorderColor({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const [lock, setLock] = useState(true);

    const [topColor, setTopColor] = useState('black');
    const [rightColor, setRightColor] = useState('black');
    const [bottomColor, setBottomColor] = useState('black');
    const [leftColor, setLeftColor] = useState('black');
    const [colors, setColors] = useState([]);

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

        if (properties["border-top-color"]?.value === properties["border-right-color"]?.value &&
            properties["border-right-color"]?.value === properties["border-bottom-color"]?.value &&
            properties["border-bottom-color"]?.value === properties["border-left-color"]?.value
        )
            setLock(true);
        else
            setLock(false);

        const topColor = properties["border-top-color"];
        setTopColor(topColor?.color || topColor?.value);
        const rightColor = properties["border-right-color"];

        setRightColor(rightColor?.color || rightColor?.value);
        const bottomColor = properties["border-bottom-color"];
        setBottomColor(bottomColor?.color || bottomColor?.value);

        const leftColor = properties["border-left-color"];

        setLeftColor(leftColor?.color || leftColor?.value);
    }, [properties]);



    const onChangeGlobalColor = (type, key) => {
        const item = colors[key];
        const { variable, color } = item;
        onChange(type, color, `var(${variable})`)
    }


    const onChange = (type, color, value) => {


        if (!lock) {
            if (!properties[`border-${type}-color`])
                properties[`border-${type}-color`] = {}
            properties[`border-${type}-color`].value = value;
            properties[`border-${type}-color`].color = color;

            let priority = '';

            if (type === 'top') {
                priority = stylePriority.borderTopColor;
                setTopColor(color);

            }
            if (type === 'left') {
                priority = stylePriority.borderLeftColor;
                setLeftColor(color);

            }
            if (type === 'right') {
                priority = stylePriority.borderRightColor;
                setRightColor(color)
            }
            if (type === 'bottom') {
                priority = stylePriority.borderBottomColor;
                setBottomColor(color)
            }

            style.setProperty(`border-${type}-color`, value, priority);

        }
        else {
            if (!properties['border-top-color'])
                properties['border-top-color'] = {}
            properties['border-top-color'].value = value;
            properties['border-top-color'].color = color;

            if (!properties['border-right-color'])
                properties['border-right-color'] = {}
            properties['border-right-color'].value = value;
            properties['border-right-color'].color = color;

            if (!properties['border-bottom-color'])
                properties['border-bottom-color'] = {}
            properties['border-bottom-color'].value = value;
            properties['border-bottom-color'].color = color;

            if (!properties['border-left-color'])
                properties['border-left-color'] = {}
            properties['border-left-color'].value = value
            properties['border-left-color'].color = color;


            style.setProperty('border-top-color', value, stylePriority.borderTopColor);
            style.setProperty('border-right-color', value, stylePriority.borderRightColor);
            style.setProperty('border-bottom-color', value, stylePriority.borderBottomColor);
            style.setProperty('border-left-color', value, stylePriority.borderLeftColor);

            setTopColor(color);
            setRightColor(color);
            setBottomColor(color);
            setLeftColor(color);

        }
        onChangeStyle();
        setStylePriority({ ...stylePriority });


    }


    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        const _name = e.target['data-name'];
        if (!lock) {

            if (!properties[_name])
                properties[_name] = {}

            properties[_name].priority = priority;

            setStylePriority({ ...stylePriority, [name]: priority })
            style.setProperty(_name, style[name], priority);
        } else {

            if (!properties['border-top-color'])
                properties['border-top-color'] = {}
            properties['border-top-color'].priority = priority;
            if (!properties['border-right-color'])
                properties['border-right-color'] = {}
            properties['border-right-color'].priority = priority;
            if (!properties['border-bottom-color'])
                properties['border-bottom-color'] = {}
            properties['border-bottom-color'].priority = priority;
            if (!properties['border-left-color'])
                properties['border-left-color'] = {}
            properties['border-left-color'].priority = priority


            style.setProperty('border-top-color', style.borderTopColor, priority);
            style.setProperty('border-right-color', style.borderRightColor, priority);
            style.setProperty('border-bottom-color', style.borderBottomColor, priority);
            style.setProperty('border-left-color', style.borderLeftColor, priority);

            setStylePriority({
                ...stylePriority, borderTopColor: priority,
                borderRightColor: priority, borderBottomColor: priority,
                borderLeftColor: priority
            })

        }
        onChangeStyle();

    }

    const items = colors.map((c, i) => { return { label: c.name, key: i } });


    return <>
        <div style={{ marginBottom: "10px" }}>

            <strong>{type}:  </strong>


            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        onChangeStyle();

                        if (properties["border-top-color"])
                            delete properties["border-top-color"];

                        if (properties["border-left-color"])
                            delete properties["border-left-color"];

                        if (properties["border-bottom-color"])
                            delete properties["border-bottom-color"];

                        if (properties["border-right-color"])
                            delete properties["border-right-color"];

                        setTopColor("");
                        setRightColor("");
                        setBottomColor("");
                        setLeftColor("");
                        style.removeProperty('border-color');

                        setStylePriority({
                            ...stylePriority, borderTopColor: '',
                            borderRightColor: '', borderBottomColor: '',
                            borderLeftColor: ''
                        })
                    }}
                    className="ac-icons-btn"
                ></Button>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>

            <Button type={lock ? 'primary' : 'default'}
                onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
        </div>


        <div style={{ marginBottom: "10px" }}>



            <ColorPicker value={topColor}
                allowClear={true}
                format={"hex"}
                onChangeComplete={(color, hex) => {
                    const metaColor = color.metaColor;
                    const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                    onChange('top', rgbColor, rgbColor)

                }} />



            {colors && (
                <Dropdown menu={{ items, onClick: ({ key }) => onChangeGlobalColor('top', key) }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                                color={topColor}
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ margin: '0 3px' }} name='borderTopColor' data-name="border-top-color" checked={stylePriority.borderTopColor === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>

            {!lock && <>


                <ColorPicker value={rightColor}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                        onChange('right', rgbColor, rgbColor)

                    }} />


                {colors && (
                    <Dropdown menu={{ items, onClick: ({ key }) => onChangeGlobalColor('right', key) }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <CgGlobeAlt
                                    size="35"
                                    color={rightColor}
                                />
                            </Space>
                        </a>
                    </Dropdown>
                )}

                <Tooltip placement='bottom' title="important">
                    <Checkbox style={{ margin: '0 3px' }} name='borderRightColor' data-name="border-right-color" checked={stylePriority.borderRightColor === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
            </>}
        </div>
        {!lock && <div style={{ marginBottom: "10px" }}>

            <ColorPicker value={bottomColor}
                allowClear={true}
                format={"hex"}
                onChangeComplete={(color, hex) => {
                    const metaColor = color.metaColor;
                    const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                    onChange('bottom', rgbColor, rgbColor)

                }} />


            {colors && (
                <Dropdown menu={{ items, onClick: ({ key }) => onChangeGlobalColor('bottom', key) }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                                color={bottomColor}
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ margin: '0 3px' }} name='borderBottomColor' data-name="border-bottom-color" checked={stylePriority.borderBottomColor === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>


            <ColorPicker value={leftColor}
                allowClear={true}
                format={"hex"}
                onChangeComplete={(color, hex) => {
                    const metaColor = color.metaColor;
                    const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                    onChange('left', rgbColor, rgbColor)

                }} />


            {colors && (
                <Dropdown menu={{ items, onClick: ({ key }) => onChangeGlobalColor('left', key) }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <CgGlobeAlt
                                size="35"
                                color={bottomColor}
                            />
                        </Space>
                    </a>
                </Dropdown>
            )}

            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ margin: '0 3px' }} name='borderLeftColor' data-name="border-left-color" checked={stylePriority.borderLeftColor === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>}



    </>


}


