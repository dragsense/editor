
import { Collapse, Space, Select, Button } from 'antd';
import { useEffect, useState } from 'react';


import _Display from './_Display';
import Flex, { FlexChild } from './Flex';
import Grid, { GridChild } from './Grid';

const { Panel } = Collapse;

export default function Display({ style, properties, onChangeStyle }) {



    const [stylePriority, setStylePriority] = useState({
        display: '',
        opacity: '',
        visibility: '',
        rowGap: '',
        columnGap: '',
        flexDirection: '',
        flexWrap: '',
        zIndex: '',
        justifyContent: '',
        alignItems: '',
        alignContent: '',
        justifyItems: '',
        alignSelf: '',
        flexGrow: '',
        flexShrink: '',
        flexBasis: '',
        order: '',
        justifySelf: '',
        gridRowStart: '',
        gridRowEnd: '',
        gridColumnStart: '',
        gridColumnEnd: '',
        verticalAlign: '',
        gridTemplateRows: '',
        gridTemplateColumns: '',
        gridTemplateAreas: '',
        gridAutoRows: '',
        gridAutoColumns: '',
        gridAutoFlow: ''

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





    return style ? <Collapse defaultActiveKey={['1']} accordion ghost>
        <Panel header="Display" key="1">
            <_Display type="display"  properties={properties} onChangeStyle={onChangeStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority}
            />
        </Panel>
        <Panel header="Flex" key="2">
            <Flex style={style}  properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
            
        </Panel>
        <Panel header="Flex Child" key="3">
            <FlexChild style={style} properties={properties} onChangeStyle={onChangeStyle}  stylePriority={stylePriority} setStylePriority={setStylePriority} />
            
        </Panel>
        <Panel header="Grid" key="4">
          <Grid style={style}  properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />

            
        </Panel>
        <Panel header="Grid Child" key="5">
         <GridChild style={style} properties={properties} onChangeStyle={onChangeStyle}  stylePriority={stylePriority} setStylePriority={setStylePriority} />
            
        </Panel>

    </Collapse>
        : <></>


}


