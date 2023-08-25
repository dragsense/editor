import React, { useEffect, useRef, useState } from 'react';
import {
    DeleteOutlined,
    CopyOutlined,
    DragOutlined,
    SaveOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";

import { theme, Modal, Button } from 'antd';

const { confirm } = Modal;

export function ToolBarButton({ children, onDoubleClick, onClick, drag, type }) {



    return <><Button ref={drag}
        danger={type == 'danger'}
        type={type == 'danger' ? 'primary' : type}
        onDoubleClick={onDoubleClick} onClick={onClick}>
        {children}
    </Button> </>
}

function ToolBar({ onCopy, onDelete }) {


    return (
        <>

           <ToolBarButton type="danger" onDoubleClick={onDelete} title="delete"><DeleteOutlined style={{ fontSize: "14px", }} /></ToolBarButton> 
            <ToolBarButton type="default" onDoubleClick={onCopy} title="duplicate"><CopyOutlined style={{ fontSize: "14px", }} /></ToolBarButton>

        </>
    )
}

export default ToolBar;