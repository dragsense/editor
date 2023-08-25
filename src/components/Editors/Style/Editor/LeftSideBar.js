import React, { useEffect, useState } from 'react';

import { Menu, Layout, Divider } from 'antd';

const { Sider } = Layout;

const elements = [
    'default', // 0
    // Layout
    'root', // 1
    'nav', // 2
    'header', // 3
    'aside', // 4
    'main', // 5
    'hr', // 6
    'article', // 7
    'section', // 8
    'div', // 9
    'footer', // 10
    // Typography
    'h1', // 11
    'h2', // 12
    'h3', // 13
    'h4', // 14
    'h5', // 15
    'h6', // 16
    'p', // 17
    'ul', // 18
    'ol', // 19
    'li', // 20
    'a', // 21
    'blockquote', // 22
    'span', // 23
    'button', // 24
    // Visual
    'img', // 25
    'video', // 26
    'audio', // 27
    // Form
    'form', // 28
    'label', // 29
    'input', // 30
    'input[type="file"]', // 31
    'input[type="color"]', // 32
    'select', // 33
    'select[multiple=true]', // 34
    'textarea', // 35
    'input[type="submit"]', // 36
]

const menuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];

export default function LeftSideBar({ onEdit, elementType }) {

    const [selectedElementKey, setElementSelectedKey] = useState(["0"]);
    const [openKeys, setOpenKeys] = useState([]);
    const [keys, setKeys] = useState(menuKeys);


    const handleElementSelect = (event) => {


        if (elementType !== elements[event.key]) {
            let element = elements[event.key];
                onEdit(element);
                setElementSelectedKey([event.key]);

            }

        };
        const handleSubMenuOpenChange = (keys) => {
            setOpenKeys(keys.slice(-1));

            setKeys(keys.length > 0 ? [keys[keys.length - 1]] : menuKeys);

        };

        return <Sider width={180}
            theme="light"

        >

            <Divider orientation="center"> {"Preview: "} {elements[selectedElementKey]} </Divider>



            <Menu
                theme='light'
                mode="inline"
                openKeys={openKeys}
                style={{ maxHeight: '100%', overflow: 'auto' }}
                selectedKeys={selectedElementKey}
                onClick={handleElementSelect}
                onOpenChange={handleSubMenuOpenChange}

            >
                <Menu.Item key="0">Default</Menu.Item>

                {keys.includes('sub1') && <Menu.SubMenu key="sub1" title="Layout">
                    <Menu.Item key="1">Body</Menu.Item>
                    <Menu.Item key="2">Nav</Menu.Item>
                    <Menu.Item key="3">Header</Menu.Item>
                    <Menu.Item key="4">Aside</Menu.Item>
                    <Menu.Item key="5">Main</Menu.Item>
                    <Menu.Item key="6">Hr</Menu.Item>
                    <Menu.Item key="7">Article</Menu.Item>
                    <Menu.Item key="8">Section</Menu.Item>
                    <Menu.Item key="9">Div</Menu.Item>
                    <Menu.Item key="10">Footer</Menu.Item>




                </Menu.SubMenu>}
                {keys.includes('sub2') && <Menu.SubMenu key="sub2" title="Typeography">
                    <Menu.Item key="11">Heading 1</Menu.Item>
                    <Menu.Item key="12">Heading 2</Menu.Item>
                    <Menu.Item key="13">Heading 3</Menu.Item>
                    <Menu.Item key="14">Heading 4</Menu.Item>
                    <Menu.Item key="15">Heading 5</Menu.Item>
                    <Menu.Item key="16">Heading 6</Menu.Item>
                    <Menu.Item key="17">Paragraph</Menu.Item>
                    <Menu.Item key="18">List</Menu.Item>
                    <Menu.Item key="19">Order List</Menu.Item>
                    <Menu.Item key="20">List Item</Menu.Item>
                    <Menu.Item key="21">Another Link</Menu.Item>
                    <Menu.Item key="22">Blockquote</Menu.Item>
                    <Menu.Item key="23">Span</Menu.Item>
                    <Menu.Item key="24">Button</Menu.Item>




                </Menu.SubMenu>}
                {keys.includes('sub3') && <Menu.SubMenu key="sub3" title="Meida">


                    <Menu.Item key="25">Image</Menu.Item>
                    <Menu.Item key="26">Video</Menu.Item>
                    <Menu.Item key="27">Audio</Menu.Item>


                </Menu.SubMenu>}

                {keys.includes('sub4') && <Menu.SubMenu key="sub4" title="Form">

                    <Menu.Item key="28">Form</Menu.Item>
                    <Menu.Item key="29">Label</Menu.Item>
                    <Menu.Item key="30">Input</Menu.Item>
                    <Menu.Item key="31">File</Menu.Item>
                    <Menu.Item key="32">Color</Menu.Item>
                    <Menu.Item key="33">Select</Menu.Item>
                    <Menu.Item key="34">Multi Select</Menu.Item>
                    <Menu.Item key="35">TextArea</Menu.Item>
                    <Menu.Item key="36">Submit</Menu.Item>

                </Menu.SubMenu>}

            </Menu>
        </Sider>



    }

