import React, { useState, useEffect } from "react";
import { Button, Card, theme, Typography, Descriptions, Alert } from "antd";
import { MailOutlined, LinkOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StyleEditor, AnimationEditor, PageEditor } from "../Editors";

const { Text, Title } = Typography;

// Navigation buttons component
const NavButtons = ({ setLocation }) => (
    <nav>
        <Button onClick={() => setLocation("/style-editor")} style={{ marginRight: 8 }}>Open Style Editor</Button>
        <Button onClick={() => setLocation("/anim-editor")} style={{ marginRight: 8 }}>Open Animation Editor</Button>
        <Button onClick={() => setLocation("/page-editor")}>Open Page Editor</Button>
    </nav>
);

// Main card component with description and contact info
const MainCard = ({ userName, session, setLocation }) => (
    <div style={{ width: '70%', margin: 'auto' }}>
        <Title>Welcome, <span style={{ color: theme.useToken().token.colorPrimary }}>{userName}</span></Title>
        {!session && <Alert message="You are not connected to the web app. Please login first." type="error" showIcon style={{ marginBottom: 10 }} />}
        <Card title="Autocode Editor:" extra={session && <NavButtons setLocation={setLocation} />}>
            <p>The Web Editor allows you to create pages, styles, and animations without any code.</p>
            <Descriptions column={1}>
                <Descriptions.Item label={<Text strong><MailOutlined /></Text>}>info@dragsense.com</Descriptions.Item>
                <Descriptions.Item label={<Text strong><LinkOutlined /> </Text>}><a href="http://dragsense.com/">dragsense.com</a></Descriptions.Item>
            </Descriptions>
        </Card>
    </div>
);

const Main = ({ store }) => {
     // Determine the route location based on the page type
     const determineLocation = () => {
        switch(store.pageType) {
            case 'style': return '/style-editor';
            case 'animation': return '/anim-editor';
            case 'page':
            case 'component':
            case 'form':
            case 'collection': return '/page-editor';
            default: return '/';
        }
    }

    const [currentLocation, setCurrentLocation] = useState(determineLocation());

    useEffect(() => {
        setCurrentLocation(determineLocation());
    }, [store.pageType]);

    return (
        <div style={{ width: '100%', color: 'white' }}>
            <Router>
                <Routes location={currentLocation}>
                    <Route path="/" element={<MainCard userName={store.userName} session={store.session} setLocation={setCurrentLocation} />} />
                    {store.session && (
                        <>
                            <Route path="/style-editor" element={<StyleEditor onBack={() => setCurrentLocation("/")} />} />
                            <Route path="/anim-editor" element={<AnimationEditor onBack={() => setCurrentLocation("/")} />} />
                            <Route path="/page-editor" element={<PageEditor _id={store.pageId} pageType={store.pageType} onBack={() => setCurrentLocation("/")} />} />
                        </>
                    )}
                </Routes>
            </Router>
        </div>
    );
};

export default Main;