
import { Divider, Card, Modal } from 'antd';
import { useState, useEffect } from 'react';
import ElementComponent from './ElementComponent';


import { getAllData, getData, storePage, updateData } from "../../../../../../../lib/db";

import LayoutContent from '../../../../Element/LayoutContent';


import {
    ExclamationCircleFilled
} from "@ant-design/icons";
const COMPONENTS = ['none', 'slider', 'tabs', 'gallery', 'accordion', 'modal', 'menu', 'dropdown']



const { confirm } = Modal;


export default function Component({ state, cascaderStates, onUpdate, onAdd }) {


    const [component, setComponent] = useState(null);

    const fetchComponent = async () => {

        if (state.type === 'component') {
            const _id = state.page._id;
            const page = await getAllData(_id);

            setComponent(page);
        } else
            setComponent(null);

    }


    useEffect(() => {

        if (!state.page)
            return;

        fetchComponent();

    }, [state.page]);


    const createMenu = async (menus, childNodes) => {
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
                        nested.menus = await createMenu(menu.children, childNodes);
                        await updateData(state.page._id, nested);

                    }
                }
            }

            return menu;
        });

        return Promise.all(menuPromises);
    };

    const onAddMenus = async (menus) => {


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
                element.menus = await createMenu(menus, childNodes)
                await updateData(state.page._id, element);

                await onAdd({ addmenu: true }, state.node._uid, false, pos, null);
            },
            onCancel() {
            },
        });

    }


    const onUpdateNNodes = (type, data) => {

        if (type === 'menu')
            onAddMenus(data);
        else {
            state.node.states = data
            onUpdate(state.node);
            if (state.states[state.node.cname]) {
                state.states[state.node.cname].setStates(data);
            }
        }

    }

    const onSubmit = async (states) => {

        if (state.type === 'component') {

            const _id = state.page._id;
            const page = await getAllData(_id);
            page.states = states;
            await storePage(page);

            if (state.states["STATES"])
                state.states["STATES"].setStates(states);

        }
    }

    return (component && state.node.type !== 'component') ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card>

                <ElementComponent
                    component={component}
                    onSubmit={onSubmit}
                />

            </Card>
        </div>
    </>
        : <>        <Card bodyStyle={{ padding: 0 }}><LayoutContent state={state}
            onUpdate={onUpdateNNodes} /></Card>

        </>
}