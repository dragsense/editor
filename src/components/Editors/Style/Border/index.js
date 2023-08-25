import { Collapse, Space, Select, Button } from 'antd';
import { useEffect, useState } from 'react';
import BorderColor from './BorderColor';
import BorderRadius from './BorderRadius';
import BorderStyle from './BorderStyle';
import BorderWidth from './BorderWidth';

import { isEmpty } from '../../../../lib/utils';

const { Panel } = Collapse;

export default function Border({ style, properties, onChangeStyle }) {



    const [stylePriority, setStylePriority] = useState({
        borderTopWidth: '',
        borderLeftWidth: '',
        borderBottomWidth: '',
        borderRightWidth: '',

        borderTopColor: '',
        borderBottomColor: '',
        borderRightColor: '',
        borderLeftColor: '',

        borderLeftStyle: '',
        borderTopStyle: '',
        borderBottomStyle: '',
        borderRightStyle: '',

        borderTopRightRadius: '',
        borderTopLeftRadius: '',
        borderBottomLeftRadius: '',
        borderBottomRightRadius: ''
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


    }, [properties])



    return !isEmpty(style) ? <Space direction='vertical'>
        <Collapse defaultActiveKey={['1']} accordion ghost>
            <Panel header="Border" key="1">
            <BorderStyle type="Style" style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
            <br /><br />
            <BorderWidth type="Width" style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
            <br /><br />

                <BorderColor type="Color" style={style} properties={properties}
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority}
                    setStylePriority={setStylePriority} />
          
            </Panel>
            <Panel header="Radius" key="2">
                <BorderRadius type="Radius" style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
            </Panel>
        </Collapse>

    </Space> : <></>


}


