import { Checkbox, InputNumber, Select, Button, Tooltip, Slider } from 'antd';


import { MdRestartAlt } from 'react-icons/md'


const { Option } = Select;


const displays = ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'table row', 'contents', 'list item', 'flow root', 'inherit'];

const aligns = ['baseline','sub','super','top','text-top','middle','bottom','text-bottom']

export default function _Display({ type, properties, onChangeStyle,
    style, stylePriority, setStylePriority }) {



    const onChangeDisplay = (value) => {

        if (!properties['display'])
            properties['display'] = {};

        properties['display'].value = value;
        style.setProperty('display', value, stylePriority.display);


       onChangeStyle(); setStylePriority({ ...stylePriority });

    }

    const onChangeVisiblity = (value) => {
        if (!properties['visibility'])
            properties['visibility'] = {};

        properties['visibility'].value = value;
        style.setProperty('visibility', value, stylePriority.visibility);

       onChangeStyle(); setStylePriority({ ...stylePriority });
    }

    const onChangeVerticleAlign = (value) => {
        if (!properties['vertical-align'])
            properties['vertical-align'] = {};

        properties['vertical-align'].value = value;
        style.setProperty('vertical-align', value, stylePriority.verticalAlign);

       onChangeStyle(); setStylePriority({ ...stylePriority });
    }

    const onChangeOpacity = (value) => {
        if (!properties['opacity'])
            properties['opacity'] = {};

        properties['opacity'].value = value;
        style.setProperty('opacity', value, stylePriority.opacity);
       onChangeStyle(); setStylePriority({ ...stylePriority });

    }

    const onChangeZIndex = (value) => {
        if (!properties['z-index'])
            properties['z-index'] = {};

        properties['z-index'].value = value;
        style.setProperty('z-index', value, stylePriority.zIndex);
       onChangeStyle(); setStylePriority({ ...stylePriority });

    }


    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })

        if (!properties[_name])
        properties[_name] = {};

        properties[_name].priority = priority;

        style.setProperty(_name, style[name], priority);
       onChangeStyle(); 

    }



    return <>

        <div style={{ marginBottom: "10px" }}>
            <strong >Display:     </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }} name='display' data-name="display" checked={stylePriority.display === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["display"])
                            delete properties["display"];
                       onChangeStyle(); setStylePriority({ ...stylePriority, display: '' });
                        style.removeProperty('display');
                    }}
                />
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <Select placeholder="Select Display Type"
                value={style.display} onChange={onChangeDisplay} style={{ width: '100%' }}>
                {displays.map(display => <Option value={display}>{display}</Option>)}
            </Select>

        </div>

        <div style={{ marginBottom: "10px" }}>
            <strong >Vertical Align:     </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }} name='verticalAlign' data-name="vertical-align" checked={stylePriority.verticalAlign === 'important' || stylePriority.verticalAlign === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["vertical-align"])
                            delete properties["vertical-align"];
                       onChangeStyle(); setStylePriority({ ...stylePriority, verticalAlign: '' });
                        style.removeProperty('vertical-align');
                    }}
                />
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <Select placeholder="Verticle Align"
                value={style.verticalAlign} onChange={onChangeVerticleAlign} style={{ width: '100%' }}>
                {aligns.map(align => <Option value={align}>{align}</Option>)}
            </Select>

        </div>


        <div style={{ marginBottom: "10px" }}>
            <strong >Visibility:     </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }} name='visibility' data-name="visibility" checked={stylePriority.visibility === 'important'} onChange={onChangePriority}>i</Checkbox>

            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["visibility"])
                            delete properties["visibility"];
                       onChangeStyle(); setStylePriority({ ...stylePriority, visibility: ''  });
                        style.removeProperty('visibility');
                    }}
                    className="ac-icons-btn"
                />
            </Tooltip>
        </div>


        <div style={{ marginBottom: "10px" }}>

            <Button
                onClick={(e) => { e.preventDefault(); onChangeVisiblity('visible') }}
                type={'visible' === style.visibility ? 'primary' : 'default'}>
                Visible
            </Button>
            {" "}

            <Button
                onClick={(e) => { e.preventDefault(); onChangeVisiblity('hidden') }}
                type={'hidden' === style.visibility ? 'primary' : 'default'}>
                Hidden
            </Button>
        </div>



        <div style={{ marginBottom: "10px" }}>
            <strong >Opacity:     </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    name='opacity' data-name="opacity" checked={stylePriority.opacity === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["opacity"])
                            delete properties["opacity"];
                       onChangeStyle(); setStylePriority({ ...stylePriority, opacity: '' });
                        style.removeProperty('opacity');
                    }}
                />
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>

            <Slider defaultValue={1}
                min={0}
                max={1}
                step={0.1} onChange={onChangeOpacity}
                value={style.opacity || 1}
            />
        </div>


        <div style={{ marginBottom: "10px" }}>
            <strong >zIndex:     </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    name='zIndex' data-name="z-index"
                    checked={stylePriority.zIndex === 'important'}
                    onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        e.preventDefault();
                        if (properties["z-index"])
                            delete properties["z-index"];
                       onChangeStyle(); setStylePriority({ ...stylePriority, zIndex: '' });
                        style.removeProperty('z-index');
                    }}
                />
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>

            <InputNumber defaultValue=""
                onChange={onChangeZIndex}
                value={style.zIndex}
            />

        </div>



        {/* <Space size={10} align='end'>
        <label className='styling-label' style={{ textTransform: 'capitalize' }}>At: </label>
            <Space size={1} direction='vertical'>
                <div>
                    {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeTopUnit(u) }} style={{ color: u === topUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="top" value={parseInt(style.top || 0)} onChange={onChange} />
            </Space>
            <Space size={1} direction='vertical'>
                <div>
                    {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeRightUnit(u) }} style={{ color: u === rightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="right" value={parseInt(style.right || 0)} onChange={onChange} />
            </Space>
            <Space size={1} direction='vertical'>
                <div>
                    {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeBottomUnit(u) }} style={{ color: u === bottomUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="bottom" value={parseInt(style.bottom || 0)} onChange={onChange} />
            </Space>
            <Space size={1} direction='vertical'>
                <div>
                    {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeLeftUnit(u) }} style={{ color: u === leftUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                        {u.toUpperCase()}
                    </span>)}
                </div>
                <Input type='number' name="left" value={parseInt(style.left || 0)} onChange={onChange} />
            </Space>
        </Space> */}



    </>


}


