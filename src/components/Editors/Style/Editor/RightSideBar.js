import React, { Children, useEffect, useState } from 'react';
import { Collapse, Layout, message, Tooltip, Button, theme, Modal } from 'antd';
import { ExclamationCircleFilled, ClearOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemeServices from '../../../../lib/services/theme';
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

export default function RightSideBar({
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
    const [elementState, setState] = useState('');

    const handleMenuOpenChange = (key) => {
        setKeys(key.length > 0 ? key : menuKeys);
    };

    const onSelectState = async (elementState, value) => {
        if (!selector)
            return;

        const newSelectorText = selector.selectorText;
        const key = state.media || 'normal';
        const currentElement = await getData(state.page._id, selector._uid, 'id', STYLE_STORE_NAME)

        if (!currentElement.style[key])
            currentElement.style[key] = {}

        if (!currentElement.style[key][elementState || 'root'])
            currentElement.style[key][elementState || 'root'] = {}

        const properties = currentElement.style[key][elementState || 'root'].properties || {};

        onSelect({ ...selector, properties, selectorText: newSelectorText }, elementState);
        setState(elementState);
    }

    useEffect(() => {
        if (!selector)
            setState('');
    }, [selector])

    const [fonts, setFonts] = useState([]);
    const [colors, setColors] = useState([]);
    const [variables, setVariables] = useState([]);

    const load = async () => {
        try {
            const resFonts = await ThemeServices.getFonts();
            const resColors = await ThemeServices.getColors();
            const resVariables = await ThemeServices.getVariables();

            if (resFonts.fonts)
                setFonts(resFonts.fonts.data);

            if (resColors.colors)
                setColors(resColors.colors.data);

            if (resVariables.variables)
                setVariables(resVariables.variables.data)

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {
        load();
    }, []);

    function renderSearchableSelector() {
        return (
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
            </div>
        );
    }

    function renderDeleteSelectorButton() {
        return (
            <Tooltip placement="left" title="Delete Selector">
                <Button
                    size='small'
                    ghost
                    icon={<RiDeleteBin2Line style={{ color: colorError }} />}
                    onClick={handleDeleteSelector}
                > </Button>
            </Tooltip>
        );
    }

    function handleDeleteSelector(e) {
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
    }

    function renderStateAndPseudoSelectors() {
        return (
            <div style={{
                marginTop: 6,
                display: 'flex', gap: 5,
                alignItems: 'end',
                justifyContent: 'space-between'
            }}>
                <div>{!animation && <><span style={{ marginRight: 2 }}><State state={elementState} onSelectState={onSelectState} /></span>
                    <Pseudo state={elementState} onSelectState={onSelectState} /></>}</div>
            </div>
        );
    }

    function renderResetStyleButton() {
        return (
            <Tooltip placement="left" title="Reset Current Style">
                <Button
                    ghost
                    size='small'
                    icon={<RiRestartLine style={{ color: colorWarning }} />}
                    onClick={handleResetStyle}
                > </Button>
            </Tooltip>
        );
    }

    function handleResetStyle(e) {
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
    }

    function renderCollapse() {
        return (
            <Collapse
                style={{
                    maxHeight: '100%',
                    overflow: 'hidden',
                    backgroundColor: colorBgElevated,
                }}
                onChange={handleMenuOpenChange}
                accordion
            >
                {renderPanels()}
            </Collapse>
        );
    }

    function renderPanels() {
        return (
            <>
                {renderPanel('1', 'Typography', Typography)}
                {renderPanel('2', 'Size', Size)}
                {renderPanel('3', 'Space', Spacing)}
                {renderPanel('4', 'Border', Border)}
                {renderPanel('5', 'Background', Background)}
                {renderPanel('6', 'Position', Position)}
                {renderPanel('7', 'Display', Display)}
                {renderPanel('8', 'Shadow', Shadow)}
                {renderPanel('9', 'Transform', Transform)}
                {renderPanel('10', 'Transition', Transition)}
                {keys.includes('11') && !animation && renderPanel('11', 'Animation', Animation)}
                {renderPanel('12', 'Filter', Filter)}
                {renderPanel('13', 'Svg', Svg)}
                {renderPanel('14', 'List', List)}
                {renderPanel('15', 'Cursor', Cursor)}
            </>
        );
    }

    function renderPanel(key, header, Component) {
        if (keys.includes(key)) {
            return (
                <Panel showArrow={false}
                    header={header}
                    key={key}
                    className='style-item-panel'
                >
                    <Component style={selector?.style}
                        fonts={fonts} colors={colors} variables={variables}
                        properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>
            );
        }
    }


    return <>
        <Sider width={width} style={{
            borderRadius: 10,
            paddingBottom: 10
        }}>
            <div style={{ padding: 5 }}>
                {renderSearchableSelector()}
                {renderDeleteSelectorButton()}
                {renderStateAndPseudoSelectors()}
                {renderResetStyleButton()}
            </div>

            <div style={{ maxHeight: '65vh', overflow: 'auto', padding: 5 }}>
                {renderCollapse()}
            </div>
            {children}
        </Sider>
    </>
}

