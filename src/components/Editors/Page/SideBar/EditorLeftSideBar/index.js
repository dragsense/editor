import React, { useState, useReducer, useEffect } from 'react';
import { Menu, Collapse, Layout } from 'antd';
import { MdFileCopy, MdWidgets, MdPermMedia, MdArrowLeft, MdOutlineEmail } from 'react-icons/md';
import { FaCoins, FaRegEdit } from 'react-icons/fa';
import { BsCodeSlash, BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { CgTemplate } from 'react-icons/cg';


import { PageComponent } from '../../Panel/LeftPanel/Page';
import { TagComponent } from '../../Panel/LeftPanel/Tag';
import { ElementsComponent } from '../../Panel/LeftPanel/Local';
import { usePageStates } from '../../PageProvider';
import { nanoid } from 'nanoid';
import { storePage } from "../../../../../lib/db";

const { Sider } = Layout;
const { Panel } = Collapse;
const menuKeys = ['pages', 'tags', 'components', 'collections', 'forms', 'elements'];


const initial = {
    elements: [],
    error: '',
    pageId: nanoid(16),
    loading: false
}



const reducer = (state, action) => {

    const deleteElement = () => {
        if (state.elements[action.index]) {
            state.elements.splice(action.index, 1);
        }
    }


    switch (action.type) {
        case "start":
            return { ...state, loading: true }

        case "delete":
            deleteElement();
            return {
                ...state, elements: [...state.elements],
                error: ''
            }
        case "add":

            return {
                ...state, elements: [...state.elements, action.element],
                error: ''
            }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

const EditorLeftSideBar = ({ }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const [keys, setKeys] = useState(menuKeys);
    const { onEdit, state } = usePageStates();
    const [elementState, dispatch] = useReducer(reducer, initial);

    useEffect(() => {
        const _id = localStorage.getItem('activePage');
        const type = localStorage.getItem('pageType');

        //onEdit({ _id }, type);
        setSelectedKeys([type + 's']);


        storePage({ _id: elementState.pageId, elements: {} });

    }, []);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const onEditPage = (page, type) => {
        onEdit(page, type);
        setSelectedKeys([type + 's']);
    };

    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
        setKeys(keys.length > 0 ? [keys[keys.length - 1]] : menuKeys);
    };




    return (
        <Sider width={200} collapsible collapsed={collapsed}  onCollapse={toggleCollapsed}>
            <Menu
               
                mode="inline"
                selectedKeys={selectedKeys}
                defaultSelectedKeys={selectedKeys}
                openKeys={openKeys}
                style={{ height: '100%', overflow: 'auto' }}
                onOpenChange={handleSubMenuOpenChange}
            >
                {(keys.includes('pages') || collapsed) && (
                    <Menu.SubMenu icon={<MdFileCopy size="1.5em" />} key="pages" title="Pages">
                        <PageComponent type={'page'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {(keys.includes('components') || collapsed) && (
                    <Menu.SubMenu icon={<MdWidgets size="1.5em" />} key="components" title="Components">
                        <PageComponent type={'component'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {(keys.includes('collections')|| collapsed) && (
                    <Menu.SubMenu icon={<FaCoins size="1.5em" />} key="collections" title="Collections">
                        <PageComponent type={'collection'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {(keys.includes('forms') || collapsed)&& (
                    <Menu.SubMenu icon={<FaRegEdit size="1.5em" />} key="forms" title="Forms">
                        <PageComponent type={'form'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}





                {(keys.includes('tags')|| collapsed) && (
                    <Menu.SubMenu icon={<BsCodeSlash size="1.5em" />}
                        key="tags"
                        title="Tags">
                        <TagComponent gridStyle={{  textAlign: 'center' }} />

                    </Menu.SubMenu>)}

                {(keys.includes('elements')|| collapsed) && (

                    <Menu.SubMenu icon={<BsFillFileEarmarkTextFill size="1.5em" />} key="elements" title="Reusable">
                        <ElementsComponent state={elementState} dispatch={dispatch} pageId={state.page?._id} />
                    </Menu.SubMenu>)}


            </Menu>

        </Sider>
    );
}

export default EditorLeftSideBar;