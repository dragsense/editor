import { List, Typography } from 'antd';
import { MdDragIndicator } from 'react-icons/md'


const StateList = ({ states }) => {


  return (
    states && <List
      dataSource={Object.values(states)}
      renderItem={(item) => (
        <List.Item key={item.key}>
          <List.Item.Meta
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div draggable={true} style={{ cursor: 'grab', marginLeft: -5 }}
                  onDragStart={(e) => {

                    const inputTag = item.type === 'select' ? 'select' :
                      item.type === 'textarea' ? 'textarea' :
                        'input';
                    const inputLayout = item.type === 'checkbox' ||
                      item.type === 'radio' ?
                      'inputgroup' : inputTag === 'select' ? 'select' : 'input';

                    let options = null;
                    if (inputLayout === 'inputgroup' || inputLayout === 'select') {
                      options = Object.values(item.states).flatMap((value) => value).join(',')
                    }


                    //e.preventDefault();
                    e.stopPropagation();
                    const tag = {
                      "tag": inputTag,
                      "nodeValue": item.defaultValue,
                      "notaccept": [
                        "media",
                        "texts",
                        "layouts"
                      ],
                      "layout": inputLayout,

                      "attributes": {

                        "name": {
                          "key": "name",
                          "value": item.key
                        },
                        ...(inputLayout !== 'select' && {
                          "type": {
                            "key": "type",
                            "value": item.type
                          }
                        }),
                        ...(
                          inputLayout !== 'inputgroup'
                          && item.type !== 'range' &&
                          item.type !== 'color' &&
                          item.type !== 'file' &&
                          inputLayout !== 'select' && {
                            "placeholder": {
                              "key": "placeholder",
                              "value": item.placeholder
                            }
                          }),
                        ...(item.multiple && {
                          "multiple": {
                            "key": "multiple",
                            "value": item.multiple
                          }
                        }),
                        "required": {
                          "key": "required",
                          "value": item.required
                        }
                      },
                      "options": options,
                      "type": "form",
                      "form": "formInput",
                      "key": item.key,
                      "label": item.label,
                      "labelPos": item.labelPos,
                      "errorMessage": item.errorMessage,

                    }

                    e.dataTransfer.setData('text/plain', JSON.stringify(tag));
                  }}

                ><MdDragIndicator size={20} />
                </div>
                <Typography.Text strong>{item.key}</Typography.Text>
              </div>
            }
            description={
              <>
                {`Type: ${item.type}`}
                <br />
                {`Placeholder: ${item.placeholder}`}
                <br />
                {`isRequired?: ${item.required ? 'Yes' : 'No'}`}
                <br />
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default StateList;