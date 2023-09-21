import React, { useEffect, useState, useCallback, memo } from 'react';
import { getAllData, getData } from '../../../../lib/db';
import ElementWrapper from './ElementWrapper';
import SettingServices from '../../../../lib/services/setting';

// Skeleton component for loading
export const InlineSkeleton = () => (
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

// Component for rendering a tree node
const TreeNode = (props) => {

  const { _uid, _id, pageType } = props;

  const [children, setChildren] = useState([]);
  const [node, setNode] = useState({});

  // Function to fetch node data
  const fetchNode = useCallback(async () => {
    if (!_id || !_uid) return;
    const newNode = await getData(_id, _uid);
    if (newNode) {
      setNode(newNode);
      setChildren(newNode.childNodes ? [...newNode.childNodes] : []);
    }
  }, [_id, _uid]);

  useEffect(() => {
    fetchNode();
  }, [fetchNode]);


  const component = node.page?.pageType === 'component' ? node.page : null;
  const rootComponent = pageType === 'component' ? { _id } : null;
  const form = node.page?.pageType === 'form' ? node.page : null;
  const rootForm = pageType === 'form' ? { _id } : null;




  return (
    <ElementWrapper
      key={_uid}
      {...props}
      component={rootComponent || component}
      customPath={node.customPath}
      form={rootForm || form}
      node={node}
    >
      {children.map((key, i) => (
        <MemoizedTreeNode
          {...props}
          _uid={key}
          pageType={""}
          key={key}
        />
      ))}
    </ElementWrapper>
  );
};

// Memoized TreeNode for performance optimization
const MemoizedTreeNode = memo(TreeNode, (prevProps, nextProps) => {
  const states =
    prevProps._states === nextProps._states &&
    prevProps._props === nextProps._props &&
    prevProps.colStates === nextProps.colStates &&
    prevProps.fun === nextProps.fun &&
    prevProps._cstates === nextProps._cstates;
  const allUpdate = prevProps.pageUpdated?.allUpdate === nextProps.pageUpdated?.allUpdate;

  return  states && allUpdate;
});

// Main Elements component
export default function Elements({  _id }) {
  const [setting, setSetting] = useState(null);
  const [pageType, setType] = useState(null);

  // Function to fetch node data
  const fetchNode = useCallback(async () => {
    if (!_id) return;
    const page = await getAllData(_id);
    if (page) {
      setType(page.type);
     
      let populatedRelationships = null;
      let relationships = null;

      if (page.type === 'collection') {
        if (page.populatedRelationships) {
          relationships = page.populatedRelationships.reduce((result, rel) => {
            result[rel._id] = rel.name;
            return result;
          }, {});

          populatedRelationships = page.populatedRelationships?.reduce((acc, collection) => {
            acc[collection._id] = [collection];
            return acc;
          }, {});
        }
    
      }



      const res = await SettingServices.get();
      const data = {
        _id: page._id,
        slug: page.slug,
        name: page.name,
        url: page.url,
        createdAt: page.createdAt,
        creator: page.creator,
        states: page.states,
        populatedRelationships,
        relationships,
        host: page.host || '',
        ...({ setting: page.setting } || {}),
        global: { ...res.setting },
      };
      setSetting(data);
    }
  }, [_id]);

  useEffect(() => {
    fetchNode();
  }, [fetchNode]);



  return (
    <>
      {setting && (
        <MemoizedTreeNode
          pageType={pageType}
          setting={setting}
          _id={_id}
          _uid={'0'}
        />
      )}
    </>
  );
}