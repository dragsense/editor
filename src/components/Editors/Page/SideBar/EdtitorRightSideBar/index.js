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
import { pageSetting } from '../../../../../lib/element/elementNode';

const { Sider } = Layout;
const menuKeys = ['sub1', 'sub3', 'sub4', 'sub2', 'sub5', 'sub6', 'sub7', 'sub8'];
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
                label: "WINDOW", value: "WINDOW",
                children: [
                    {
                        label: 'WIDTH',
                        value: 'width'
                    },
                    {
                        label: 'HEIGHT',
                        value: 'height'
                    },
                ]
            },
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
    // State for sidebar collapse
    const [collapsed, setCollapsed] = useState(false);
    // State for open keys in the menu
    const [openKeys, setOpenKeys] = useState([]);
    // State for keys in the menu
    const [keys, setKeys] = useState(menuKeys);

    // Function to toggle sidebar collapse
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Function to handle submenu open change
    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
        setKeys(keys.length > 0 && !collapsed ? [keys[keys.length - 1]] : menuKeys);
    };

    // Get color tokens from theme
    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    // State for cascader states
    const [cascaderStates, setCascaderStates] = useState(globalStates);

    // Fetch data on component mount and when state.states changes
    useEffect(() => {
        fetchData();
    }, [state.states]);

    // Async function to fetch data
    const fetchData = async () => {
        const states = state.states || {};
        let panelStates = globalStates;
        for (const key in states) {
            const stateItem = states[key];
            panelStates = [...panelStates, ...stateItem.states]
        }
        setCascaderStates(panelStates);
    }

    // Render function for menu items
    const renderMenuItems = (key) => {
        switch(key) {
            case 'sub1':
                return <Navigator
                    page={state.page}
                    onAdd={onAdd}
                    onMove={onMove}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    node={state.node}
                    onClickElement={onClickElement}
                    pageUpdated={state.pageUpdated}
                    loading={state.loading}
                />;
            case 'sub3':
                return state.node && <Element onChange={onChange}
                    state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />;
            case 'sub4':
                return state.node && <Content
                    onChange={onChange}
                    state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />;
            case 'sub2':
                return state.node && <Component onAdd={onAdd}
                    onChange={onChange}
                    onUpdate={onUpdate}
                    state={state}
                    cascaderStates={cascaderStates} />;
            case 'sub5':
                return state.node && <Collection onChange={onChange}
                    state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />;
            case 'sub6':
                return state.node && <Form onChange={onChange}
                    state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />;
            case 'sub7':
                return state.node && <Styling
                    onDeleteSelector={onDeleteSelector}
                    onUpdateSelector={onUpdateSelector}
                    state={state}
                    onChangeStyle={onChange}
                    onSelectSelector={onSelectSelector} />;
            case 'sub8':
                return state.node &&
                    <LayoutStyle
                        onUpdate={onUpdateSelector}
                        selector={state.selector}
                        onChange={onChange}
                        isStyleChange={state.isStyleChange}
                        layout={state.node.layout}>
                        <SettingOutlined style={{ color: colorPrimary }} />
                    </LayoutStyle>;
            default:
                return null;
        }
    }

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
                                    key === 'sub3' ? 'Element' :
                                        key === 'sub4' ? 'Content' :
                                            key === 'sub2' ? 'Component' :
                                                key === 'sub5' ? 'Collection' :
                                                    key === 'sub6' ? 'Form' :
                                                        key === 'sub7' ? 'Styling' :
                                                            key === 'sub8' ? 'Quick Styling' : null}
                            >
                                <div style={{ padding: '10px 15px 10px 10px' }}>
                                    {renderMenuItems(key)}
                                </div>
                            </Menu.SubMenu>
                        );
                    })}
                </Menu>
            </Sider>
        </>
    );
};

export default EditorRightSideBar;