import * as React from 'react';
import { theme } from 'antd'
//import 'antd/dist/antd.css';
import { DesktopOutlined, LaptopOutlined, TabletOutlined, MobileOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

import { Select, Space } from 'antd';

const { Option } = Select;

const sizes = ['100%', 320, 576, 768, 992, 1200];

export default function BreakPoints({ windowWidth, setWindowWidth, minMax, setMinMax, orientation, setOrientation }) {

    const {
        token: {colorText, },
    } = theme.useToken();


    const handleChange = (value) => {


        if (!value || value == '100%') {
            value = '100%';
            setMinMax('');
            setOrientation('');
        } else {
            if (!minMax) setMinMax('min')

          
            
            if (value <= 768 && !orientation)
                setOrientation('portrait');
            else if(!orientation)
                setOrientation('landscape');
        }



        setWindowWidth(value);
    };

    function handleZoomIn(e) {
        if (windowWidth < 2560)
            setWindowWidth(windowWidth + 50);
    }

    function handleZoomOut(e) {
        if (windowWidth > 280)
            setWindowWidth(windowWidth - 50);
    }

    return (
        <Space>

            <input type='radio' style={{color:colorText}} checked={minMax === 'min'} value='min' onChange={() => setMinMax('min')} /> <span style={{color:colorText}}> Min</span>
            <input type='radio' style={{color:colorText}} checked={minMax === 'max'} value='max' onChange={() => setMinMax('max')} /> <span style={{color:colorText}}> Max</span>
            &nbsp; &nbsp;

            {windowWidth >= 1200 ?
                <DesktopOutlined style={{ color:colorText, marginRight: 7, fontSize: 18, rotate: orientation == 'portrait' ? '-90deg' : null }} /> :

                windowWidth >= 992 ?
                    <LaptopOutlined style={{ color:colorText, marginRight: 7, fontSize: 18, rotate: orientation == 'portrait' ? '-90deg' : null }} /> :


                    windowWidth >= 768 ?
                        <TabletOutlined style={{ color:colorText,marginRight: 7, fontSize: 18, rotate: orientation == 'landscape' ? '-90deg' : null }} /> :


                        windowWidth >= 320 &&
                        <MobileOutlined style={{ color:colorText,marginRight: 7, fontSize: 18, rotate: orientation == 'landscape' ? '-90deg' : null }} />
            }

            <Select defaultValue="" value={windowWidth} size='small' style={{ minWidth: 70 }} onChange={handleChange} allowClear placeholder="--">
                {sizes.map(val => <Option key={val} value={val}>{val}</Option>)}
            </Select>
            {/* <Button  size="small" icon={<ZoomInOutlined />}  style = {{marginLeft: 7}} onClick={handleZoomIn}/>
            <Button  size="small" icon={<ZoomOutOutlined />}  style = {{marginLeft: 7}} onClick={handleZoomOut}/> */}
            &nbsp; &nbsp;

            <input type='radio' checked={orientation === 'landscape'} value='landscape' onChange={() => setOrientation('landscape')} /><span style={{color:colorText}}>  Landscape </span>
            <input type='radio' checked={orientation === 'portrait'} value='portrait' onChange={() => setOrientation('portrait')} /> <span style={{color:colorText}}> Portrait </span>

        </Space>
    );
}