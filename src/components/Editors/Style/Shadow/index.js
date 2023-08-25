import React, { useState } from "react";

import { Collapse } from "antd";

import ShadowBox from "./BoxShadow";
import ShadowText from './TextShadow';
const { Panel } = Collapse;

const Shadow = ({ style, properties, onChangeStyle }) => {

    return (<>
        <Collapse defaultActiveKey={['1']} accordion ghost>
            <Panel header="Box Shadow" key="1">

                <ShadowBox style={style} properties={properties} onChangeStyle={onChangeStyle} />
            </Panel>
            <Panel header="Text Shadow" key="2">

                <ShadowText style={style} properties={properties} onChangeStyle={onChangeStyle} />
            </Panel>
        </Collapse>
    </>
    );
};

export default Shadow;