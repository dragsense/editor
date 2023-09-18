// Importing necessary libraries and components
import React, { useEffect, useState, useCallback } from 'react';
import { getAllData, getData } from '../../../../../../lib/db';
import { Card, Checkbox, Divider, Popconfirm, Radio, theme } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

// InlineSkeleton component for loading state
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

// Toolbar component for handling copy and delete actions
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

// TreeNode component for rendering each node in the tree
function TreeNode(props) {
  let {
    _uid,
    pos,
    _id,
    pageUpdated,
    onMove,
    onAdd } = props;

  const {
    token: { colorPrimaryBg },
  } = theme.useToken();

  const [children, setChildren] = useState([]);
  const [node, setNode] = useState({});

  // Fetch node data from the database
  const fetchNode = useCallback(async () => {
    if (!_id || !_uid)
      return;

    const newNode = await getData(_id, _uid);
    if (newNode) {
      setNode({ _uid: newNode._uid, name: newNode.name, tagName: newNode.tagName, page: node.page });

      if (newNode.page)
        return;

      setChildren([...newNode.childNodes])
    }
  }, [_id, _uid]);

  // Fetch node data on component mount
  useEffect(() => {
    fetchNode();
  }, [fetchNode]);

  // Fetch node data when pageUpdated changes
  useEffect(() => {
    let checkIds = false;
    if (Array.isArray(pageUpdated.newIds)) {
      if (pageUpdated.newIds.includes(_uid))
        checkIds = true;
    }
    if (!checkIds && pageUpdated.parentId !== _uid && pageUpdated?.currentId !== _uid) return;
    fetchNode();
  }, [pageUpdated, fetchNode]);

  // Handle drop event on menu item
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

  // Handle drag over event on menu item
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
        <Radio style={{ marginRight: 5 }} value={_uid} key={_uid}>
          <div className="tree-node-text" style={{ flex: 1, pointerEvents: 'none' }}>
            {node.name || node.tagName}
          </div>
        </Radio>
      </summary> : <InlineSkeleton />}
      <div className='ac-nav-tree-item'>
        {children.map((key, i) => <MemoizedTreeNode
          {...props}
          pos={pos + i}
          pageUpdated={pageUpdated}
          pageType={""}
          _uid={key}
          _id={_id}
          key={key}
        />)}
      </div>
    </details>
  </>;
}

// Memoize TreeNode to prevent unnecessary re-renders
const MemoizedTreeNode = React.memo(TreeNode, (prevProps, nextProps) => {
  const pattern = new RegExp(prevProps.pos);
  const matched1 = pattern.test(nextProps.pageUpdated?.pos);
  const matched2 = pattern.test(nextProps.pageUpdated?.dragPos);
  const allUpdate = prevProps.pageUpdated?.allUpdate === nextProps.pageUpdated?.allUpdate;
  //const currentNode = prevProps.currentNode === nextProps.currentNode;

  return !matched1 && !matched2 && allUpdate;
});

// Elements component for rendering the tree
export default function Elements({ pageUpdated, _id,
  node,
  onClickElement, onMove, onDelete, onCopy, onAdd }) {

  const [pageType, setType] = useState(null);
  const [currentNode, setCurrentNode] = useState(node?._uid);

  // Update currentNode when node changes
  useEffect(() => {
    setCurrentNode(node?._uid);
  }, [node?._uid])

  // Fetch node data when _id changes
  useEffect(() => {
    const fetchNode = async () => {
      if (!_id)
        return;

      const page = await getAllData(_id);
      setType(page?.type || 'page');
    }
    fetchNode();
  }, [_id]);

  const {
    token: { colorError },
  } = theme.useToken();

  return <>
    {pageType && <div style={{ maxHeight: '74vh', overflow: 'auto', borderRadius: 10 }}>
      <Card style={{ width: 'fit-content', minWidth: '100%' }}>
      {currentNode && <Divider>
            <div style={{ textAlign: 'right', zIndex: 100 }}>
              <Toolbar
                key={currentNode}
                id={currentNode}
                pos={node?.node.dataset?.pos}
                onCopy={onCopy}
                onDelete={onDelete}
                colorError={colorError} />
            </div>
            </Divider>}
        <Radio.Group value={currentNode} onChange={(e) => {
          if (node?._uid !== e.target.value) {
            onClickElement(null, e.target.value)
            setCurrentNode(e.target.value)
          }
        }
        }>
          <div className='ac-nav-tree-item' style={{ marginLeft: 0 }}>
            <MemoizedTreeNode
              pageUpdated={pageUpdated}
              pageType={pageType}
              onAdd={onAdd}
              onMove={onMove}
              currentNode={currentNode}
              pos={""}
              _id={_id}
              _uid={"0"} /></div> </Radio.Group></Card> </div>}</>
}