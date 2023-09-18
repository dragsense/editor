import React, { useState } from 'react';
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

// Define the keys for the menu items
const menuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];

// This component represents the left sidebar of the editor
export default function LeftSideBar({ onEdit, elementType }) {

    // State for the selected element key
    const [selectedElementKey, setSelectedElementKey] = useState(["0"]);
    // State for the open keys in the menu
    const [openKeys, setOpenKeys] = useState([]);
    // State for the keys in the menu
    const [keys, setKeys] = useState(menuKeys);

    // Handler for selecting an element in the menu
    const handleElementSelect = (event) => {
        // If the selected element is not the current element type
        if (elementType !== elements[event.key]) {
            // Get the selected element
            let selectedElement = elements[event.key];
            // Call the onEdit function with the selected element
            onEdit(selectedElement);
            // Set the selected element key state
            setSelectedElementKey([event.key]);
        }
    };

    // Handler for opening and closing submenus in the menu
    const handleSubMenuOpenChange = (keys) => {
        // Set the open keys state to the last key in the keys array
        setOpenKeys(keys.slice(-1));
        // Set the keys state to the last key in the keys array if there are keys, otherwise set it to the menu keys
        setKeys(keys.length > 0 ? [keys[keys.length - 1]] : menuKeys);
    };

    // Render the left sidebar
    return (
        <Sider width={180} theme="light">
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
                {keys.includes('sub1') && <SubMenu key="sub1" title="Layout" items={elements.slice(1, 11)} />}
                {keys.includes('sub2') && <SubMenu key="sub2" title="Typography" items={elements.slice(11, 25)} />}
                {keys.includes('sub3') && <SubMenu key="sub3" title="Media" items={elements.slice(25, 28)} />}
                {keys.includes('sub4') && <SubMenu key="sub4" title="Form" items={elements.slice(28, 37)} />}
            </Menu>
        </Sider>
    );
}

// SubMenu component for rendering the submenus in the menu
function SubMenu({ key, title, items }) {
    return (
        <Menu.SubMenu key={key} title={title}>
            {items.map((item, index) => (
                <Menu.Item key={index}>{item}</Menu.Item>
            ))}
        </Menu.SubMenu>
    );
}
