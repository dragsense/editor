import { useEffect, useState } from 'react';
import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;



export default function Add({ newItem, setNewItem,  setIsLoading }) {

    const addItem = async () => {

        setIsLoading(true);
        setNewItem('');
        setIsLoading(false);
    }

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input style={{ flex: 'auto' }} value={newItem} />
                <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={()=>addItem(newItem)}
                >
                    <PlusOutlined />
                </a>
            </div>
            <Divider style={{ margin: '4px 0' }} />
        
        </>

    );
}