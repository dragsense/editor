import { Select, Button, Tooltip, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md';


const cursorTypes = [
    'auto',
    'default',
    'none',
    'context-menu',
    'help',
    'pointer',
    'progress',
    'wait',
    'cell',
    'crosshair',
    'text',
    'vertical-text',
    'alias',
    'copy',
    'move',
    'no-drop',
    'not-allowed',
    'grab',
    'grabbing',
    'all-scroll',
    'col-resize',
    'row-resize',
    'n-resize',
    'e-resize',
    's-resize',
    'w-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
    'ew-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'zoom-in',
    'zoom-out',
];



export default function Cursor({ style, properties, onChangeStyle }) {
    const [stylePriority, setStylePriority] = useState({
        "cursor": '',
        "pointerEvents": '',
    });

    useEffect(() => {
        if (!properties) {
            return;
        }

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey]) {
                priorities[key] = properties[hyphenatedKey].priority;
            } else {
                priorities[key] = '';
            }
        }

        setStylePriority(priorities);
    }, [properties]);

    const handleCursorChange = (value) => {
        if (!properties["cursor"]) {
            properties["cursor"] = {};
        }
    
        properties['cursor']['value'] = value;

        style.setProperty('cursor', value, stylePriority.cursor);
        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

    const handlePointerEventsChange = () => {
        const pointerEventsValue = (style.pointerEvents === 'auto' || !style.pointerEvents) ? 'none' : 'auto';
        
        if (!properties["pointer-events"]) {
            properties["pointer-events"] = {};
        }
    
        properties['pointer-events']['value'] = pointerEventsValue;

        console.log(pointerEventsValue)

        style.setProperty('pointer-events', pointerEventsValue, stylePriority.pointerEvents);
        onChangeStyle();
        setStylePriority({ ...stylePriority });
    };

    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';

        if (!properties[_name])
            properties[_name] = {};

        properties[_name].priority = priority;

        style.setProperty(_name, style[name], priority);
        setStylePriority({ ...stylePriority, [name]: priority })

        onChangeStyle();
    }

    return (
        style && <>
            <div>
                <div style={{ marginBottom: "10px" }}>
                    <strong>Cursor: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox
                            style={{ marginLeft: 3 }}
                            name='cursor'
                            data-name="cursor"
                            checked={stylePriority.cursor === 'important'}
                            onChange={onChangePriority}
                        >
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties["cursor"]) {
                                    delete properties["cursor"];
                                }
                                onChangeStyle();
                                setStylePriority({ ...stylePriority, "cursor": "" });
                                style.removeProperty('cursor');
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: "100%" }}
                        value={style.cursor || 'none'}
                        onChange={handleCursorChange}
                    >
                        {cursorTypes.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            <div>
                <div style={{ marginBottom: "10px" }}>
                    <strong>Pointer Events: </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox
                            style={{ marginLeft: 3 }}
                            name='pointerEvents'
                            data-name="pointer-events"
                            onChange={onChangePriority}
                            checked={stylePriority.pointerEvents === 'important'}
                        >
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: 'right' }}
                            size='small'
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                if (properties["pointer-events"]) {
                                    delete properties["pointer-events"];
                                }
                                onChangeStyle();
                                setStylePriority({ ...stylePriority, pointerEvents: "" });
                                style.removeProperty('pointer-events');
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Checkbox
                        checked={style.pointerEvents === 'none'}
                        onChange={(e) => handlePointerEventsChange()}
                    >
                        Disable Pointer Events
                    </Checkbox>
                </div>
            </div>
        </>
    );
}