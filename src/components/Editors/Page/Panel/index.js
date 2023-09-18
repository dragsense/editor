import { EdtitorLeftSideBar } from "../SideBar";
import { EditorRightSideBar } from "../SideBar";

// Function to render the left panel component
export function LeftPanelComponent() {

    return <EdtitorLeftSideBar />

};

// Function to render the right panel component
// It takes several props and passes them to the EditorRightSideBar component
export function RightPanelComponent(props) {

    return <EditorRightSideBar {...props} />

};

// Function to switch components based on the active prop
// It filters the children props and returns the child with the matching index
export default function SwitchComponents({ active, children }) {

    // Using memoization to improve performance by avoiding unnecessary re-renders
    const filteredChildren = React.useMemo(() => children.filter(child => child.props.index === active), [active, children]);

    return filteredChildren;
}