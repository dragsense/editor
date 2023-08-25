

import React, { useEffect, useState } from 'react';
import { Button,Space } from 'antd';


const states = ['::before', '::after'];

export function Pseudo({ onSelectState, state}) {

 

    return <Space size={2} align='start'>
            {states.map(s => <Button size='small'    onClick={() => {
                onSelectState(state.includes(s) ? '' : s,  "::after" + '|' + "::before")
            }
                } type={`${state.includes(s) ? 'primary' : 'dashed'}`}>
            {s === '' ? "NORMAL" : s.toUpperCase()}
            </Button>)}
            </Space>
     
    
}
