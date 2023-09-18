import React from 'react';
import { List, Button, Modal } from 'antd';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const StateList = ({ states, setNewState, onRemove }) => {
  const handleEditState = (record) => {
    setNewState({ ...record, edit: true });
  };

  const handleDeleteState = (record) => {
    confirm({
      title: 'Are you sure to delete this key?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onRemove(record);
      },
      onCancel() { },
    });
  };

  const renderItemActions = (record) => {
    return (
      <div>
        <Button 
          icon={<AiOutlineEdit size="1em" />}
          onClick={() => handleEditState(record)}
        />
        <Button danger
        style={{marginLeft: 10}}
          icon={<AiOutlineDelete size="1em" />}
          onClick={(e) => {
            e.preventDefault();
            handleDeleteState(record)
          }
          }
        />
      </div>
    );
  };

  return (
    states && <List
      dataSource={Object.values(states || {})}
      renderItem={(item, index) => (
        <List.Item key={item.key}>
          <List.Item.Meta title={item.key || 'event'+index} description={`Type: ${item.type || 'scroll'}`} />
          {renderItemActions(item)}
        </List.Item>
      )}
    />
  );
};

export default StateList;