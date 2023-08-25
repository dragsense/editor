import { useEffect, useState } from 'react';
import { Divider, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;



export default function Add({ newItem, setNewItem, setIsLoading, addNewQuery }) {


    const [newValue, setNewValue] = useState('');
    const [minMax, setMinMax] = useState('min');

    useEffect(() => {
        const v = parseInt(newItem);
        setNewValue(v || '');

    }, [newItem])

    const addItem = async () => {

        setIsLoading(true);

        if (newValue) {
            const mediaText = `@media screen and (${minMax}-width: ${newValue}px) {}`
            addNewQuery(mediaText);

        }
        setNewItem('');
        setIsLoading(false);
    }

    return (
        <>
            <div style={{ padding: 8 }}>
                {/* <Select 
                style={{ width: 100, alignSelf: 'stretch' }}
                value={minMax}
                 onChange={(v) => setMinMax(v)}>
                    <Option value="min">min</Option>
                    <Option value="max">max</Option>
                </Select> */}
                <input type='radio' checked={minMax === 'min'} value='min' onChange={() => setMinMax('min')}/> Min &nbsp; &nbsp;
                <input type='radio' checked={minMax === 'max'} value='max' onChange={() => setMinMax('max')}/> Max
                <div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <Input type='number' value={newValue} readOnly />
                {newValue && <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addItem}
                >
                    <PlusOutlined />
                </a>}
                </div>
            </div>
            <Divider style={{ margin: '4px 0' }} />

        </>

    );
}