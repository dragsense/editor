

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { getAllData, getData } from '../../../../lib/db';
import ElementWrapper from './ElementWrapper';

import SettingServices from '../../../../lib/services/setting';
import { generateCascader } from '../../../../lib/element/elementNode';

export function InlineSkeleton() {
  return (
    <div
      style={{
        height: '1em',
        margin: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: '0.25em',
        animation: ' ac-001-pulse 1s infinite ease-in-out',
      }}
    />
  );
}

function TreeNode(props) {


  let { _uid, pos, _id, pageUpdated, _states, _props, colStates, _cstates, pageType } = props;



  const [children, setChildren] = useState([]);
  const [node, setNode] = useState({});

  const fetchNode = async () => {

    if (!_id || !_uid)
      return;

    const newNode = await getData(_id, _uid);
    if (newNode) {

      setNode(newNode);

      const unloadedNodes = newNode.childNodes.filter((key, i) => {
        return !children.some((child) => {
          const index = children.indexOf(child);
          return child.props._uid === key && index == i;
        });
      });

      const deletedNodes = children.filter((child) => {
        return !newNode.childNodes.includes(child.props._uid);
      });

      setChildren((prevChildren) => {
        const updatedChildren = prevChildren.filter((child) => !deletedNodes.includes(child));

        unloadedNodes.forEach((key, i) => {
          const index = newNode.childNodes.indexOf(key);
          const childNode = (
            <MemoizedTreeNode
              {...props}
              pageUpdated={{ ...pageUpdated, pos: pos + i }}
              pageType={""}
              _uid={key}
              _id={_id}
              key={key}
            />
          );

          updatedChildren[index] = childNode;
        });

        return updatedChildren;
      });


    }




  }

  useEffect(() => {
    fetchNode();
  }, []);

  useEffect(() => {

    let checkIds = false;

    if (Array.isArray(pageUpdated.newIds)) {
      if (pageUpdated.newIds.includes(_uid))
        checkIds = true;
    }

    if (!checkIds && pageUpdated.parentId !== _uid && pageUpdated?.currentId !== _uid) return;



    fetchNode();
 
  }, [pageUpdated]);

  const component = node.page?.pageType === 'component' ? { ...node.page, disabled: true } : null;
  const rootComponent = pageType === 'component' ? { _id } : null;

  const form = node.page?.pageType === 'form' ? { ...node.page, disabled: true } : null;
  const rootForm = pageType === 'form' ? { _id } : null;


  return (<ElementWrapper key={_uid}
    {...props}
    component={rootComponent || component}
    customPath={node.customPath}
    form={rootForm || form}
    pos={pos}
    _id={_id}
    colStates={colStates}
    _states={_states}
    _props={_props}
    node={node}>
    {children.map((child, i) => React.cloneElement(child, {
      pos: pos + i,
      _states,
      _cstates,
      _props,
      colStates,
      pageUpdated
    }))}
  </ElementWrapper>);
}
const MemoizedTreeNode = React.memo(TreeNode, (prevProps, nextProps) => {
  const pattern = new RegExp(prevProps.pos);
  const matched1 = pattern.test(nextProps.pageUpdated?.pos);

  const matched2 = pattern.test(nextProps.pageUpdated?.dragPos);
  const states = prevProps._states === nextProps._states &&
    prevProps._props === nextProps._props &&
    prevProps.colStates === nextProps.colStates &&
    prevProps._cstates === nextProps._cstates;

  const allUpdate = prevProps.pageUpdated?.allUpdate === nextProps.pageUpdated?.allUpdate;

  return !matched1 && !matched2 && states && allUpdate;
});


export default function Elements({ pageUpdated, _id, onUpdateStates }) {

  const [setting, setSetting] = useState(null);
  const [pageType, setType] = useState(null);


  useEffect(() => {

    const fetchNode = async () => {

      if (!_id)
        return;

      const page = await getAllData(_id);
      if (page) {
        setType(page.type);

    
        const res = await SettingServices.get();
        const data = { name: page.name, url: page.url, createdAt: page.createdAt, creator: page.creator,
           ...(page.setting || {}), global: { ...res.setting } };
        setSetting(data)
      }

    }

    fetchNode();
  }, [_id]);

  return setting && <MemoizedTreeNode
    pageUpdated={pageUpdated}
    onUpdateStates={onUpdateStates}
    pageType={pageType}
    pos={""}
    setting={setting}
    _id={_id}
    _uid={"0"} />
}