import React, { useEffect, useState } from 'react';
import { Input, Select, Button, InputNumber, Slider, Checkbox, Tooltip } from 'antd';
import { MdRestartAlt } from 'react-icons/md';

const { Option } = Select;

export default function Perspective({
    min = 0,
    max = 1,
    style,
    stylePriority,
    properties,
    onChangeStyle,
    setStylePriority,
}) {
    const [unit, setUnit] = useState('px');

    useEffect(() => {
        if (!properties) {
            return;
        }
    }, [properties]);

    const onChange = (value) => {
        if (!properties['perspective']) {
            properties['perspective'] = {};
        }

        properties['perspective'].value = value + unit;
        style.setProperty('perspective', value + unit, stylePriority.perspective);

        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };





    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Perspective: </strong>
              
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size="small"
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            if (properties['perspective']) {
                                delete properties['perspective'];
                            }
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, perspective: '' });
                            style.removeProperty('perspective');
                        }}
                    />
                </Tooltip>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <InputNumber
                    style={{ width: '100%' }}
                    name="perspectiveValue"
                    size="small"
                    placeholder="Perspective"
                    value={parseFloat(properties['perspective']?.value) || 0}
                    onChange={(value) => onChange(value)}

                />

                <Slider
                    min={min}
                    max={max}
                    onChange={(value) => onChange(value)}
                    value={parseFloat(properties['perspective']?.value) || 0}
                    step={0.1}
                />
            </div>
        </div>
    );
}