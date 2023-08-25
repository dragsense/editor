import { Layout, theme } from 'antd';

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
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>{children}</Content>

        </Layout>

    );
};

export default MainLayout;
