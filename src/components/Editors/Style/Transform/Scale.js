import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Slider, Checkbox, Tooltip, InputNumber } from 'antd';
import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md';

const { Option } = Select;

export default function Scale({
    min = 0,
    max = 1,
    style,
    stylePriority,
    properties,
    onChangeStyle,
    setStylePriority,
}) {
    const [lock, setLock] = useState(true);

    useEffect(() => {
        if (!properties || !properties['transform'] || !properties['transform']['scale']) {
            return;
        }

        const { valueX, valueY, valueZ } = properties['transform']['scale'];

        if (valueX === valueY && valueX === valueZ) {
            setLock(true);
        } else {
            setLock(false);
        }

    }, [properties]);

    const onChange = (value, name) => {
        if (!properties['transform']) {
            properties['transform'] = {};
        }

        if (!properties['transform']['scale']) {
            properties['transform']['scale'] = {};
        }

        const scaleData = properties['transform']['scale'];

        if (lock) {
            
            scaleData.valueX = value;
            scaleData.valueY = value;
            scaleData.valueZ = value;
        } else {
            if (name === 'scaleX') {
            
                scaleData.valueX = value;
            } else if (name === 'scaleY') {
              
                scaleData.valueY = value;
            } else if (name === 'scaleZ') {
             
                scaleData.valueZ = value;
            }
        }

        // Create the scale transformation string
        const scale = `scale3d(${scaleData.valueX || 1}, ${scaleData.valueY || 1}, ${scaleData.valueZ || 1})`;

        // Preserve other transform properties and set the transform property
        const otherTransform = style.transform.replace(/scale3d\([^)]+\)/, '');
        const finalTransform = `${scale} ${otherTransform}`;

        properties['transform'].value = finalTransform;

        style.setProperty('transform', finalTransform, stylePriority.transform);

        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

  



    return (
        <>
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Scale: </strong>
                 
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties && properties['transform'] && properties['transform']['scale']) {
                                    delete properties['transform']['scale'];
                                }

                                const otherTransform = style.transform.replace(/scale3d\([^)]+\)/, '');
                                const finalTransform = `${otherTransform}`;

                                if (!finalTransform.trim()) {
                                    style.removeProperty('transform');
                                    setStylePriority({ ...stylePriority, transform: '' });
                                } else {
                                    style.setProperty('transform', finalTransform, stylePriority.transform);
                                    properties['transform'].value = finalTransform;
                                    setStylePriority({ ...stylePriority });
                                }

                                onChangeStyle();
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <Button
                        type={lock ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.preventDefault();
                            setLock(!lock);
                        }}
                    >
                        {lock ? <MdLockOutline size="1rem" /> : <MdLockOpen size="1rem" />}
                    </Button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                            style={{width: '100%'}}

                        name="scaleX"
                        size="small"
                        placeholder="scaleX"
                        value={parseFloat(properties['transform']?.scale?.valueX) || 1}
                        onChange={(value) => onChange(value, 'scaleX')}
                        
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'scaleX')}
                        value={parseFloat(properties['transform']?.scale?.valueX) || 1}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                            style={{width: '100%'}}

                        name="scaleY"
                        size="small"
                        placeholder="scaleY"
                        value={parseFloat(properties['transform']?.scale?.valueY) || 1}
                        onChange={(value) => onChange(value, 'scaleY')}
                        
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'scaleY')}
                        value={parseFloat(properties['transform']?.scale?.valueY) || 1}
                        step={0.1}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <InputNumber
                            style={{width: '100%'}}

                        name="scaleZ"
                        size="small"
                        placeholder="scaleZ"
                        value={parseFloat(properties['transform']?.scale?.valueZ) || 1}
                        onChange={(value) => onChange(value, 'scaleZ')}
                 
                    />

                    <Slider
                        min={min}
                        max={max}
                        onChange={(value) => onChange(value, 'scaleZ')}
                        value={parseFloat(properties['transform']?.scale?.valueZ) || 1}
                        step={0.1}
                    />
                </div>
            </div>
        </>
    );
}