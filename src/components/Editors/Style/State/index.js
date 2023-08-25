

import React, { useEffect, useState } from 'react';
import { Button, Space } from 'antd';


const states = [':hover'];

export function State({ onSelectState, state }) {



    return <Space size={2} align='start'> 
            {states.map(s => <Button size='small'  onClick={() => 
               onSelectState(state.includes(s) ? '' : s, ":hover" + '|' + "::after" + '|' + "::before")
                } type={`${state.includes(s) ? 'primary' : 'dashed'}`}>
            {s.toUpperCase()}
        </Button>)}
    </Space>

}
