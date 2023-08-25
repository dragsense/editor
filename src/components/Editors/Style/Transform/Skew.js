import { Input, Checkbox, Button, Slider, Tooltip, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md';

const units = ['px', '%', 'em', 'rem'];

export default function Skew({ min = 0, max = 1, style, stylePriority, setStylePriority,
    properties,
    onChangeStyle
}) {
    const [lock, setLock] = useState(false);

    useEffect(() => {

        if (!properties) {
            return;
        }



        let values = properties["skew"]?.value;

        values = values ? values.split(" ") : [];

        if (values[0] === values[1])
            setLock(true);
        else
            setLock(false)


    }, [properties]);

    const onChange = (value, name) => {
        const values = style.skew ? style.skew.split(' ') : [];

        if (name === 'skewX') values[0] = `${value}deg`;
        else if (name === 'skewY') values[1] = `${value}deg`;

        if (!properties['skew'])
            properties['skew'] = {};


        if (!lock) {
            properties['skew'].value = values.join(' ');

            style.setProperty('skew', values.join(' '), stylePriority.skew);
        }

        else {
            properties['skew'].value = `${value}deg ${value}deg`;

            style.setProperty('skew', `${value}deg ${value}deg`, stylePriority.skew);
        }

        onChangeStyle();
        setStylePriority({ ...stylePriority })


    };

    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';

        if (!properties['skew'])
            properties['skew'] = {};
        properties['skew'].priority = priority;

        setStylePriority({ ...stylePriority, skew: priority })
        style.setProperty('skew', style.skew, priority);

        onChangeStyle();

    }

    return (
        <div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Skew: </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.skew === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            onChangeStyle();

                            if (properties["skew"])
                                delete properties["skew"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "skew": "" })
                            style.removeProperty('skew');
                        }}
                        className="ac-icons-btn"
                    />
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <Button
                    type={lock ? 'primary' : 'default'}
                    onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
            </div>

            <div style={{ marginBottom: "10px", display: 'flex' }}>

                <Slider
                    min={min}
                    max={max}
                    style={{ width: '70%' }}

                    onChange={(value) => onChange(value, 'skewX')}
                    value={parseFloat(style.skew?.split(' ')[0])}
                    step={0.1}
                />
                <InputNumber
                    style={{ width: '30%' }}

                    type="number"
                    name="skewX"
                    value={parseFloat(style.skew?.split(' ')[0])}
                    onChange={(value) => onChange(value, 'skewX')}

                />
            </div>

            <div style={{ marginBottom: "10px", display: 'flex' }}>

                <Slider
                    min={min}
                    max={max}
                    style={{ width: '70%' }}

                    onChange={(value) => onChange(value, 'skewY')}
                    value={parseFloat(style.skew?.split(' ')[1])}
                    step={0.1}
                />
                <InputNumber
                    style={{ width: '30%' }}

                    type="number"
                    name="skewY"
                    value={parseFloat(style.skew?.split(' ')[1])}
                    onChange={(value) => onChange(value, 'skewY')}

                />
            </div>

        </div>



    );
}