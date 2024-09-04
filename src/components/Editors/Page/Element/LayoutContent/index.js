import React, { useState, useMemo } from 'react';
import Menu from './Menu';
import Component from './Component';
import { Card, Divider } from 'antd';

// LayoutContent component for handling layout related operations
function LayoutContent({ children, state, onUpdate }) {


  // Destructure the layout, name, and type from the state.node
  const { layout, name, type } = state.node;

  // useMemo to avoid unnecessary re-renders and improve performance
  const menuLayout = <>
      <h4 style={{ textAlign: 'center' }}>Menu</h4>
      <Divider></Divider>
      <Menu onSave={(menus) => onUpdate("menu-list", menus)} node={state.node} pages={[]}>{children}</Menu>
    </>
  

  const componentLayout = <Component
      onSave={(states) => onUpdate("element", states)}
      states={state.node.states}
      skippedProperties={['currentIndex', 'total', 'items', 
      'upatedTopValue', 'upatedLeftValue', 
      'updatedVisibleValue',
      'visibleY', 'visibleX',
       'activeItem', 'openModal', 'openSider', 'openDropdown']}
    >
      {children}
    </Component>


  // Render based on the layout type
  return layout === 'menu-list' ? menuLayout :
    layout === 'component' || type === 'component' ? componentLayout :
       <span>Please Select the component</span>

}

export default LayoutContent;