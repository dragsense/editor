

import { Tree, Button, Input, theme, Popconfirm, Tooltip } from 'antd';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getData, PAGE_STORE_NAME, openDB } from '../../../../../../lib/db';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

import { debounce } from '../../../../../../lib/utils'

const { Search } = Input;


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
        <Button size='small' type="text" ghost ><CopyOutlined /></Button> </Popconfirm>

      <Popconfirm
        title="Delete the Menu Item"
        description="Are you sure to delete this Item?"
        onConfirm={() => { onDelete({ dataset: { id: id, pos: pos } }); }}
        onCancel={() => { }}
        okText="Yes"
        cancelText="No"
      >

        <Button size='small' type="text" ghost><DeleteOutlined style={{ color: colorError }} /></Button>

      </Popconfirm>

    </div>
  );
}

const Navigator = ({ onClickElement, onCopy, onDelete, state }) => {

  const [treeData, setTreeData] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const treeRef = useRef();

  const {
    token: { colorText, colorPrimary, colorError },
  } = theme.useToken();

  const fetchData = async () => {
    const rootNode = await getData(state.page._id, '0');
    if (rootNode) setTreeData({ [rootNode._uid]: rootNode });
  };

  useEffect(() => {
  
    if(state.pageUpdated === 1)
    fetchData();
  }, [state.pageUpdated]);



  useEffect(() => {
    if (!state.node) return;

    const autoSelect = async () => {
      setSearchValue(state.node.name || state.node.tagName);
      setSelectedKeys([state.node._uid]);
    }

    autoSelect();
  }, [state.node]);


  const loadData = async (treeNode) => {



    const { childNodes } = treeNode;

    const elements = {};
    const loadedNodes = await Promise.all(childNodes.filter(async (_uid) => _uid !== '0'));

    for (const _uid of loadedNodes) {
      const item = await getData(state.page._id, _uid);

      if (item) {
        elements[_uid] = item;
      }
    }

    setTreeData({ ...treeData, ...elements });
  };

  const unloadData = (key, rootKey) => {
    if (treeData[key] && treeData[key].childNodes) {
      treeData[key].childNodes.forEach((_uid) => unloadData(_uid, rootKey));
    }
    if (key !== rootKey) delete treeData[key];
  };

  const onExpand = useCallback(async (keys, { expanded, node }) => {

    const key = node.key;
    if (expanded) {
      await loadData(treeData[key]);
    } else {
      unloadData(key, key);
      setTreeData({ ...treeData });
    }
    setExpandedKeys(keys);
  }, [treeData]);

  const searchData = useCallback(async (searchText = "", limit = 25, STORE = PAGE_STORE_NAME) => {
    return await new Promise(async (resolve, reject) => {
      const db = await openDB();
      const store = db.transaction(STORE).objectStore(STORE);

      const index = store.index('id');


      const request = index.get(state.page._id);

      let results = [];
      let count = 0;
      let lastResult = null;

      const handleResult = event => {

        const data = event.target.result;
        let results = [];


        if (data) {
          results = Object.values(data.elements).filter(res => {

            const title = res.name || res.tagName;

            if (!title)
              return;

            return title.includes(searchText);
          });
        }

        resolve(results);
      };

      const handleError = event => {
        reject(event.target.error);
      };

      request.onsuccess = handleResult;
      request.onerror = handleError;


    })
  }, [state.page]);

  const onChange = useCallback(
    debounce(async (e) => {
      const value = e.target.value;
      setSearchValue(value);
    }, 500),
    []
  );

  useEffect(() => {


    if (!searchValue) {
      setTreeData({ ...treeData });
      return;
    }


    const fetchData = async () => {
      const results = await searchData(searchValue);

      const expandedKeys = await Promise.all(results.map(async item => {
        treeData[item._uid] = item;
        const parent = treeData[item.parent];
        if (!parent) {
          const node = await getData(state.page._id, item.parent);
          if (node)
            treeData[node._uid] = node;
        }
        return item.parent || '0';

      }).filter((item, i, self) => item && self.indexOf(item) === i));

      setExpandedKeys(expandedKeys);
      setAutoExpandParent(true);
      setTreeData({ ...treeData })
    }
    fetchData();

    return () => {

    }

  }, [searchValue]);

  const loop = useCallback((nodes, pos) =>
    nodes.map((key, i) => {
      const item = treeData[key];

      if (!item)
        return {};

      const { _uid, tagName, name, childNodes } = item;

      const tagTitle = name || tagName;
      const searchText = searchValue || '';
      const index = tagTitle.indexOf(searchText);
      const beforeStr = tagTitle.substr(0, index);
      const afterStr = tagTitle.substr(index + searchText.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: colorText }}>{searchText}</span>
            {afterStr}
          </span>
        ) : (
          <span>{tagTitle}</span>
        );

      if (childNodes && childNodes.length > 0) {
        return {
          title,
          pos: pos + (key != 0 ? i : ""),
          key: _uid,
          childNodes: childNodes,
          children: loop(
            childNodes.filter(_uid => {
              if (_uid !== '0') {
                return _uid;
              }
            }
            ), pos + (key != 0 ? i : ""))
        }
      }
      return {
        title,
        pos: pos + i,
        key: _uid,
        childNodes: [],
        isLeaf: true,
      };
    }));




  const rootNode = ["0"];

  const treeNodes = useMemo(() => loop(rootNode, ""), [treeData]);

  const onSelect = useCallback((keys, { node }) => {
    setSelectedKeys(keys);
    onClickElement && onClickElement(null, node.key);

  }, [onClickElement]);

  const title = (item) => <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}
  > <span style={{ color: colorPrimary }}>{item.title}</span>

    {selectedKeys == item.key &&
      <div onClick={(event) => event.stopPropagation()}>
        <Toolbar
          key={item.key}

          id={item.key}
          pos={item.pos}
          onCopy={onCopy}
          onDelete={onDelete}
          colorError={colorError} /> </div>}
  </div>

  const renderTreeNodes = (data) => {
    return data.map((item, index) => {

      if (item.children) {
        return (
          <Tree.TreeNode itemPos={item.pos} title={title(item)} key={item.key}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          itemPos={item.pos}
          title={title(item)}
          key={item.key} isLeaf />

      );
    });
  };



  return (
    <div style={{ position: 'relative' }}>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Tree
        ref={treeRef}
        selectable={false}
        blockNode
        checkable
        checkStrictly
        checkedKeys={selectedKeys}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onCheck={onSelect}
        autoExpandParent={autoExpandParent}
        style={{ padding: 5 }}

      >
        {renderTreeNodes(treeNodes)}
      </Tree>

    </div>
  );
};


export default Navigator;