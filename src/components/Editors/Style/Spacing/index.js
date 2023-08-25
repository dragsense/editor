import { Collapse, Space, Select, Button } from 'antd';
import { useEffect, useState } from 'react';


import _Spacing from './_Spacing';
const { Panel } = Collapse;

export default function Spacing({ style, properties, onChangeStyle  }) {


    const [stylePriority, setStylePriority] = useState({
        paddingTop: '',
        paddingLeft: '',
        paddingBottom: '',
        paddingRight: '',
        marginTop: '',
        marginLeft: '',
        marginBottom: '',
        marginRight: '',
        margin: '',
        padding: ''
    })

    useEffect( () => {

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



    return <> {style && <>  <Collapse defaultActiveKey={['1']} accordion ghost>
        <Panel header="Padding" key="1">
            <_Spacing type="padding" style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority}  />
        </Panel>
        <Panel header="Margin" key="2">
            <_Spacing type="margin" style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority}  setStylePriority={setStylePriority}  />
        </Panel>
    </Collapse>
    </>}
    </>


}


