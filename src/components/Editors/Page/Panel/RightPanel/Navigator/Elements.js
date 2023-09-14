

import React, { useEffect, useState } from 'react';
import { getAllData, getData } from '../../../../../../lib/db';
import { Button, Card, Checkbox, Popconfirm, Radio, theme } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
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



function Toolbar({ id, pos, colorError, onDelete, onCopy }) {
  return (
    <div>

      <Popconfirm
        placement="topRight"
        title={"Please select?"}
        onConfirm={() => {
          onCopy({ dataset: { targetId: id, id: id, pos: pos } }, false);

        }}
        onCancel={() => {
          onCopy({ dataset: { targetId: id, id: id, pos: pos } }, true);

        }}
        okText="Copy Selector"
        cancelText="Create Selector"
      >
        <CopyOutlined /></Popconfirm>
      {" "}
      <Popconfirm
        title="Delete the Menu Item"
        description="Are you sure to delete this Item?"
        onConfirm={() => { onDelete({ dataset: { id: id, pos: pos } }); }}
        onCancel={() => { }}
        okText="Yes"
        cancelText="No"
      >

        <DeleteOutlined style={{ color: colorError }} />

      </Popconfirm>

    </div>
  );
}

function TreeNode(props) {


  let {
    _uid,
    pos,
    _id,
    pageUpdated,
    onMove,
    currentNode,
    setCurrentNode,
    onAdd, onDelete, onCopy, onClickElement } = props;
    

  const {
    token: { colorText, colorPrimary, colorError, colorPrimaryBg },
  } = theme.useToken();


  const [children, setChildren] = useState([]);
  const [node, setNode] = useState({});

  const fetchNode = async () => {

    if (!_id || !_uid)
      return;

    const newNode = await getData(_id, _uid);
    if (newNode) {

      setNode({ _uid: newNode._uid, name: newNode.name, tagName: newNode.tagName, page: node.page });

      if(newNode.page)
      return;

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
              onCopy={onCopy}
              onDelete={onDelete}
              onMove={onMove}
              onAdd={onAdd}
              onClickElement={onClickElement}
              currentNode={currentNode}
              setCurrentNode={setCurrentNode}
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

 

  const handleMenuItemDrop = (event, isTop) => {

    event.preventDefault();


    var currentElement = event.target;

    const id = currentElement.dataset?.uid;
    const pos = currentElement.dataset?.pos;



    if (!id || (id === '0' && isTop)) {
      currentElement.style.backgroundColor = 'transparent';
      return;
    }


    try {
      const tag = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (tag.move)
        onMove(id, tag._uid, isTop, pos, tag.dragPos, null);
      else
        onAdd(tag, id, isTop, pos, null);
    } catch (e) {
      currentElement.style.backgroundColor = 'transparent';

    }
    currentElement.style.backgroundColor = 'transparent';


  };


  const handleMenuItemDragOver = (e) => {
    e.preventDefault();

  };



  return <>
    <div

      onDragOver={handleMenuItemDragOver}

      onDragEnter={(e) => {
        e.target.style.backgroundColor = '#2fc1ff';
        e.preventDefault();

      }}
      onDragLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.preventDefault();

      }}
      style={{
        borderRadius: '5px',
        height: 3,
      }}
      onDrop={(e) => handleMenuItemDrop(e, true)}
      data-uid={_uid}
      data-pos={pos}
    >

    </div>
    <details key={_uid}>
      {node.tagName ? <summary
        style={currentNode === _uid ? { fontWeight: 600, color: '#f88a24' } : {}}
        onDrop={(e) => handleMenuItemDrop(e, false)}
        data-uid={_uid}
        data-pos={pos}
        onDragOver={handleMenuItemDragOver}

        onDragEnter={(e) => {
          e.currentTarget.style.backgroundColor = colorPrimaryBg;
          e.currentTarget.parentElement.setAttribute('open', 'true');

          e.preventDefault();

        }}
        onDragLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.preventDefault();
          e.currentTarget.parentElement.setAttribute('open', 'close');


        }}
      >
        <Radio style={{ marginRight: 5 }} onClick={(e) => {
          try {
            e.stopPropagation();
            if (_uid !== currentNode) {
              onClickElement(null, _uid);
              setCurrentNode(_uid);
            }
          } catch (e) {

          }

        }} checked={currentNode === _uid} />

        <div className="tree-node-text" style={{ flex: 1, pointerEvents: 'none' }}>
          {node.name || node.tagName}
        </div>

        {currentNode === _uid &&
          <div style={{ textAlign: 'right', width: 70, zIndex: 0 }} >
            <Toolbar
              key={_uid}
              id={_uid}
              pos={pos}
              onCopy={onCopy}
              onDelete={onDelete}
              colorError={colorError} /> </div>}

      </summary> : <InlineSkeleton />}

      <div className='ac-nav-tree-item'
      >
        {children.map((child, i) => React.cloneElement(child, {
          _id,
          pos: pos + i,
          pageUpdated,
          currentNode,
        }))}
      </div>
    </details>
  </>;
}
const MemoizedTreeNode = React.memo(TreeNode, (prevProps, nextProps) => {
  const pattern = new RegExp(prevProps.pos);
  const matched1 = pattern.test(nextProps.pageUpdated?.pos);
  const matched2 = pattern.test(nextProps.pageUpdated?.dragPos);
  const allUpdate = prevProps.pageUpdated?.allUpdate === nextProps.pageUpdated?.allUpdate;
  const currentNode = prevProps.currentNode === nextProps.currentNode;

  return !matched1 && !matched2 && allUpdate && currentNode;
});


export default function Elements({ pageUpdated, _id,
  node,
  onClickElement, onMove, onDelete, onCopy, onAdd }) {

  const [pageType, setType] = useState(null);

  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {

    setCurrentNode(node?._uid);
  }, [node?._uid])

  useEffect(() => {

    const fetchNode = async () => {

      if (!_id)
        return;

      const page = await getAllData(_id);
      if (page)
        setType(page.type);
    }


    fetchNode();
  }, [_id]);

  return <>
    {pageType && <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
      <Card> <div className='ac-nav-tree-item' style={{ marginLeft: 0 }}><MemoizedTreeNode
        pageUpdated={pageUpdated}
        pageType={pageType}
        onAdd={onAdd}
        onMove={onMove}
        setCurrentNode={setCurrentNode}
        currentNode={currentNode}
        onDelete={onDelete}
        onClickElement={onClickElement}
        onCopy={onCopy}
        pos={""}
        _id={_id}
        _uid={"0"} /></div></Card></div>}</>
}