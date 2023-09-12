import { useState } from "react";


import { Card } from "antd";
import { MdKeyboardReturn } from "react-icons/md";

export function Preview({ style }) {


    return <div style={{ display: 'flex', 
    padding: 50, 
    perspective: style.perspective,
    justifyContent: 'center' }}>
        <div style={{ ...style, perspective: undefined, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Amazing Animation!
        </div>
    </div>
}
