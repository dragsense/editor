import { Checkbox, Space, Image, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md'

import MediaModal from "../../../Media";


export default function _Image({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {


    const [mediaModal, setMediaModal] = useState(false);

    const [image, setImage] = useState({});

    useEffect(() => {

        if (!properties)
            return;

        setImage(properties['background-image']?.image)


    }, [properties])

    const onSelect = (image) => {

        if (!image[0])
            return;

        if (!properties['background-image'])
            properties['background-image'] = {};
        properties['background-image'].value = `url(${image[0].src})`;
        properties['background-image'].image = image[0];
        style.setProperty('background-image', `url(${image[0].src})`, stylePriority.backgroundImage);
        setImage(image[0]);

        onChangeStyle(); setStylePriority({ ...stylePriority });
    }

    const onRemove = (image) => {
    }

    const onChangePriority = (e) => {

        const name = e.target.name;
        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, [name]: priority })
        if (!properties['background-image'])
            properties['background-image'] = {};
        properties['background-image'].priority = priority;
        style.setProperty('background-image', style[name], priority);
        onChangeStyle();
    }




    return <>
        <div style={{ marginBottom: "10px" }}>
            <strong>{type}:  </strong>
            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ marginLeft: 3 }} name='backgroundImage' checked={stylePriority.backgroundImage === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}

                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        if (properties['background-image'])
                            delete properties['background-image'];
                        setImage('');
                        onChangeStyle();
                        setStylePriority({ ...stylePriority, 'backgroundImage': "" })

                        style.removeProperty('background-image');
                    }}
                    className="ac-icons-btn"
                ></Button>
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>
            <img
                width="100%"
                onClick={() => setMediaModal(true)}
               
                style={{
                    width: '120px',
                    height: '120px',
                    cursor: 'pointer'
                }}
                src={`${image?.src || "./images/default/default-img.png"}`}
                />

        </div>

        <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={image} onSelect={onSelect} />

    </>


}


