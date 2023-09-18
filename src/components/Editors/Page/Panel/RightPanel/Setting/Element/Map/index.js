import { useEffect, useState } from "react";
import { Cascader } from "antd";

// Function to filter cascader states
const filterCascaderStates = (cascaderStates) => {
  return cascaderStates
    .filter(state => ['Menu', 'Flex', 'Modal', 'GoToTop', 'Tabs', 'Observable', 'Accordion', 'Slider', 'Gallery', 'Dropdown', 'Grid', 'Container', 'Sider', 'STATES', 'PROPS', 'PAGE', 'COLLECTION'].includes(state.type))
    .map(state => ({
      ...state,
      children: state.children
        .filter(childState => ['array', 'arraylength', 'images'].includes(childState.type))
        .map(childState => ({
          ...childState,
          children: childState.children?.filter(childState => ['relations'].includes(childState.type))
          .map(childState => ({
            ...childState,
            children: null
          }))
        }))
    }));
}

// Function to handle change in keys
const handleChangeInKeys = (keys, state, setState, setIsChange) => {
  if (keys === undefined || keys[0] === undefined) {
    setState({ ...state, map: undefined });
  } else {
    const value = [...keys];
    const map = state.map ?? {};
    map.type = value[0];
    value.shift();
    map.key = value;
    setState({ ...state, map });
  }
  setIsChange(true);
}

export default function ElementMapping({ cascaderStates, state, setState, setIsChange }) {
  const [currentMap, setCurrentMap] = useState([]);

  useEffect(() => {
    if (!cascaderStates) return;
    // Filter cascader states on component mount or update
    setCurrentMap(filterCascaderStates(cascaderStates));
  }, [cascaderStates]);

  return <>
    <Cascader style={{ width: '100%' }} options={currentMap}
      value={state.map
        ?
        [state.map.type, ...(Array.isArray(state.map.key) ?
          state.map.key : [])] : [undefined]}
      onChange={(keys) => handleChangeInKeys(keys, state, setState, setIsChange)}>
    </Cascader>
  </>
}
