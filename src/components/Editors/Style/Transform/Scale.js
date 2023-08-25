import { Input, Slider, Button, Checkbox, Tooltip, InputNumber } from 'antd';

import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const units = ['px', '%', 'em', 'rem'];

export default function Scale({ min = 0, max = 1, style, 
     properties,
    onChangeStyle,  stylePriority, setStylePriority }) {


   // const [lock, setLock] = useState(false);

    useEffect(() => {

        if (!properties) {
            return;
        }

     
        // let values = properties["scale"]?.value;

        // values = values ? values.split(" ") : [];

        // if (values[0] === values[1])
        //     setLock(true);
        // else
        //     setLock(false)

    }, [properties]);


    const onChange = (value, name) => {

        //const values = style.scale.split(' ');

        // if (name == "scaleX")
        //     values[0] = value;
        // else if (name == "scaleY")
        //     values[1] = value;

            if (!properties['scale'])
            properties['scale'] = {};
    
        //if (!lock){
            properties['scale'].value = value;

            style.setProperty('scale', value, stylePriority.scale);
        //}
        // else
        // {
        //     properties['scale'].value =`${value} ${value}`;

        //     style.setProperty('scale', `${value} ${value}`, stylePriority.scale);
        // }

         onChangeStyle();
         setStylePriority({ ...stylePriority})

    }

    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        properties['scale'].priority = priority;
        setStylePriority({ ...stylePriority, scale: priority })
        style.setProperty('scale', style.scale, stylePriority.scale);
        onChangeStyle();

    }


    return <div>

        <div style={{ marginBottom: "10px" }}>
            <strong>Scale: </strong>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }}
                    checked={stylePriority.scale === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>

            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties["scale"])
                                delete properties["scale"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "scale": "" })
                         style.removeProperty('scale');
                    }}
                />
            </Tooltip>
        </div>
        {/* <div style={{ marginBottom: "10px" }}>

            <Button type={lock ? 'primary' : 'default'}
                onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
        </div> */}
        <div style={{ marginBottom: "10px", display: 'flex' }}>

            <Slider
                min={min}
                max={max}
                style={{ width: '70%' }}
                onChange={(value) => onChange(value, 'scaleX')}
                value={parseFloat(style.scale?.split(' ')[0]) ?? ""}
                step={0.1}
            />
            <InputNumber
                style={{ width: '30%' }}

                type='number'
                name="scaleX" value={parseFloat(style.scale?.split(' ')[0])} onChange={(value) => {

                    onChange(value, 'scaleX');
                }} />



        </div>

        {/* <div style={{ marginBottom: "10px", display: 'flex' }}>
            <Slider
                min={min}
                style={{ width: '70%' }}
                disabled={lock}

                max={max}
                onChange={(value) => onChange(value, 'scaleY')}
                value={parseFloat(style.scale?.split(' ')[1]) ?? ""}
                step={0.1}
            />
            <InputNumber type='number' name="scaleY"
                            value={parseFloat(style.scale?.split(' ')[1]) ?? ""}

                onChange={(value) => onChange(value, 'scaleY')}
                style={{ width: '30%' }}
                disabled={lock}

            />




        </div>

        <div style={{ marginBottom: "10px", display: 'flex' }}>


            <Slider
                min={min}
                max={max}
                style={{ width: '70%' }}
                disabled={lock}
                onChange={(value) => onChange(value, 'scaleZ')}
                value={parseFloat(style.scale?.split(' ')[2]) ?? ""}
                step={0.1}
            />

            <InputNumber type='number' name="scaleZ"
                style={{ width: '30%' }}
                disabled={lock}

                value={parseFloat(style.scale?.split(' ')[2]) ?? ""}
                onChange={(value) => onChange(value, 'scaleZ')}
            />

        </div> */}

    </div>



}


