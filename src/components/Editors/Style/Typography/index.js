import { Input, Slider, Select, InputNumber, Button, Checkbox, Tooltip, message, Dropdown, Menu, Collapse, Space, ColorPicker } from 'antd';
import { CgGlobeAlt } from 'react-icons/cg';
import { useEffect, useState } from 'react';


import { FaAlignJustify, FaAlignLeft, FaAlignRight, FaAlignCenter } from 'react-icons/fa'
import { MdRestartAlt } from 'react-icons/md';
import { isEmpty } from '../../../../lib/utils';
import { SaveOutlined } from '@ant-design/icons';


const units = ['px', '%', 'em', 'rem'];
const weights = ['normal', 'regular', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const styles = [{ label: 'N', value: 'normal' }, { label: 'I', value: 'italic' }, { label: 'O', value: 'oblique' }];

const alignments = [{ icon: <FaAlignLeft size="1.5rem" />, value: 'left' },
{ icon: <FaAlignCenter size="1.5rem" />, value: 'center' },
{ icon: <FaAlignRight size="1.5rem" />, value: 'right' },
{ icon: <FaAlignJustify size="1.5rem" />, value: 'justify' }];
const transforms = [{ label: 'Cap', value: "capitalize" }, { label: 'ABC', value: 'uppercase' },
{ label: 'abc', value: 'lowercase' }];
const decorations = ['none', 'underline', 'overline '];
const whiteSpacings = ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'];


const { Panel } = Collapse;
const { Option } = Select;


export default function Typography({ style, fonts, variables, colors, 
    properties, 
    onChangeStyle }) {


    const [unit, setUnit] = useState(units[0]);


    const [lineHeightUnit, setLineHeightUnit] = useState('');
    const [content, setContent] = useState(null);



    const [color, setColor] = useState("black");


    const [stylePriority, setStylePriority] = useState({
        color: '',
        fontFamily: '',
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: '',
        textTransform: '',
        textDecoration: '',
        lineHeight: '',
        textOverflow: '',
        whiteSpace: '',
        textIndent: ''


    })




    useEffect(() => {



        if (!properties) {
            return;
        }


        console.log(properties)

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }

        setStylePriority(priorities);

        setUnit(properties["font-size"]?.unit || 'px')

        const c = properties["color"];
        if (c)
            setColor(c.color || c.value);

        setLineHeightUnit(properties["line-height"]?.unit)

        setContent(properties["content"]?.value || "")

    }, [properties])



    const onChangeGlobalColor = ({ key }) => {


        const item = colors[key];

        const { variable, color } = item;

        if (!properties['color'])
            properties['color'] = {};

        properties['color'].value = `var(${variable})`;
        properties['color'].color = color;
        style.setProperty('color', `var(${variable})`, stylePriority.color);
        setColor(color);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChange = (dataName, name, value, unit = undefined, label = undefined) => {


        if (!properties[dataName])
            properties[dataName] = {};


        properties[dataName].value = value;
        properties[dataName].unit = unit;
        properties[dataName].label = label;

        style.setProperty(dataName, value, stylePriority.color);

        if (name === 'color') {
            properties['color'].color = value;
            setColor(value);
        }

        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }


    const onChangeUnit = (value) => {

        if (!properties['font-size'])
            properties['font-size'] = {};

        properties['font-size'].unit = value;
        properties['font-size'].value = parseFloat(style.fontSize) + value;

        style.setProperty('font-size', parseFloat(style.fontSize) + value, stylePriority.fontSize);
        setUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChangeLineHeightUnit = (value) => {
        const v = value === lineHeightUnit ? '' : value;

        if (!properties['line-height'])
            properties['line-height'] = {};

        properties['line-height'].unit = v;
        properties['line-height'].value = parseFloat(style.lineHeight) + v;


        style.setProperty('line-height', parseFloat(style.lineHeight) + v, stylePriority.lineHeight);
        setLineHeightUnit(v);

        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangeFont = (value, option) => {


        if (!properties['font-family'])
            properties['font-family'] = {};

        properties['font-family'].value = `var(${value})`;
        properties['font-family'].name = option.label;


        style.setProperty('font-family', `var(${value})`, stylePriority.fontFamily);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }



    const onChangeContent = (value) => {
        setContent(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }


    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';

        if (!properties[_name])
            properties[_name] = {}

        properties[_name].priority = priority;

        style.setProperty(_name, style[name], priority);
        setStylePriority({ ...stylePriority, [name]: priority });
        onChangeStyle();



    }




    const items = colors.map((c, i) => { return { label: c.name, key: i } });

    const fontSzies = variables.filter((variable) => variable.type === 'font').map((v, i) => { return { variable: v.variable, label: v.name, key: i } });

    console.log(fontSzies)

    return !isEmpty(style) ? <>
        <Collapse defaultActiveKey={['1']} accordion ghost>
            <Panel header="Color" key="1">

                <div style={{ marginBottom: "10px" }}>
                    <strong >Color:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name="color"
                            data-name="color"
                            checked={stylePriority.color === 'important'}
                            onChange={onChangePriority}
                        >
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

                                if (properties['color'])
                                    delete properties['color'];

                                style.removeProperty('color');
                                onChangeStyle();

                                setColor(null);


                                setStylePriority({ ...stylePriority, color: '' });


                            }}
                        ></Button>
                    </Tooltip>
                </div>

                <ColorPicker value={color}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                        const metaColor = color.metaColor;
                        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;

                        onChange('color', 'color', rgbColor)

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

            </Panel>
            <Panel header="Font" key="2">


                <div style={{ marginBottom: "10px" }}>
                    <strong >Font Family:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontFamily' data-name="font-family" checked={stylePriority.fontFamily === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['font-family'])
                                    delete properties['font-family'];


                                style.removeProperty('font-family');

                                onChangeStyle();

                                setStylePriority({ ...stylePriority, fontFamily: '' });

                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={properties?.['font-family']?.name}
                        onChange={onChangeFont}
                        placeholder="Select a Font"
                    >
                        {fonts?.map(item => (
                            <Option key={item._uid} value={item.variable} label={item.name}>{item.name}</Option>
                        ))}
                    </Select>


                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong >Font Size:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontSize' data-name="font-size" checked={stylePriority.fontSize === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['font-size'])
                                    delete properties['font-size'];

                                style.removeProperty('font-size');

                                onChangeStyle(); setStylePriority({ ...stylePriority, fontSize: '' });

                            }}
                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeUnit(u) }}
                            style={{ color: u === unit ? '#f88a24' : '', cursor: 'pointer' }}>
                            {u.toUpperCase()}
                        </span>)}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={72}
                            step={0.1}
                            value={parseFloat(style.fontSize || 16)}
                            onChange={(value) => {
                                onChange('font-size', 'fontSize', value + unit, unit)
                            }}
                            style={{ width: '70%' }}
                        />

                        <InputNumber
                            value={parseFloat(style.fontSize || 16)}
                            onChange={(value) => {
                                onChange('font-size', 'fontSize', value + unit, unit)
                            }}
                            style={{ width: '30%' }}

                        />

                        {fontSzies?.length > 0 && (
                            <Dropdown menu={{
                                items: fontSzies, onClick: ({ key }) => {
                                    const variable = fontSzies[key]

                                    if (!variable)
                                        return;

                                    const value = `var(${variable.variable})`
                                    onChange('font-size', 'fontSize', value, unit, variable.label)
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

                    <strong >Font Weight:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontWeight' data-name="font-weight" checked={stylePriority.fontWeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['font-weight'])
                                    delete properties['font-weight'];
                                style.removeProperty('font-weight');

                                onChangeStyle(); setStylePriority({ ...stylePriority, fontWeight: '' });

                            }}
                        ></Button>
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <Select style={{ width: '100%' }}
                        placeholder="Select Font Weight" value={style.fontWeight}
                        onChange={(value) => {
                            onChange('font-weight', 'fontWeight', value)
                        }}
                    >
                        {weights.map(w => <Option value={w}>{w}</Option>)}
                    </Select>

                    {fontSzies?.length > 0 && (
                        <Dropdown menu={{
                            items: fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChange('font-weight', 'fontWeight', value)
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

                <div style={{ marginBottom: "10px" }}>
                    <strong >Style:    </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontStyle' data-name="font-style" checked={stylePriority.fontStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                style.removeProperty('font-style');

                                if (properties['font-style'])
                                    delete properties['font-style'];

                                onChangeStyle('');
                                setStylePriority({ ...stylePriority, fontStyle: '' });
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {styles.map(s => <Button

                        style={{ fontStyle: s.value, marginRight: "5px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (style.fontStyle === s.value)
                                onChange('font-style', 'fontStyle', null)
                            else
                                onChange('font-style', 'fontStyle', s.value)
                        }}
                        type={s.value === style.fontStyle ? 'primary' : 'default'}>
                        {s.label}
                    </Button>)}

                </div>

                <div style={{ marginBottom: "10px" }}>

                    <strong >Line Height:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='lineHeight' data-name="line-height" checked={stylePriority.lineHeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['line-height'])
                                    delete properties['line-height'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, lineHeight: '' });

                                style.removeProperty('line-height');
                            }}

                        ></Button>
                    </Tooltip> </div>
                <div style={{ marginBottom: "10px" }}>

                    <div style={{ marginBottom: "10px" }}>
                        <div>
                            {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeLineHeightUnit(u) }} style={{ color: u === lineHeightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                                {u.toUpperCase()}
                            </span>)}
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Slider
                                min={0.3}
                                max={72}
                                step={0.1}
                                value={parseFloat(style.lineHeight || 1.2)}
                                onChange={(value) => {
                                    onChange('line-height', 'lineHeight', value, lineHeightUnit)
                                }} style={{ width: '70%' }}
                            />
                            <InputNumber
                                value={parseFloat(style.lineHeight || 1.2)}
                                onChange={(value) => {
                                    onChange('line-height', 'lineHeight', value, lineHeightUnit)
                                }}
                                style={{ width: '30%' }}

                            />

                            {fontSzies?.length > 0 && (
                                <Dropdown menu={{
                                    items: fontSzies, onClick: ({ key }) => {
                                        const variable = fontSzies[key]

                                        if (!variable)
                                            return;

                                        const value = `var(${variable.variable})`
                                        onChange('line-height', 'lineHeight', value, lineHeightUnit)
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
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Word Spacing:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='wordSpacing'
                            data-name="word-spacing"
                            checked={stylePriority.wordSpacing === 'important'}
                            onChange={onChangePriority}
                        >i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['word-spacing'])
                                    delete properties['word-spacing'];



                                onChangeStyle(); setStylePriority({ ...stylePriority, wordSpacing: '' });

                                style.removeProperty('word-spacing');
                            }}
                        ></Button>
                    </Tooltip>
                </div>


                <div style={{ marginBottom: "10px" }}>
                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.wordSpacing)}

                        onChange={(value) => {
                            onChange('word-spacing', 'wordSpacing', value, 'px')
                        }}
                    />
                    {fontSzies?.length > 0 && (
                        <Dropdown menu={{
                            items: fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChange('word-spacing', 'wordSpacing', value, 'px')
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

                <div style={{ marginBottom: "10px" }}>

                    <strong >Letter Spacing:   </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='letterSpacing' data-name="letter-spacing" checked={stylePriority.letterSpacing === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['letter-spacing'])
                                    delete properties['letter-spacing'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, letterSpacing: '' });
                                style.removeProperty('letter-spacing');
                            }}

                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>

                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.letterSpacing)}

                        onChange={(value) => {
                            onChange('letter-spacing', 'letterSpacing', value, 'px')
                        }}
                    />

                    {fontSzies?.length > 0 && (
                        <Dropdown menu={{
                            items: fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]

                                if (!variable)
                                    return;

                                const value = `var(${variable.variable})`
                                onChange('letter-spacing', 'letterSpacing', value, 'px')
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

                <div style={{ marginBottom: "10px" }}>
                    <strong >Transform:    </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textTransform' data-name="text-transform" checked={stylePriority.textTransform === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['text-transform'])
                                    delete properties['text-transform'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, textTransform: '' });
                                style.removeProperty('text-transform');
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {transforms.map(t => <Button
                        style={{ marginRight: "5px" }}

                        onClick={(e) => {
                            e.preventDefault();
                            if (style.textTransform === t.value)
                                onChange('text-transform', 'textTransform', null, undefined)
                            else
                                onChange('text-transform', 'textTransform', t.value, undefined)
                        }}

                        type={t.value === style.textTransform ? 'primary' : 'default'}>
                        {t.label}
                    </Button>)}



                </div>

            </Panel>

            <Panel header="Alignment" key="3">

                <div style={{ marginBottom: "10px" }}>
                    <strong >Alignment:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textAlign' data-name="text-align" checked={stylePriority.textAlign === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>

                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['text-align'])
                                    delete properties['text-align'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, textAlign: '' });
                                style.removeProperty('text-align');
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>


                    {alignments.map(align => <Button
                        icon={align.icon}
                        onClick={(e) => {
                            e.preventDefault();

                            onChange('text-align', 'textAlign', align.value, undefined)

                        }}
                        style={{ marginRight: "5px" }}
                        type={align.value === style.textAlign ? 'primary' : 'default'}></Button>)}



                </div>


            </Panel>


            <Panel header="Other" key="4">
                <div style={{ marginBottom: "10px" }}>
                    <strong >Content:   </strong>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['content'])
                                    delete properties['content'];
                                setContent("");
                                onChangeStyle();

                                style.removeProperty('content');
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', alignItems: 'center' }}>

                    <Input style={{ marginRight: "5px" }} type='text' value={content}
                        onChange={(e) => { const value = e.target.value; onChangeContent(value); }} />

                    <Button icon={<SaveOutlined size="1.5rem" />}
                        onClick={() => {

                            if (!properties['content'])
                                properties['content'] = {};

                            properties['content'].value = content;
                            style.setProperty('content', content, stylePriority.content)
                        }
                        } />
                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>White Space:  </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='whiteSpace'
                            data-name="white-space"
                            checked={stylePriority.whiteSpace === 'important'}
                            onChange={onChangePriority}
                        >i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['white-space'])
                                    delete properties['white-space'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, whiteSpace: '' });
                                style.removeProperty('white-space');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={style.whiteSpace}
                        onChange={(value) => {
                            onChange('white-space', 'whiteSpace', value)
                        }}
                        placeholder="Select Value"
                    >
                        {whiteSpacings.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>

                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>Text Indent:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textIndent' data-name="text-indent" checked={stylePriority.textIndent === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['text-indent'])
                                    delete properties['text-indent'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, textIndent: '' });
                                style.removeProperty('text-indent');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>

                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.textIndent)}
                        onChange={(value) => {
                            onChange('text-indent', 'textIndent', value)
                        }}
                    />


                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Text Overflow:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='textOverflow'
                            data-name="text-overflow"
                            checked={stylePriority.textOverflow === 'important'}
                            onChange={onChangePriority}
                        >
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
                                if (properties['text-overflow'])
                                    delete properties['text-overflow'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, textOverflow: '' });
                                style.removeProperty('text-overflow');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>


                    <Checkbox
                        name="textOverflow"
                        data-name="text-overflow"
                        checked={style.textOverflow === 'ellipsis'}
                        onChange={(e) => {
                            const value = e.target.checked ? 'ellipsis' : null;
                            onChange('text-overflow', 'textOverflow', value)

                        }}
                    >
                        ellipsis
                    </Checkbox>




                </div>

                <div style={{ marginBottom: "10px" }}>

                    <strong >Decoration:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textDecoration' data-name="text-decoration" checked={stylePriority.textDecoration === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties['text-decoration'])
                                    delete properties['text-decoration'];

                                onChangeStyle(); setStylePriority({ ...stylePriority, textDecoration: '' });
                                style.removeProperty('text-decoration');
                            }}

                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>



                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={style.textDecoration}
                        onChange={(value) => {
                            onChange('text-decoration', 'textDecoration', value)

                        }}
                        placeholder="Select Decoration"
                    >
                        {decorations.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>



                </div>

            </Panel>
        </Collapse></>

        : <></>


}


