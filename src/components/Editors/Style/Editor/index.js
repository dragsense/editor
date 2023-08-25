import React, { useState } from 'react';

import { Layout, Button } from 'antd';



import LeftSideBar from './LeftSideBar';
import RigthSideBar from './RightSideBar';


const { Content } = Layout;


export default function StyleEditor({
    state,
    onEdit,
    onDelete,
    onSubmit,
    onChange,
    onSelect,
    isChange,
    children }) {




    return <Layout style={{ minHeight: '80vh' }}>



        <LeftSideBar
            onEdit={onEdit} elementType={state.elementType} />
        <Content style={{ position: 'relative', flex: 1, minxWidth: 'calc(100% - 430px)' }}>

            {children}
        </Content>

        {state.elementType !== 'default' && <RigthSideBar
            state={state}
            onSelect={onSelect}
            onDelete={onDelete}
            onChange={onChange}
            onSubmit={onSubmit}
            width={271}
        >
            <div style={{ textAlign: 'right', marginTop: 10, padding: 10 }}>
                <Button type="primary" onClick={(e) => {
                    e.preventDefault();
                    onSubmit(state.selector);
                }

                } loading={state.loading} disabled={!isChange}> Update </Button>
            </div>
        </RigthSideBar>}


    </Layout>


}

