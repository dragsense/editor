
import { Modal, Button, List, Skeleton, theme } from "antd";
import { DeleteOutlined, DragOutlined, EditOutlined, ExclamationCircleFilled, SettingOutlined } from '@ant-design/icons';
import { MdDragIndicator } from "react-icons/md";

const { confirm } = Modal;



const PageList = ({
    selectedPage,
    type,
    onDelete,
    state,
    onEdit }) => {

    const {
        token: { colorPrimaryBg },
    } = theme.useToken();



    return <List
        itemLayout={type == "template" ? "vertical" : "horizontal"}
        size="small"
        bordered
        loading={state.loading}
        dataSource={state.pages}
      
        renderItem={(page, index) => (
            <List.Item
                onDragStart={(e) => e.preventDefault()}
                style={{
                    background: selectedPage?._id == page._id ? colorPrimaryBg : null, cursor: 'pointer', borderRadius: 10
                }}

                actions={[
                    selectedPage?._id !== page._id &&

                    <EditOutlined key="edit" size={10} style={{ fontSize: 20 }}

                        onClick={(e) => {
                            e.preventDefault();

                            onEdit(page, type);
                        }}


                    />,

                    (selectedPage?._id !== page._id && type == "component" || type == 'form' || type == "template") && <>
                        <Button draggable={true} onDragStart={(e) => {
                            //e.preventDefault();
                            e.stopPropagation();
                            const tag = {
                                "page": { _id: page._id, pageType: type },
                            }

                            e.dataTransfer.setData('text/plain', JSON.stringify(tag));
                        }}
                        ><MdDragIndicator size={10} style={{ fontSize: 20 }} /></Button>
                    </>,
                    
                    <>

                        {type == "template" && <DeleteOutlined key="delete" size={10} onClick={(e) => {


                            e.preventDefault();
                            confirm({
                                title: `Are you sure to delete this ${type}?`,
                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(page._id);
                                },
                                onCancel() {

                                },
                            });

                        }} />}</>



                ]}


            >
                <Skeleton loading={false}>
               
            
                    <List.Item.Meta

                        title={page.name.length > 10 ? page.name.substring(0, 10)+"..." : page.name}
                    />
                </Skeleton>
    
               

            </List.Item>
        )}
    />


};

export default PageList;
