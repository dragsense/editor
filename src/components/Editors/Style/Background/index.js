import { Collapse } from 'antd';
import { useEffect, useState } from 'react';


import Color from './Color';
import Image from './Image';
import Size from './Size';
import Position from './Position';
import Repeat from './Repeat';
import Attachment from './Attachment';
import Origin from './Origin';
import Clip from './Clip';

const { Panel } = Collapse;


export default function Background({ style, properties, onChangeStyle }) {


    const [stylePriority, setStylePriority] = useState({
        backgroundColor: '',
        backgroundImage: '',
        backgroundSize: '',
        backgroundPositionX: '',
        backgroundPositionY: '',
        backgroundAttachment: '',
        backgroundOrigin: '',
        backgroundClip: '',
        backgroundRepeat: ''
    })



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




    return <div>

        {style && <>
            <Collapse defaultActiveKey={['1']} accordion ghost>
                <Panel header="Color" key="1">
                    <Color type="Color" style={style}  properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Image" key="2">
                    <Image type="Image" style={style} properties={properties}
                     onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                     setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Size" key="3">
                    <Size type="Size" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Position" key="4">
                    <Position type="Position" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority}
                     setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Repeat" key="5">
                    <Repeat type="Repeat" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Attachment" key="6">
                    <Attachment type="Attachment" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Origin" key="7">
                    <Origin type="Origin" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
                <Panel header="Clip" key="8">
                    <Clip type="Clip" style={style} properties={properties} 
                    onChangeStyle={onChangeStyle} stylePriority={stylePriority} 
                    setStylePriority={setStylePriority} />
                </Panel>
            </Collapse>
        </>}
    </div>


}

