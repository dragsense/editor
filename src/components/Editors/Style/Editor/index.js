import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';

// Destructuring Content from Layout
const { Content } = Layout;

// StyleEditor component
// It receives several props including state, onEdit, onDelete, onSubmit, onChange, onSelect, isChange, children
export default function StyleEditor({
    state,
    onEdit,
    onDelete,
    onSubmit,
    onChange,
    onSelect,
    isChange,
    children,
    isConverted }) {

    // Render Layout with minimum height of 80vh
    return <Layout style={{ minHeight: '80vh' }}>

        {/* Render LeftSideBar with onEdit and elementType props */}
        <LeftSideBar
            onEdit={onEdit} 
            elementType={state.elementType} />

        {/* Render Content with relative position and flexible width */}
        <Content style={{ position: 'relative', flex: 1, minWidth: 'calc(100% - 430px)' }}>

            {/* Render children inside Content */}
            {children}
        </Content>

        {/* Render RightSideBar if elementType is not default */}
        {state.elementType !== 'default' && <RightSideBar
            state={state}
            onSelect={onSelect}
            onDelete={onDelete}
            onChange={onChange}
            onSubmit={onSubmit}
            width={271}
            isConverted={isConverted}
        >
            {/* Render Button inside RightSideBar */}
            <div style={{ textAlign: 'right', marginTop: 10, padding: 10 }}>
                <Button type="primary" onClick={(e) => {
                    e.preventDefault();
                    // Call onSubmit with state.selector when button is clicked
                    onSubmit(state.selector);
                }

                } loading={state.loading} disabled={!isChange}> Update </Button>
            </div>
        </RightSideBar>}

    </Layout>

}

