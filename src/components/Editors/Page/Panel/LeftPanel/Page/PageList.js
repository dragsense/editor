import { Modal, Button, List, Skeleton, theme } from "antd";
import { DeleteOutlined, DragOutlined, EditOutlined, ExclamationCircleFilled, SettingOutlined } from '@ant-design/icons';
import { MdDragIndicator } from "react-icons/md";

const { confirm } = Modal;

// Function to handle drag start
const handleDragStart = (e, page, type) => {
    e.stopPropagation();
    const tag = {
        "page": { _id: page._id, pageType: type },
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({...tag, key: 'autocode-element'}));
}

// Function to handle edit
const handleEdit = (e, page, type, onEdit) => {
    e.preventDefault();
    onEdit(page, type);
}

// Function to handle delete
const handleDelete = (e, page, type, onDelete) => {
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
}

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
                        onClick={(e) => handleEdit(e, page, type, onEdit)}
                    />,
                    (selectedPage?._id !== page._id && type == "component" || type == 'form' || type == "template") && <>
                        <Button draggable={true} onDragStart={(e) => handleDragStart(e, page, type)}
                        ><MdDragIndicator size={10} style={{ fontSize: 20 }} /></Button>
                    </>,
                    <>
                        {type == "template" && <DeleteOutlined key="delete" size={10} onClick={(e) => handleDelete(e, page, type, onDelete)} />}</>
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
