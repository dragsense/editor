import { PlusOutlined } from "@ant-design/icons";
import { Upload, message } from 'antd';
import { useCallback, useState } from "react";
import MediaServices from "../../../lib/services/media";

// Define the types of files that can be uploaded
const types = {
    "images": ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/vnd.microsoft.icon'],
    "videos": ['video/x-msvideo', 'video/mpeg', 'video/mp4', 'video/ogg', 'video/3gpp2', 'video/3gpp'],
    "docs": ['application/x-freearc', 'application/octet-stream', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-fontobject', 'application/gzip', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/xml', 'text/csv', 'text/css', 'text/html', 'text/javascript'],
    'audios': ['audio/mpeg', 'audio/3gpp', 'audio/ogg', 'audio/3gpp2', 'audio/wav', 'audio/webm'],
    'fonts': ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', ""]
}

// Define the maximum number of files that can be uploaded
const LIMIT = 10;

export default function UploadMedia({ type, onAdd }) {
    // Use state to keep track of the list of files
    const [fileList, setFileList] = useState([]);

    // Handle the upload of files
    const handleUpload = useCallback(async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await MediaServices.upload(type, formData, onProgress);
            onAdd(res.media);
            onSuccess({ status: 'done' });
        } catch (e) {
            onError(e)
            message.error(e?.message || 'Upload failed.');
        }
    }, [onAdd]);

    // Handle the change of files
    const handleChange = useCallback(({ fileList: newFileList }) => {
        setFileList(newFileList);
    }, []);

    // Handle the removal of files
    const handleRemove = useCallback((file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }, [fileList]);

    // Handle the success of file upload
    const handleSuccess = useCallback((response, file) => {
        message.destroy();
        message.success(`${file.name} uploaded successfully`);
        handleRemove(file);
    }, [handleRemove]);

    // Handle the exceed of file limit
    const handleExceed = useCallback((files, fileList) => {
        message.error(`You can only upload a maximum of ${LIMIT} files.`);
    }, []);

    // Handle the before upload of files
    const handleBeforeUpload = useCallback((file, fileList) => {
        const isValid = types[type].includes(file.type);
        if (!isValid) {
            message.error(`You can only upload ${type} file!`);
            return false;
        }
        if (fileList.length > LIMIT) {
            message.destroy();
            message.warning(`You can only upload a maximum of ${LIMIT} files.`);
        }
        return true;
    }, [type]);

    // Define the props for the Upload component
    const uploadProps = {
        accept: types[type].join(','),
        onDrop: handleChange,
        customRequest: handleUpload,
        onSuccess: handleSuccess,
        onChange: handleChange,
        beforeUpload: handleBeforeUpload,
        onExceed: handleExceed,
        showUploadList: { showRemoveIcon: true, showPreviewIcon: false },
        listType: "picture-card",
        fileList,
        maxCount: LIMIT,
        multiple: true,
        timeout: 60000
    };

    // Define the upload button
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // Render the Upload component
    return (
        <Upload {...uploadProps} >
            {fileList.length < LIMIT && uploadButton}
        </Upload>
    );
};
