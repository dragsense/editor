
import { Modal, Button, List, Skeleton } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { MdDragIndicator } from "react-icons/md";

const { confirm } = Modal;



const ElementList = ({
    onDelete,
    state,
}) => {



    return <List
        itemLayout={"horizontal"}
        size="small"
        bordered
        loading={state.loading}
        dataSource={state.elements}
        renderItem={(page, index) => (
            <List.Item
                onDragStart={(e) => e.preventDefault()}
                style={{
                    cursor: 'pointer', borderRadius: 10
                }}
                actions={[
                    <>
                        <Button draggable={true} onDragStart={(e) => {
                            //e.preventDefault();
                            e.stopPropagation();

                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                _uid: page._uid,
                                copy: true,
                                pageId: state.pageId
                            }));

                        }}
                        ><MdDragIndicator size={10} style={{ fontSize: 20 }} /></Button>
                    </>,
                    <>
                        <DeleteOutlined key="delete" size={10} onClick={(e) => {


                            e.preventDefault();
                            confirm({
                                title: `Are you sure to delete this element?`,
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(index);
                                },
                                onCancel() {

                                },
                            });

                        }} />
                    </>



                ]}


            >
                <Skeleton loading={false}>
                    <List.Item.Meta
                        title={page.name}
                    />
                </Skeleton>
            </List.Item>
        )}
    />


};

export default ElementList;
