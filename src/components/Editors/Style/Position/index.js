import { Collapse, Space, Select, Button, Tooltip, Checkbox } from 'antd';
import { useEffect, useState } from 'react';


import _Position from './_Position';
import { isEmpty } from '../../../../lib/utils';
import { MdRestartAlt } from 'react-icons/md';
const { Panel } = Collapse;

export default function Position({ style, properties, onChangeStyle }) {



    const [stylePriority, setStylePriority] = useState({
        position: '',
        left: '',
        right: '',
        top: '',
        bottom: '',
        float: ''
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



    }, [properties]);


    const onChange = (dataName, name, value) => {


        if (!properties[dataName])
            properties[dataName] = {};

        properties[dataName].value = value;

        style.setProperty(dataName, value, stylePriority.color);
        onChangeStyle();
        setStylePriority({ ...stylePriority });

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

    return <Space direction='vertical'>

        {!isEmpty(style) &&
            <Collapse defaultActiveKey={['1']} accordion ghost>
                <Panel header="Position" key="1">
                    <_Position type="position" style={style} onChangeStyle={onChangeStyle}
                        properties={properties}
                        stylePriority={stylePriority} setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Float" key="2">

                    <div style={{ marginBottom: "10px" }}>
                        <strong >Style:    </strong>
                        <Tooltip placement="top" title="important">
                            <Checkbox style={{ marginLeft: 3 }} name='float' data-name="float" checked={stylePriority.float === 'important'} onChange={onChangePriority}>i</Checkbox>
                        </Tooltip>
                        <Tooltip placement="top" title="Reset">
                            <Button
                                style={{ float: "right" }}
                                size="small"
                                icon={<MdRestartAlt size="small" />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (properties['float'])
                                        delete properties['float'];
                                    style.removeProperty('float');
                                    setStylePriority({ ...stylePriority, float: '' });
                                    onChangeStyle();
                                }}

                            ></Button>
                        </Tooltip>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        {['none','left', 'right'].map(f => <Button

                            style={{  marginRight: "5px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                if (style.float === f)
                                    onChange('float', 'float', null)
                                else
                                    onChange('float', 'float', f)
                            }}
                            type={f === style.float ? 'primary' : 'default'}>
                            {f}
                        </Button>)}

                    </div>
                </Panel>
            </Collapse>
        }


    </Space>


}


