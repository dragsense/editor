import React, { useEffect, useState } from "react";
import { Button, Card, theme, Typography, Descriptions, Alert } from "antd";
import { PhoneOutlined, MailOutlined, LinkOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, useNavigate, Routes, Route, Link } from 'react-router-dom';

import { StyleEditor, AnimationEditor, PageEditor } from "../Editors";

const { Text, Title } = Typography;

const types = ['page', 'component', 'form', 'collection']

const Main = ({ session, store }) => {

    const [location, setLocation] = useState(() => {
        if (store.pageType === 'style')
            return '/style-editor';
        else if (store.pageType === 'animation')
            return '/anim-editor';
        else if (types.includes(store.pageType))
            return '/page-editor';
        else
            return '/';

    })

    const {
        token: { colorPrimary },
    } = theme.useToken();

    useEffect(() => {

        if (!store.session)
            return;

        if (store.pageType === 'style')
            setLocation('/style-editor');
        else if (store.pageType === 'animation')
            setLocation('/anim-editor');
        else if (types.includes(store.pageType))
            setLocation('/page-editor');
        else
            setLocation('/');
    }, [store]);

    const onBack = () => {
        setLocation("/")
    }

    return (

        <div style={{ width: '100%', color: 'white' }}>
            <Router>
                <Routes location={location}>
                    <Route exact path="/" element={<div style={{ width: '70%', margin: 'auto' }}>

                        <Title> Wellcome, {" "}
                            <span style={{ color: colorPrimary }}>{store.userName}</span>
                        </Title>
                        {!store.session && (
                            <Alert
                                message={"You are not connected to the web app. Please login first."}
                                type="error"
                                showIcon
                                style={{ marginBottom: 10 }}
                            />
                        )}

                        <Card title="Autocode Editor: " extra={
                            store.session && <nav>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLocation("/style-editor")
                                    }}
                                    style={{ marginRight: 8 }}>
                                    Open Style Editor
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLocation("/anim-editor")
                                    }}
                                    style={{ marginRight: 8 }}>
                                    Open Animation Editor
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();

                                        setLocation("/page-editor")
                                    }}
                                >
                                    Open Page Editor
                                </Button>
                            </nav>}>


                            <p>
                                The Web Editor allows you to create pages, styles, and animations without any code. It provides a drag-and-drop interface to design your web elements and easily manage your projects. With a user-friendly interface, you can effortlessly build stunning web pages and customize the styles and animations to make your website stand out.

                            </p>
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Text strong><PhoneOutlined /></Text>}>
                                    0000000000
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>  <MailOutlined /></Text>}>
                                    info@autocode.com
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong><LinkOutlined /> </Text>}>
                                    <a href="www.autocode.com">www.autocode.com</a>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>   </div>} />
                    {store.session && <><Route path="/style-editor" element={<>

                        <StyleEditor onBack={onBack}>

                        </StyleEditor> </>} />

                        <Route path="/anim-editor" element={<>

                            <AnimationEditor onBack={onBack}>

                            </AnimationEditor> </>} />


                        <Route path="/page-editor" element={<>

                            <PageEditor _id={store.pageId} pageType={store.pageType} onBack={onBack}>

                            </PageEditor> </>} /> </>}
                </Routes>







            </Router>
        </div>
    );
};

export default Main;