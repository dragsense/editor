
import { Button, Divider, Card } from 'antd';

import Style from './Style';

export default function Styling({
    state,
    menuKeys,
    onSelectSelector,
    onDeleteSelector,
    onResetSelector,
    onChangeStyle,
    onUpdateSelector
 }) {





    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

            <><Style
                onResetSelector={onResetSelector}
                onDeleteSelector={onDeleteSelector}
                onUpdateSelector={onUpdateSelector}
                onChange={onChangeStyle}
                menuKeys={menuKeys}
                state={state}
                onSelectSelector={onSelectSelector} /></>
     

    </>
        : <span>Please Select the node</span>
}