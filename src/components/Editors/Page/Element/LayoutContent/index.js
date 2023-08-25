import React, { useState } from 'react';
import Menu from './Menu';
import Component from './Component';
import { Divider } from 'antd';

function LayoutContent({ children, state, onUpdate }) {

  const layout = state.node.layout;
  const name = state.node.name;
  const type = state.node.type;

  return layout === 'menu' ? (<>
    <h4 style={{textAlign:'center'}}>Menu</h4>
    <Divider></Divider>
    <Menu onSave={(menus) => onUpdate("menu", menus)} node={state.node} pages={[]}>{children}</Menu>
    </>
  ) :
  
        layout === 'component' || type === 'component' ? (
          <Component
            onSave={(states) => onUpdate("element", states)}
            states={state.node.states}
            skippedProperties={['currentIndex', 'total', 'items', 'activeItem', 'openModal', 'openSider', 'openDropdown']}
          >
            {children}</Component>
        ) :
          <div style={{padding: 16}}> <span>Please Select the component</span></div>

}

export default LayoutContent;