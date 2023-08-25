
import attributes from './attributesList.json'
import List from './List'


export default function ElementAttribute({ cascaderStates, state, setState, setIsChange }) {

  return <List
    label={"Attribute"}
    _attributes={attributes}
    cascaderStates={cascaderStates}
    state={state}
    setState={setState}
    setIsChange={setIsChange}
  />



}

