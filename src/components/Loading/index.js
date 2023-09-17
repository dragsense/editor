// Import necessary libraries and components
import React, { memo } from "react";
import { Spin } from 'antd';

// Define a style object outside of the component to avoid unnecessary re-rendering
const loadingStyle = {
    width: '90%', 
    height: '90%', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

// Use React.memo to avoid unnecessary re-rendering of the Loading component
const Loading = memo(() => {
    // Render a Spin component from antd for loading indication
    return (
        <div style={loadingStyle}>
            <Spin tip="Loading" size="large" />
        </div>
    );
});

export default Loading;
