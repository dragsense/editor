import { Checkbox, Space, Select, Tooltip, Button } from 'antd';
import { useEffect, useState } from 'react';

import { MdLockOpen, MdLockOutline, MdRestartAlt } from 'react-icons/md'

const { Option } = Select;


const values = ['visible', 'hidden', 'clip', 'scroll', 'auto'];

export default function Overflow({ style, stylePriority, setStylePriority, properties, onChangeStyle }) {



    const [lock, setLock] = useState(true);


    useEffect(() => {

        if (!properties)
            return;

        if (properties["overflow-x"]?.value === properties["overflow-y"]?.value)
            setLock(true);
        else
            setLock(false);


    }, [properties])

    const onChangeTop = (value) => {

        if (!properties['overflow-x'])
            properties['overflow-x'] = {};

        if (!properties['overflow-y'])
            properties['overflow-y'] = {};

        if (!lock) {

            properties['overflow-x'].value = value;
            style.setProperty('overflow-x', value, stylePriority.overflowX);
        }
        else {
            properties['overflow-x'].value = value;
            properties['overflow-y'].value = value;
            style.setProperty('overflow-x', value, stylePriority.overflowX);
            style.setProperty('overflow-y', value, stylePriority.overflowY);

        }

               onChangeStyle(); setStylePriority({ ...stylePriority });


    }




    const onChangeBottom = (value) => {

        if (!properties['overflow-x'])
            properties['overflow-x'] = {};

        if (!properties['overflow-y'])
            properties['overflow-y'] = {};

        if (!lock) {
            properties['overflow-y'].value = value;

            style.setProperty('overflow-y', value, stylePriority.overflowY);
        }
        else {
            properties['overflow-x'].value = value;
            properties['overflow-y'].value = value;
            style.setProperty('overflow-x', value, stylePriority.overflowX);
            style.setProperty('overflow-y', value, stylePriority.overflowY);

        }
               onChangeStyle(); setStylePriority({ ...stylePriority });

    }



    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';

        const _name = e.target['data-name'];


        if (!properties['overflow-x'])
            properties['overflow-x'] = {};

        if (!properties['overflow-y'])
            properties['overflow-y'] = {};


        if (!lock) {
            properties[_name].priority = priority;
            style.setProperty(_name, style[name], priority);
            setStylePriority({ ...stylePriority, [name]: priority })

        } else {
            properties['overflow-x'].priority = priority;
            properties['overflow-y'].priority = priority;
            style.setProperty('overflow-x', style.overflowX, priority);
            style.setProperty('overflow-y', style.overflowY, priority);
            setStylePriority({ ...stylePriority, overflowX: priority, overflowY: priority })


        }

        onChangeStyle();
    }


    return <><div style={{ marginBottom: "10px" }}>
        <strong>Overflow: </strong>

        <Tooltip placement="top" title="Reset">
            <Button
                style={{ float: 'right' }}
                size='small'
                icon={<MdRestartAlt size="small" />}
                onClick={(e) => {
                    e.preventDefault();

                    if (properties['overflow-x'])
                                    delete properties['overflow-x'];

                                    if (properties['overflow-y'])
                                    delete properties['overflow-y'];

                           onChangeStyle(); setStylePriority({ ...stylePriority, overflowX: '', overflowY: '' });

                    style.removeProperty('overflow');
                }}
                className="ac-icons-btn"
            ></Button>
        </Tooltip>
    </div>
        <div style={{ marginBottom: "10px" }}>

            <Button type={lock ? 'primary' : 'default'} onClick={(e) => { e.preventDefault(); setLock(!lock) }}>{lock ? <MdLockOutline size='1rem' /> : <MdLockOpen size='1rem' />}</Button>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.overflowX}
                style={{ width: 'calc(100% - 29px)' }}
                onChange={onChangeTop}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {values.map(s => <Option value={s}>{s}</Option>)}

            </Select>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }} name='overflowX' data-name="overflow-x" checked={stylePriority.overflowX === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>

        <div style={{ marginBottom: "10px" }}>
            <Select
                showSearch
                placeholder="Select Style"
                optionFilterProp="children"
                value={style.overflowY}
                style={{ width: 'calc(100% - 29px)' }}
                onChange={onChangeBottom}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {values.map(s => <Option value={s}>{s}</Option>)}

            </Select>
            <Tooltip placement="top" title="important">
                <Checkbox style={{ marginLeft: 3 }} name='overflowY' data-name="overflow-y" checked={stylePriority.overflowY === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
        </div>

    </>


}


