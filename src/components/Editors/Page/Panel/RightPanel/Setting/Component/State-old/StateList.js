import { List } from 'antd';


const StateList = ({ states }) => {
 

  return (
    states && <List
      dataSource={Object.values(states)}
      renderItem={(item) => (
        <List.Item key={item.key}>
          <List.Item.Meta title={item.key} description={`Type: ${item.type}`} />
      
        </List.Item>
      )}
    />
  );
};

export default StateList;