import { Alert, Layout, theme } from 'antd';

const { Content } = Layout;


const MainLayout = ({
    children,
}) => {


    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{  minHeight: '100vh' }}>
            <Content
                style={{
                    display: 'flex',
                  
                    width: '100%',
                    justifyContent: 'center'
                }}>
                   <Alert type="warning"
                            closable
                            style={{ marginBottom: 10 }} message={<><strong>Note:</strong> Our app is currently in testing mode to ensure a top-notch experience.</>} />

                {children}</Content>

        </Layout>

    );
};

export default MainLayout;
