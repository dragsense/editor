import { EdtitorLeftSideBar } from "../SideBar";
import { EditorRightSideBar } from "../SideBar";

export function LeftPanelComponent() {

    return <EdtitorLeftSideBar />

};

export function RightPanelComponent({ onClickElement, onChange,
    onDeleteSelector, onUpdateSelector, onSelectSelector, onUpdate,
    onCopy, onDelete, onMove, state, onAdd }) {


    return <EditorRightSideBar
        onUpdate={onUpdate}
        onChange={onChange}
        onDeleteSelector={onDeleteSelector}
        onSelectSelector={onSelectSelector}
        onUpdateSelector={onUpdateSelector}
        onMove={onMove}
        onDelete={onDelete}
        onCopy={onCopy}
        onAdd={onAdd}
        onClickElement={onClickElement}
        state={state} />

};


export default function SwitchComponents({ active, children }) {

    return children.filter(child => child.props.index === active)
}