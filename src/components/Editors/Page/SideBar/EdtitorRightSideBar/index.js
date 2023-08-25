import React, { useState, useEffect } from 'react';
import { Menu, Layout, Typography, theme } from 'antd';

import { RiSettings3Line, RiEditLine, RiLayoutGridFill } from 'react-icons/ri';
import { AiOutlineFontSize, AiOutlineForm } from 'react-icons/ai';
import { BiCollection, BiMenu } from 'react-icons/bi';



//'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7']

import Navigator from '../../Panel/RightPanel/Navigator';
import Element from '../../Panel/RightPanel/Setting/Element';
import Collection from '../../Panel/RightPanel/Setting/Collection';
import Component from '../../Panel/RightPanel/Setting/Component';
import Form from '../../Panel/RightPanel/Setting/Form';
import Styling from '../../Panel/RightPanel/Setting/Styling';
import { generateCascader, generateCascaderCollStates } from '../../../../../lib/utils';
import { getAllData, getData } from '../../../../../lib/db';

import Content from '../../Panel/RightPanel/Setting/Content';
import ComponentServices from '../../../../../lib/services/components';


import LayoutStyle from '../../Element/LayoutStyle';
import { FontColorsOutlined, SettingOutlined } from '@ant-design/icons';


const { Sider } = Layout;
const menuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'sub8'];
const { Title } = Typography;

const iconMap = {
    sub1: <BiMenu size="1.5em" />,
    sub2: <RiLayoutGridFill size="1.5em" />,
    sub3: <RiSettings3Line size="1.5em" />,
    sub4: <RiEditLine size="1.5em" />,
    sub5: <BiCollection size="1.5em" />,
    sub6: <AiOutlineForm size="1.5em" />,
    sub7: <AiOutlineFontSize size="1.5em" />,
    sub8: <FontColorsOutlined size="1.5em" />
};


