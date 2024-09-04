import React, { useState, useCallback } from 'react';
import { Tree, Button, Popconfirm, Modal, Form, Popover, Input, message, theme, Select, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined, SaveOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';

const { TreeNode } = Tree;

const MenuTree = ({ node, onSave }) => {
    const {
        token: { colorPrimary, colorError },
    } = theme.useToken();

    const [form] = Form.useForm();
    const [gData, setGData] = useState(node.menus || []);
    const [change, setChange] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [editingNode, setEditingNode] = useState(null);
    const [visiblePopover, setVisiblePopover] = useState(null); // Tracks which popover is visible

    const updateNodeByKey = useCallback((data, key, updates) => {
        return data.map((node) => {
            if (node.key === key) {
                return { ...node, ...updates };
            } else if (node.children) {
                return { ...node, children: updateNodeByKey(node.children, key, updates) };
            }
            return node;
        });
    }, []);

    const updateParentByKey = useCallback((data, key, updates) => {
        return data.map((node) => {
            if (node.key === key) {
                return { ...node, children: [...(node.children || []), updates] };
            } else if (node.children) {
                return { ...node, children: updateParentByKey(node.children, key, updates) };
            }
            return node;
        });
    }, []);

    const findParentChildsByKey = useCallback((data, key) => {
        if (!key) {
            return data;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                return data[i].children || [];
            } else if (data[i].children) {
                const result = findParentChildsByKey(data[i].children, key);
                if (result.length > 0) {
                    return result;
                }
            }
        }
        return [];
    }, []);

    const moveItem = useCallback((node, dropPosition) => {
        const parentChildren = findParentChildsByKey(gData, node.parentKey);
        const dragIndex = parentChildren.findIndex(item => item.key === node.key);

        if (dragIndex !== -1) {
            parentChildren.splice(dragIndex, 1);
            const newIndex = dropPosition === 'before' ? dragIndex - 1 : dragIndex + 1;
            parentChildren.splice(newIndex, 0, node);

            const updatedData = updateNodeByKey(gData, node.parentKey, { children: parentChildren });
            setGData(updatedData);
            setChange(true);
        }
    }, [gData, findParentChildsByKey, updateNodeByKey]);

    const onSelect = useCallback((selectedKeys) => {
        setSelectedKeys(selectedKeys);
    }, []);

    const onEditModalOk = useCallback(() => {
        form.validateFields().then((values) => {
            const newMenu = {
                title: values.title,
                link: values.link,
                target: values.target,
                dropdown: values.dropdown,
            };

            if (editingNode?.key) {
                const updatedData = updateNodeByKey(gData, editingNode.key, newMenu);
                setGData(updatedData);
            } else if (editingNode?.parent) {
                const updatedData = updateParentByKey(gData, editingNode.parent.key, {
                    key: nanoid(4),
                    ...newMenu,
                    level: editingNode.parent.level + 1,
                    parentKey: editingNode.parent.key,
                });
                setGData(updatedData);
            } else {
                setGData((prevData) => [
                    ...prevData,
                    {
                        key: nanoid(4),
                        level: 0,
                        parentKey: '',
                        ...newMenu,
                    },
                ]);
            }

            setEditingNode(null);
            setVisiblePopover(null);
            setChange(true);
        }).catch((e) => {
            message.error(e?.message || 'Validations failed.');
        });
    }, [form, gData, editingNode, updateNodeByKey, updateParentByKey]);

    const onAddButtonClick = useCallback((node) => {
        const targetDepth = (node?.key || '').split('-').length - 1;
        if (targetDepth >= 1) {
            message.error('Cannot add more than 1 levels of nesting');
            return;
        }
        form.resetFields();
        setEditingNode(node);
    }, [form]);

    const onEditNode = useCallback((open, node) => {
        if (open) {
            setEditingNode(node);
            form.setFieldsValue({ title: node.title, link: node.link, target: node.target, dropdown: node.dropdown });
        } else {
            setEditingNode(null);
            form.resetFields();
        }
    }, [form]);

    const handleDeleteModalOk = useCallback((node) => {
        const newData = [...gData];
        const selectedKey = node.key;
        const findAndRemove = (data) => {
            data.forEach((item, index) => {
                if (item.key === selectedKey) {
                    data.splice(index, 1);
                } else if (item.children) {
                    findAndRemove(item.children);
                }
            });
        };
        findAndRemove(newData);
        setGData(newData);
        setEditingNode(null);
        setChange(true);
    }, [gData]);

    const onDeleteNode = useCallback((node) => {
        handleDeleteModalOk(node);
    }, [handleDeleteModalOk]);

    const onSaveNode = useCallback((e) => {
        e.preventDefault();
        onSave(gData);
        setChange(false);
    }, [gData, onSave]);

    const formContent = (
        <Form form={form} onFinish={onEditModalOk} layout="vertical">
            <Form.Item name="title" label="Label" rules={[{ required: true, message: 'Required' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="link" label="Link" rules={[{ required: true, message: 'Required' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="target" label="Target" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select target option">
                    <Select.Option value="_self">Self</Select.Option>
                    <Select.Option value="_blank">New Tab</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="dropdown" valuePropName="checked" label="Dropdown">
                <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 5 }} size='small' onClick={() => {
                    setEditingNode(null);
                    setVisiblePopover(null);
                }}>Close</Button>
                <Button type="primary" size='small' htmlType='submit'>
                    {editingNode ? 'Update' : 'Add'}
                </Button>
            </Form.Item>
        </Form>
    );

    const renderTitle = useCallback((node) => (
        <div>
            <span>{node.title}</span>
            <div style={{ width: '50%', display: "inline-flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}>
                {node.level < 0 && (
                    <Popover
                        open={visiblePopover?.key === node.key && visiblePopover?.type === 'add'}
                        content={formContent}
                        title="Add"
                        trigger="click"
                        onOpenChange={(open) => {
                            setVisiblePopover(open ? { key: node.key, type: 'add' } : null);
                            if (open) onAddButtonClick({ parent: node });
                        }}
                    >
                        <Button type="dashed" size='small' disabled={node.level >= 3}>
                            <PlusOutlined />
                        </Button>
                    </Popover>
                )}
                <Popover
                    content={formContent}
                    open={visiblePopover?.key === node.key && visiblePopover?.type === 'edit'}
                    title={editingNode ? "Edit" : "Add"}
                    trigger="click"
                    onOpenChange={(open) => {
                        setVisiblePopover(open ? { key: node.key, type: 'edit' } : null);
                        if (open) onEditNode(open, node);
                    }}
                >
                    <Button size='small' type="text" ghost><EditOutlined style={{ color: colorPrimary }} /></Button>
                </Popover>
                <Popconfirm
                    title="Delete the Menu Item"
                    description="Are you sure to delete this Item?"
                    onConfirm={() => onDeleteNode(node)}
                    onCancel={() => { }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size='small' type="text" ghost><DeleteOutlined style={{ color: colorError }} /></Button>
                </Popconfirm>
                <>
                    <Button onClick={() => moveItem(node, 'before')} size='small' type="text">
                        <UpOutlined />
                    </Button>
                    <Button onClick={() => moveItem(node, 'after')} size='small' type="text">
                        <DownOutlined />
                    </Button>
                </>
            </div>
        </div>
    ), [formContent, onAddButtonClick, onEditNode, onDeleteNode, moveItem, colorPrimary, colorError, visiblePopover]);

    return (
        <div>
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                <Tree
                    selectedKeys={selectedKeys}
                    onSelect={onSelect}
                    blockNode
                    treeData={gData}
                    titleRender={renderTitle}
                    selectable={false}
                />
            </div>
            <div>
                <Popover
                    content={formContent}
                    open={visiblePopover?.type === 'add'}
                    title="Add"
                    trigger="click"
                    onOpenChange={(open) => {
                        setVisiblePopover(open ? { key: null, type: 'add' } : null);
                        if (open) onAddButtonClick(null);
                    }}
                >
                    <Button type="dashed">
                        <PlusOutlined />
                    </Button>
                </Popover>
                <Button style={{ marginLeft: 10, float: 'right' }} onClick={onSaveNode} type="primary" disabled={!change}>
                    Save <SaveOutlined />
                </Button>
            </div>
        </div>
    );
};

export default MenuTree;
