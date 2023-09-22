import { Divider, Card, Modal } from 'antd';
import { useState, useEffect } from 'react';
import ElementComponent from './ElementComponent';
import { getAllData, getData, storePage, updateData } from "../../../../../../../lib/db";
import LayoutContent from '../../../../Element/LayoutContent';
import { ExclamationCircleFilled } from "@ant-design/icons";
const COMPONENTS = ['none', 'slider', 'tabs', 'gallery', 'accordion', 'modal', 'menu', 'dropdown']
const { confirm } = Modal;

// Function to fetch component data
const fetchComponent = async (state, setComponent) => {
    if (state.type === 'component') {
        const _id = state.page._id;
        const page = await getAllData(_id);
        setComponent(page);
    } else
        setComponent(null);
}

// Function to create menu
const createMenu = async (state, menus, childNodes) => {
    const menuPromises = menus.map(async (menu, i) => {
        if (childNodes[i]) {
            menu.childId = childNodes[i];
        } else
            menu.childId = null;
        if (menu.children) {
            const element = await getData(state.page._id, childNodes[i]);
            if (element?.nestedMenuId) {
                const nested = await getData(state.page._id, element.nestedMenuId);
                if (nested) {
                    const childNodes = nested.childNodes;
                    nested.menus = await createMenu(state, menu.children, childNodes);
                    await updateData(state.page._id, nested);
                }
            }
        }
        return menu;
    });
    return Promise.all(menuPromises);
};

// Function to add menus
const onAddMenus = async (state, menus, onAdd) => {
    if (!state.node?.node || state.node?.layout !== 'menu')
        return;
    confirm({
        title: `Cannot Be Undone: Please Confirm`,
        icon: <ExclamationCircleFilled />,
        okText: 'Continue',
        okType: 'danger',
        async onOk() {
            const pos = state.node.node.dataset.pos;
            const element = await getData(state.page._id, state.node._uid)
            const childNodes = element.childNodes;
            element.menus = await createMenu(state, menus, childNodes)
            await updateData(state.page._id, element);
            await onAdd({ addmenu: true }, state.node._uid, false, pos, null);
        },
        onCancel() {
        },
    });
}

// Function to update nodes
const onUpdateNNodes = (state, type, data,   onUpdate, onAdd) => {
    if (type === 'menu')
        onAddMenus(state, data, onAdd);
    else {
        if(data['activeItem'] && data['activeItem'].defaultValue)
        data['activeItem'].defaultValue = null;
       console.log(data['activeItem']) 
        state.node.states = data
        onUpdate(state.node);
        if (state.states[state.node.cname]) {
            state.states[state.node.cname].setStates(data);
        }

    }
}

// Function to submit form
const onSubmit = async (state, states, events, onChange) => {
    if (state.type === 'component') {
        const _id = state.page._id;
        const page = await getAllData(_id);
        page.states = states;
        page.events = events;
     
        await storePage(page);
        if (state.states["STATES"])
            state.states["STATES"].setStates(states);
        if (state.states["EVENTS"])
            state.states["EVENTS"].setStates(events);
        onChange(true)
    }
}

export default function Component({ state, cascaderStates, onChange, onUpdate, onAdd }) {
    const [component, setComponent] = useState(null);
    const [filteredStates, setFilterStates] = useState(null);

    // Fetch component on page change
    useEffect(() => {
        if (!state.page)
            return;
        fetchComponent(state, setComponent);
        setFilterStates(cascaderStates.filter(state => state.type === 'STATES' || state.type === 'PROPS'))
    }, [state.page]);

    const { layout, type } = state.node;


    return (component && type !== 'component' && layout !== 'menu') ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>
        <Card>
            <ElementComponent
                filteredStates={filteredStates}
                component={component}
                onSubmit={(states, events) => onSubmit(state, states, events, onChange)}
            />
        </Card>
    </>
    : <>        
        <Card>
            <LayoutContent state={state}
                onUpdate={(type, data) => onUpdateNNodes(state, type, data, onUpdate, onAdd)} />
        </Card>
    </>
}
