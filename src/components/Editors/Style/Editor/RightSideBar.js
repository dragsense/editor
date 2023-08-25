import React, { Children, useEffect, useState } from 'react';

import { Collapse, Layout, Space, Tooltip, Button, theme, Modal } from 'antd';

import { } from 'react-icons/md'
import { ExclamationCircleFilled, ClearOutlined, DeleteOutlined } from '@ant-design/icons';



import SearchableSelector from '../Selector';
import SearchableMediaQuery from '../MediaQuery';
import { State } from '../State';
import { Pseudo } from '../Pseudo';

import Typography from '../Typography';
import Size from '../Size';
import Spacing from '../Spacing';
import Border from '../Border';
import Background from '../Background';
import Position from '../Position';
import Display from '../Display';
import Shadow from '../Shadow';
import Transition from '../Transition';
import Animation from '../Animation';
import Transform from '../Transform';
import Filter from '../Filter';
import Svg from '../Svg';
import List from '../List';
import Cursor from '../Cursor';


import { RiDeleteBin2Line, RiRestartLine } from 'react-icons/ri';
import { STYLE_STORE_NAME, getData } from '../../../../lib/db';

const { Sider } = Layout;
const { Panel } = Collapse;

const { confirm } = Modal;

export default function RigthSideBar({
    children,
    state,
    selectorKey,
    onChange,
    onSelect,
    onDelete,
    onSubmit,
    animation = false,
    width = 250,
    mode = "dark",
    menuKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'] }) {

    const {
        token: { colorError, colorWarning, colorBgElevated, colorPrimary },
    } = theme.useToken();

    const selector = state.selector;

    const [keys, setKeys] = useState(menuKeys);
    const [elemetState, setState] = useState('');



    const handleMenuOpenChange = (key) => {


        setKeys(key.length > 0 ? key : menuKeys);
    };

    const onSelectState = async (elemetState, value) => {

        if (!selector)
            return;

        const newSelectorText = selector.selectorText;

        const key = state.media || 'normal';

        const currentElement = await getData(state.page._id, selector._uid, 'id', STYLE_STORE_NAME)

        if (!currentElement.style[key])
        currentElement.style[key] = {}

        if (!currentElement.style[key][elemetState || 'root'])
        currentElement.style[key][elemetState || 'root'] = {}

        const properties = currentElement.style[key][elemetState || 'root'].properties || {};


        onSelect({  ...selector, properties, selectorText: newSelectorText }, elemetState);

        setState(elemetState);

    }

    useEffect(() => {
        if (!selector)
        setState('');
    }, [selector])


    return <>



        <Sider width={width} style={{

            borderRadius: 10,
            paddingBottom: 10
        }}>

            <div style={{ padding: 5 }}>
                <div style={{
                    display: 'flex', gap: 5,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ flex: 1 }}>

                        <SearchableSelector

                            state={state}
                            animation={animation}
                            onSelect={onSelect} />
                    </div>


                    <Tooltip placement="left" title="Delete Selector">
                        <Button
                            size='small'
                            ghost
                            icon={<RiDeleteBin2Line style={{ color: colorError }} />}
                            onClick={(e) => {
                                e.preventDefault();

                                confirm({
                                    title: 'Are you sure to delete this selector?',
                                    content: "This action can't be undo.",

                                    icon: <ExclamationCircleFilled />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() {
                                        onDelete(selector);
                                    },
                                    onCancel() {

                                    },
                                });
                            }}
                        > </Button>
                    </Tooltip>




                </div>
                <div style={{
                    marginTop: 6,
                    display: 'flex', gap: 5,
                    alignItems: 'end',
                    justifyContent: 'space-between'
                }}>
                    <div>{!animation && <><span style={{marginRight: 2}}><State state={elemetState} onSelectState={onSelectState} /></span>
                        <Pseudo state={elemetState} onSelectState={onSelectState} /></>}</div>

                    <Tooltip placement="left" title="Reset Current Style">
                        <Button
                            ghost
                            size='small'
                            icon={<RiRestartLine style={{ color: colorWarning }} />}
                            onClick={(e) => {
                                e.preventDefault();

                                confirm({
                                    title: 'Are you sure to reset the class style?',
                                    content: "This action can't be undo.",
                                    icon: <ExclamationCircleFilled />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() {
                                        selector.properties = {}
                                        if (selector?.style) {
                                            for (let i = selector.style.length; i--;) {
                                                const nameString = selector.style[i];
                                                selector.style.removeProperty(nameString);
                                            }
                                        }
                                        onChange();
                                    },
                                    onCancel() {

                                    },
                                });

                            }}

                        > </Button>
                    </Tooltip>
                </div>
            </div>

            <div style={{ maxHeight: '65vh', overflow: 'auto', padding: 5 }}>

                <Collapse
                    style={{
                        maxHeight: '100%',
                        overflow: 'auto',
                        backgroundColor: colorBgElevated,
                    }}
                    onChange={handleMenuOpenChange}
                    accordion
                    
                >

                    {keys.includes('1') && <Panel showArrow={false}
                        header="Typeography"
                        key="1">
                        <Typography style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('2') && <Panel showArrow={false}
                        header="Size"
                        key="2">
                        <Size style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('3') && <Panel showArrow={false}
                        header="Space"
                        key="3">
                        <Spacing style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('4') && <Panel showArrow={false}
                        header="Border"
                        key="4">
                        <Border style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('5') && <Panel showArrow={false}
                        header="Background"
                        key="5">
                        <Background style={selector?.style}
                            properties={selector?.properties}
                            onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('6') && <Panel showArrow={false}
                        header="Position"
                        key="6">
                        <Position style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {keys.includes('7') && <Panel showArrow={false}
                        header="Display"
                        key="7">
                        <Display style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}

                    {keys.includes('8') && <Panel showArrow={false}
                        header="Shadow"
                        key="8">
                        <Shadow style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}

                    {keys.includes('9') && <Panel showArrow={false}
                        header="Transform"
                        key="9">
                        <Transform style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}

                    {keys.includes('10') && <Panel showArrow={false}
                        header="Transition"
                        key="10">
                        <Transition style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}

                    {(keys.includes('11') && !animation) && <Panel showArrow={false}
                        header="Animation"
                        key="11">
                        <Animation style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}

                    {(keys.includes('12')) && <Panel showArrow={false}
                        header="Filter"
                        key="12">
                        <Filter style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                    </Panel>}
                    {(keys.includes('13')) && <Panel showArrow={false}
                        header="Svg"
                        key="13">
                        <Svg style={selector?.style} onChangeStyle={onChange} properties={selector?.properties} />
                    </Panel>}
                    {(keys.includes('14')) && <Panel showArrow={false}
                        header="List"
                        key="14">
                        <List style={selector?.style} onChangeStyle={onChange} properties={selector?.properties} />
                    </Panel>}
                    {(keys.includes('15')) && <Panel showArrow={false}
                        header="Cursor"
                        key="15">
                        <Cursor style={selector?.style} onChangeStyle={onChange} properties={selector?.properties} />
                    </Panel>}

                </Collapse>
            </div>
            {children}

        </Sider>

    </>

}

