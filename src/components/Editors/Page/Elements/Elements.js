import React, { useEffect, useState, useCallback, memo } from 'react';
import { getAllData, getData } from '../../../../lib/db';
import ElementWrapper from './ElementWrapper';
import SettingServices from '../../../../lib/services/setting';
import { generateCascader, defaultDoc, pageSetting, generateCascadeRelationsStates } from '../../../../lib/element/elementNode';

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

  const { _uid, pos, _id, pageUpdated, pageType } = props;

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

  useEffect(() => {
    const checkIds = Array.isArray(pageUpdated.newIds) && pageUpdated.newIds.includes(_uid);
    if (!checkIds && pageUpdated.parentId !== _uid && pageUpdated?.currentId !== _uid) return;
    fetchNode();
  }, [pageUpdated, fetchNode]);

  const component = node.page?.pageType === 'component' ? { ...node.page, disabled: true } : null;
  const rootComponent = pageType === 'component' ? { _id } : null;
  const form = node.page?.pageType === 'form' ? { ...node.page, disabled: true } : null;
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
          pos={pos + i}
          key={key}
        />
      ))}
    </ElementWrapper>
  );
};

// Memoized TreeNode for performance optimization
const MemoizedTreeNode = memo(TreeNode, (prevProps, nextProps) => {
  const pattern = new RegExp(prevProps.pos);
  const matched1 = pattern.test(nextProps.pageUpdated?.pos);
  const matched2 = pattern.test(nextProps.pageUpdated?.dragPos);
  const states =
    prevProps._states === nextProps._states &&
    prevProps._props === nextProps._props &&
    prevProps.colStates === nextProps.colStates &&
    prevProps.fun === nextProps.fun &&
    prevProps._cstates === nextProps._cstates &&
    prevProps.setting?.resize === nextProps.setting?.resize;

  const allUpdate = prevProps.pageUpdated?.allUpdate === nextProps.pageUpdated?.allUpdate;

  return !matched1 && !matched2 && states && allUpdate;
});

// Main Elements component
export default function Elements({ pageUpdated, _id, onUpdateStates }) {
  const [setting, setSetting] = useState(null);
  const [pageType, setType] = useState(null);

  // Function to fetch node data
  const fetchNode = useCallback(async () => {
    if (!_id) return;
    const page = await getAllData(_id);
    if (page) {
      setType(page.type);
      let states = [];
      let populatedRelationships = null;
      let relationships = null;

      if (page.type === 'collection') {
        if (page.states) {
          const cascaderStates = generateCascader(page.states, 'STATES', 'STATES');
          states = [...states, ...cascaderStates];
        }

        if (page.populatedRelationships) {
          const relStates = await generateCascadeRelationsStates(page);
          states = [...states, ...relStates];

          relationships = page.populatedRelationships.reduce((result, rel) => {
            result[rel._id] = rel.name;
            return result;
          }, {});

          populatedRelationships = page.populatedRelationships?.reduce((acc, collection) => {
            acc[collection._id] = [collection];
            return acc;
          }, {});
        }

        states = [
          ...states,
          {
            label: 'NEXTDOCUMNET',
            value: 'NEXTDOCUMNET',
            children: defaultDoc,
          },
          {
            label: 'PREVDOCUMNET',
            value: 'PREVDOCUMNET',
            children: defaultDoc,
          },
        ];
      }

      const pageStates = [
        {
          label: 'PAGE',
          value: 'PAGE',
          type: 'PAGE',
          children: [...pageSetting, ...states],
        },
      ];

      onUpdateStates('PAGESTATES', pageStates, null);

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
        host: res.host || '',
        ...({ setting: page.setting } || {}),
        global: { ...res.setting },
      };
      setSetting(data);
    }
  }, [_id]);




  useEffect(() => {
    fetchNode();
  }, [fetchNode]);

  useEffect(() => {

    if (!setting)
      return;

    const updateSize = () => {
      setSetting({ ...setting, resize: !setting.resize });
    };

    const iframe = document.querySelector("#ac-editor-iframe-doc")
    const contentWindow = iframe.contentWindow;

    if (!contentWindow)
      return;

    contentWindow.addEventListener('resize', updateSize);

    return () => {
      if (contentWindow)
        contentWindow.removeEventListener('resize', updateSize);
    }


  }, [setting]);



  return (
    <>
      {setting && (
        <MemoizedTreeNode
          pageUpdated={pageUpdated}
          onUpdateStates={onUpdateStates}
          pageType={pageType}
          pos={''}
          setting={setting}
          _id={_id}
          _uid={'0'}
        />
      )}
    </>
  );
}