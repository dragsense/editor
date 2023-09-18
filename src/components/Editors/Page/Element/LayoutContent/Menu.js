import React, { useState, useCallback } from 'react';
import { Tree, Button, Popconfirm, Modal, Form, Popover, Input, message, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined, SaveOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
const { TreeNode } = Tree;
const { confirm } = Modal;

// MenuTree component for handling menu related operations
const MenuTree = ({ children, node, onSave }) => {

    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    const [form] = Form.useForm();
    const [gData, setGData] = useState(node.menus || []);
    const [change, setChange] = useState(false);

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [editingNode, setEditingNode] = useState(null);

    // Function to update a node by its key
    const updateNodeByKey = useCallback((data, key, updates) => {
        return data.map((node, i) => {
            if (node.key === key) {
                return {
                    ...node,
                    ...updates,
                };
            } else if (node.children) {
                return {
                    ...node,
                    children: updateNodeByKey(node.children, key, updates),
                };
            } else {
                return node;
            }
        });
    }, []);

    // Function to update a parent node by its key
    const updateParentByKey = useCallback((data, key, updates) => {
        return data.map((node, i) => {
            if (node.key === key) {
                return {
                    ...node,
                    children: [...(node.children || []), updates],
                };

            } else if (node.children) {
                return {
                    ...node,
                    children: updateParentByKey(node.children, key, updates),
                };
            } else {
                return node;
            }
        });
    }, []);

    // Function to find a parent node's children by its key
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

    // Function to move an item in the tree
    const moveItem = useCallback((node, dropPosition) => {
        const parentChildren = findParentChildsByKey(gData, node.parentKey);

        const dragIndex = parentChildren.findIndex(item => item.key === node.key);

        if (dragIndex !== -1) {
            parentChildren.splice(dragIndex, 1);

            const newIndex = dropPosition === 'before' ? dragIndex - 1 : dragIndex + 1;
            parentChildren.splice(newIndex, 0, node);

            const updatedData = updateNodeByKey(gData, node.parentKey, { children: parentChildren });
            setGData(updatedData);
            setChange(true)
        }
    }, [gData, findParentChildsByKey, updateNodeByKey]);

    // Function to handle selection of a node
    const onSelect = useCallback((selectedKeys, info) => {
        setSelectedKeys(selectedKeys);
    }, []);

    // Function to handle the OK button click in the edit modal
    const onEditModalOk = useCallback(() => {

        form.validateFields().then((values) => {

            const newMenu = {
                title: values.title,
                link: values.link,
                target: values.target,
            };

            if (editingNode?.key) {
                const updatedData = updateNodeByKey(gData, editingNode.key, {
                    ...newMenu,
                });
                setGData(updatedData);
            } else if (editingNode?.parent) {
                const updatedData = updateParentByKey(gData, editingNode.parent.key, {
                    key: nanoid(4),
                    ...newMenu,
                    level: editingNode.parent.level + 1,
                    parentKey: editingNode.parent.key
                }, 0);
                setGData(updatedData);
            } else {
                // Add a new item to the data array
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
            setChange(true)
        }).catch((e) => {
            message.error(e?.message, 'Validations failed.')
        });

    }, [form, gData, editingNode, updateNodeByKey, updateParentByKey]);

    // Function to handle the Add button click
    const onAddButtonClick = useCallback((node) => {

        const targetDepth = (node?.key || '').split('-').length - 1;

        if (targetDepth >= 3) {
            message.error('Cannot add more than 3 levels of nesting');
            return;
        }

        form.resetFields();
        setEditingNode(node);
    }, [form]);

    // Function to handle the Edit button click
    const onEditNode = useCallback((open, node) => {

        if (open) {
            setEditingNode(node);
            form.setFieldsValue({ ...node });

        } else setEditingNode(null);

    }, [form]);

    // Function to handle the Delete button click
    const onDeleteNode = useCallback((node) => {

        handleDeleteModalOk(node);
    }, [handleDeleteModalOk]);

    // Function to handle the Save button click
    const onSaveNode = useCallback((e) => {
        e.preventDefault();
        onSave(gData);

        setChange(false)

    }, [gData, onSave]);

    // Function to handle the OK button click in the delete modal
    const handleDeleteModalOk = useCallback((node) => {
        // Find the selected item and remove it from the data
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
        setChange(true)
    }, [gData]);

    // Form content for the edit modal
    const formContent = <Form form={form} onFinish={onEditModalOk} layout="vertical">
        <Form.Item name="title" label="Label" rules={[{ required: true, message: 'Required' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="link" label="Link" rules={[{ required: true, message: 'Required' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="target" label="Target" >
            <Input />
        </Form.Item>

        <Form.Item>
            <Button type="primary" size='small' htmlType='submit' disabled={!change}>
                {editingNode ? 'Update' : 'Add'}  </Button>
        </Form.Item>
    </Form>

    // Function to render the title of a node
    const renderTitle = useCallback((node) => (
        <div >
            <span>{node.title}</span>
            <div style={{ width: '50%', display: "inline-flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}>
                {node.level < 2 && (
                    <Popover content={formContent} title="Add" trigger="click" onOpenChange={(open) => onAddButtonClick({ parent: node })}>
                        <Button type="dashed" size='small' disabled={node.level >= 3}>
                            <PlusOutlined />
                        </Button>
                    </Popover>
                )}
                <Popover content={formContent} title={editingNode ? "Edit" : "Add"} trigger="click" onOpenChange={(open) => onEditNode(open, node)}>
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
                    <Button onClick={() => moveItem(node, 'before')} size='small' type="text" >
                        <UpOutlined />
                    </Button>
                    <Button onClick={() => moveItem(node, 'after')} size='small' type="text">
                        <DownOutlined />
                    </Button>
                </>

            </div>
        </div>
    ), [formContent, onAddButtonClick, onEditNode, onDeleteNode, moveItem, colorPrimary, colorError]);

    // Content of the MenuTree component
    const content = <>

        <div style={{ maxHeight: '60vh', overflow: 'auto', padding: 16 }}>
            <Tree
                selectedKeys={selectedKeys}

                onSelect={onSelect}
                blockNode

                treeData={gData}
                titleRender={renderTitle}
                selectable={false}
            >

            </Tree>
        </div>

        <div style={{   padding: 16 }}>
            <Popover content={formContent} title={"Add"} trigger="click" onOpenChange={(open) => onAddButtonClick(null)}>
                <Button type="dashed">
                    <PlusOutlined />
                </Button>

            </Popover>
            {" "}
            <Button style={{ marginLeft: 10, float: 'right' }} onClick={onSaveNode} type="primary" disabled={!change}>
                Save <SaveOutlined />
            </Button>
        </div>
    </>

    return content;

};

export default MenuTree;