let globalStates = [
    {
        label: "GLOBAL", value: "GLOBAL", type: "GLOBAL", children: [
            {
                label: "WEBSITE", value: "WEBSITE",
                children: [

                    {
                        label: 'TITLE',
                        value: 'title'
                    },
                    {
                        label: 'Tag Line',
                        value: 'tagline'
                    },
                    {
                        label: 'DESCRIPTION',
                        value: 'desc'
                    },
                    {
                        label: 'Author',
                        value: 'author'
                    },
                    {
                        label: "IMAGES", value: "images",
                        children: [
                            {
                                label: 'Favicon',
                                value: 'favicon'
                            },
                            {
                                label: 'Mobile Logo',
                                value: 'mobile-logo'
                            },
                            {
                                label: 'Logo',
                                value: 'logo'
                            },
                            {
                                label: 'Placeholder',
                                value: 'placehodler'
                            }
                        ]

                    },


                ]
            },
            // { type: 'array', label: "PAGES", value: "PAGES" },
            {
                label: "PAGE", value: "PAGE",
                children: [
                    {
                        label: 'TITLE',
                        value: 'title'
                    },
                    {
                        label: 'DESCRIPTION',
                        value: 'desc'
                    },
                    {
                        label: 'CONTENT',
                        value: 'content'
                    },
                    {
                        label: 'Excerpt',
                        value: 'excerpt'
                    },
                    {
                        label: 'IMAGE',
                        value: 'image'
                    },
                    {
                        label: 'STATUS',
                        value: 'status'
                    },
                    {
                        label: 'Creator',
                        value: 'creator'
                    },
                  
                    {
                        label: 'Created At', value: 'createdAt',
                        children: [
                            { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                            { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                            { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                            { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                            { label: "Month D, YYYY", value: "MMMM D, YYYY" },
                            { label: "D MMM, YYYY", value: "D MMM, YYYY" },
                            { label: "MMMM DD, YYYY", value: "MMMM DD, YYYY" },
                            { label: "DD MMM, YYYY", value: "DD MMM, YYYY" },
                
                        ]
                    },
                    {
                        label: 'URL',
                        value: 'url'
                    },
                ]
            },
            // {label: 'Query', value: 'query' },
        ]
    },
    { label: 'MAPINDEX', value: 'MAPINDEX' },
    { label: 'MAPVALUE', value: 'MAPVALUE' }

]

const EditorRightSideBar = ({ onClickElement,
    onUpdate,
    onChange,
    onSelectSelector,
    onDeleteSelector,
    onUpdateSelector,
    onMove,
    onAdd,
    onCopy,
    onDelete,
    state }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const [keys, setKeys] = useState(menuKeys);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
        setKeys(keys.length > 0 && !collapsed  ? [keys[keys.length - 1]] : menuKeys);
    };

    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    const [cascaderStates, setCascaderStates] = useState(globalStates);

    const [customPaths, setCustomPaths] = useState([]);


    useEffect(() => {

        const load = async () => {
            try {
                const res = await ComponentServices.getPaths();
                if (res.paths)
                    setCustomPaths(res.paths);
            } catch (e) {
            } finally {
            }
        }

        load();
    }, []);

    useEffect(() => {

        const fetchData = async () => {
          
            const states = state.states || {};

            let panelStates = globalStates;
            for (const key in states) {
                const stateItem = states[key];
                    panelStates = [...panelStates, ...stateItem.states]
            }

            setCascaderStates(panelStates);

        }

        fetchData();

    }, [state.states]);



    return (
        <>

            <Sider
                width={290}
                theme="light"
                reverseArrow={true}
                collapsible collapsed={collapsed}
                onCollapse={toggleCollapsed}
            >

                {state.node && !collapsed && <Title level={4} style={{ padding: 4, margin: 0, textAlign: 'center' }}> Element:{" "}
                    <span style={{ color: colorPrimary }}>{state.node.name || state.node.tagName}</span>
                </Title>}
                <Menu
                    mode="inline"
                    direction="rtl"
                    openKeys={openKeys}
                    style={{ height: '100%', overflow: 'auto', background: colorPrimary }}
                    onOpenChange={handleSubMenuOpenChange}
                >
                    {keys.map((key) => {
                        return (
                            <Menu.SubMenu
                                icon={iconMap[key]}
                                key={key}
                                title={key === 'sub1' ? 'Navigator' :
                                    key === 'sub2' ? 'Component' :
                                        key === 'sub3' ? 'Element' :
                                            key === 'sub4' ? 'Content' :
                                                key === 'sub5' ? 'Collection' :
                                                    key === 'sub6' ? 'Form' :
                                                        key === 'sub7' ? 'Styling' :
                                                            key === 'sub8' ? 'Quick Styling' : null}
                            >
                                <div style={{ padding: '10px 15px 10px 10px' }}>
                                    {key === 'sub1' ? <Navigator
                                        onMove={onMove}
                                        onCopy={onCopy}
                                        onDelete={onDelete}
                                        onClickElement={onClickElement}
                                        state={state} /> :
                                        key === 'sub2' ? (state.node && <Component onAdd={onAdd}
                                         onChange={onChange}
                                         onUpdate={onUpdate}
                                            state={state} 
                                            cascaderStates={cascaderStates} />) :
                                            key === 'sub3' ? (state.node && <Element onChange={onChange}
                                                state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                key === 'sub4' ? (state.node && <Content
                                                    onChange={onChange}

                                                    customPaths={customPaths} state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                    key === 'sub5' ? (state.node && <Collection onChange={onChange}
                                                        state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                        key === 'sub6' ? (state.node && <Form onChange={onChange}
                                                            state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                            key === 'sub7' ? (state.node && <Styling
                                                                onDeleteSelector={onDeleteSelector}
                                                                onUpdateSelector={onUpdateSelector}
                                                                state={state}
                                                                onChangeStyle={onChange}
                                                                onSelectSelector={onSelectSelector} />) :

                                                                key === 'sub8' ? (state.node &&
                                                                    <LayoutStyle
                                                                        onUpdate={onUpdateSelector}
                                                                        selector={state.selector}
                                                                        onChange={onChange}
                                                                        isStyleChange={state.isStyleChange}
                                                                        layout={state.node.layout}>
                                                                        <SettingOutlined style={{ color: colorPrimary }} />
                                                                    </LayoutStyle>
                                                                )
                                                                    :
                                                                    null}
                                </div>
                            </Menu.SubMenu>
                        );
                    })}
                </Menu>

            </Sider></>
    );
};

export default EditorRightSideBar;