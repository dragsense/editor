import { Collapse } from 'antd';
import { useEffect, useState } from 'react';


import Scale from './Scale';
import Rotate from './Rotate';
import Translate from './Translate';
import Skew from './Skew';
import Perspective from './Perspective';
const { Panel } = Collapse;

export default function Trasform({ style, properties, onChangeStyle  }) {

    const [stylePriority, setStylePriority] = useState({
        scale: '',
        rotate: '',
        translate: '',
        skew: '',
        perspective: ''
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

    }, [properties]);



    return <> {style && <>  <Collapse defaultActiveKey={['1']} accordion ghost>
        <Panel header="Scale" key="1">

            <Scale min={-2} max={2} style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
        </Panel>
        <Panel header="Rotate" key="2">
            <Rotate min={-360} max={360} style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
        </Panel>
        <Panel header="Translate" key="3">
            <Translate min={-50} max={50} style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
        </Panel>
         {/* <Panel header="Skew" key="4">
            <Skew min={0} max={1} style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority}  />
        </Panel> 
         <Panel header="Perspective" key="5">
            <Perspective min={0} max={2} style={style} properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
        </Panel>  */}
    </Collapse>
    </>}
    </>


}


