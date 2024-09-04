// Importing necessary libraries and components
import React from 'react';
import { theme, Select, Space } from 'antd';
import { DesktopOutlined, LaptopOutlined, TabletOutlined, MobileOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

// Defining the sizes for breakpoints
const sizes = ['100%', 320, 576, 768, 992, 1200, 1400, 2400];

// Main function for handling breakpoints
export default function BreakPoints({ windowWidth, setWindowWidth, minMax, setMinMax, orientation, setOrientation }) {

    // Extracting colorText from theme
    const { token: {colorText} } = theme.useToken();

    // Function to handle change in window width
    const handleChange = (value) => {
        // If value is not provided or is '100%', set minMax and orientation to empty
        if (!value || value === '100%') {
            setMinMax('');
            setOrientation('');
        } else {
            // If minMax is not set, set it to 'min'
            if (!minMax) setMinMax('min');

            // Set orientation based on value
            setOrientation(value < 768 ? 'portrait' : 'landscape');
        }

        // Update window width
        setWindowWidth(value);
    };

    // Function to handle zoom in
    const handleZoomIn = () => windowWidth < 2560 && setWindowWidth(windowWidth + 50);

    // Function to handle zoom out
    const handleZoomOut = () => windowWidth > 280 && setWindowWidth(windowWidth - 50);

    // Render function
    return (
        <Space>
            <input type='radio' style={{color:colorText}} checked={minMax === 'min'} value='min' onChange={() => setMinMax('min')} /> <span style={{color:colorText}}> Min</span>
            <input type='radio' style={{color:colorText}} checked={minMax === 'max'} value='max' onChange={() => setMinMax('max')} /> <span style={{color:colorText}}> Max</span>

            {windowWidth >= 1200 ? <DesktopOutlined style={{ color:colorText, marginRight: 7, fontSize: 18, rotate: orientation === 'portrait' ? '-90deg' : null }} /> :
                windowWidth >= 992 ? <LaptopOutlined style={{ color:colorText, marginRight: 7, fontSize: 18, rotate: orientation === 'portrait' ? '-90deg' : null }} /> :
                windowWidth >= 768 ? <TabletOutlined style={{ color:colorText,marginRight: 7, fontSize: 18, rotate: orientation === 'landscape' ? '-90deg' : null }} /> :
                windowWidth >= 320 && <MobileOutlined style={{ color:colorText,marginRight: 7, fontSize: 18, rotate: orientation === 'landscape' ? '-90deg' : null }} />
            }

            <Select defaultValue="" value={windowWidth} size='small' style={{ minWidth: 70 }} onChange={handleChange} allowClear placeholder="--">
                {sizes.map(val => <Select.Option key={val} value={val}>{val}</Select.Option>)}
            </Select>

            <input type='radio' checked={orientation === 'landscape'} value='landscape' onChange={() => setOrientation('landscape')} /><span style={{color:colorText}}>  Landscape </span>
            <input type='radio' checked={orientation === 'portrait'} value='portrait' onChange={() => setOrientation('portrait')} /> <span style={{color:colorText}}> Portrait </span>

        </Space>
    );
}