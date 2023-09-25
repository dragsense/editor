
// Import necessary components from antd library
import React from 'react';
import { Alert, Layout } from 'antd';

const { Content } = Layout;

// MainLayout is a functional component that takes children as props
const MainLayout = ({ children }) => {

    // Use React's useMemo hook to optimize performance by memoizing the style object
    // This ensures that the style object is not recalculated on every render, only when dependencies change
    const contentStyle = React.useMemo(() => ({
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        minHeight: '100vh' // Ensures that the layout takes up at least the full height of the viewport
    }), []);

    return (
        <Layout style={contentStyle}>
            <Content>
                {/* Alert component to display important messages to the user */}
                <Alert 
                    type="warning"
                    closable
                    style={{ marginBottom: 10 }}
                    message={<><strong>Note:</strong>  Our app is currently undergoing testing to ensure an optimal user experience. If you encounter any bugs, please email us at support@dragsense.com.</>} 
                />

                {/* Render children inside Content */}
                {children}
            </Content>
        </Layout>
    );
};

// Export MainLayout as default export
export default MainLayout;
