import React, { useState, useMemo } from 'react';
import Menu from './Menu';
import Component from './Component';
import { Divider } from 'antd';

// LayoutContent component for handling layout related operations
function LayoutContent({ children, state, onUpdate }) {

  // Destructure the layout, name, and type from the state.node
  const { layout, name, type } = state.node;

  // useMemo to avoid unnecessary re-renders and improve performance
  const menuLayout = useMemo(() => (
    <>
      <h4 style={{textAlign:'center'}}>Menu</h4>
      <Divider></Divider>
      <Menu onSave={(menus) => onUpdate("menu", menus)} node={state.node} pages={[]}>{children}</Menu>
    </>
  ), [children, state.node, onUpdate]);

  const componentLayout = useMemo(() => (
    <Component
      onSave={(states) => onUpdate("element", states)}
      states={state.node.states}
      skippedProperties={['currentIndex', 'total', 'items', 'activeItem', 'openModal', 'openSider', 'openDropdown']}
    >
      {children}
    </Component>
  ), [children, state.node.states, onUpdate]);

  // Render based on the layout type
  return layout === 'menu' ? menuLayout :
         layout === 'component' || type === 'component' ? componentLayout :
         <div style={{padding: 16}}> <span>Please Select the component</span></div>

}

export default LayoutContent;