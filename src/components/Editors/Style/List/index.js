import { Input, Space, Select, Button, Checkbox, Tooltip, Image, Dropdown, Menu, Collapse } from 'antd';
import { useEffect, useState } from 'react';

import { MdRestartAlt } from 'react-icons/md';

import { isEmpty } from '../../../../lib/utils';

import MediaModal from "../../../Media";

const listTypes = ['disc',
    'circle',
    'square',
    'decimal',
    'decimal-leading-zero',
    'lower-roman',
    'upper-roman',
    'lower-greek',
    'lower-latin',
    'upper-latin',
    'armenian',
    'georgian',
    'lower-alpha',
    ' upper-alpha',
    'none'];

const listPos = ['inside', 'outside'];
const { Option } = Select;


export default function List({ style, properties, onChangeStyle }) {

    const [image, setImage] = useState('');
    const [mediaModal, setMediaModal] = useState(false);


    const [stylePriority, setStylePriority] = useState({
        listStyleImage: '',
        listStyleType: '',
        listStylePosition: '',
    })

    useEffect(() => {

        if (!properties) {
            return;
        }

        setImage(properties["list-style-image"]?.image);


        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }
        setStylePriority(priorities);


    }, [properties]);

    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';

        if (!properties[_name])
            properties[_name] = {};

        properties[_name].priority = priority;

        style.setProperty(_name, style[name], priority);
        setStylePriority({ ...stylePriority, [name]: priority })

        onChangeStyle();
    }

    const onChangeStyleType = (value) => {

        if (!properties['list-style-type'])
            properties['list-style-type'] = {};

        properties['list-style-type'].value = value;

        style.setProperty('list-style-type', value, stylePriority.listStyleType);
        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }

    const onChangeStylePos = (value) => {

        if (!properties['list-style-position'])
        properties['list-style-position'] = {};

    properties['list-style-position'].value = value;



        style.setProperty('list-style-position', value, stylePriority.listStylePosition);
        setStylePriority({ ...stylePriority });
        onChangeStyle();


    }


    const onSelect = (image) => {

        if (!image[0])
            return;

        if (!properties['list-style-image'])
            properties['list-style-image'] = {};
        properties['list-style-image'].value = `url(${image[0].src})`;
        properties['list-style-image'].image = image[0];
        style.setProperty('list-style-image', `url(${image[0].src})`, stylePriority.listStyleImage);
        setImage(image[0]);

        onChangeStyle(); setStylePriority({ ...stylePriority });
    }

    return <> {!isEmpty(style) ?
        <>

            <div style={{ marginBottom: "10px" }}>
                <strong >List Style Type:   </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        name='listStyleType'
                        data-name="list-style-type"
                        checked={stylePriority.listStyleType === 'important'}
                        onChange={onChangePriority}>i</Checkbox>
                </Tooltip>


                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            onChangeStyle();

                            if (properties["list-style-type"])
                                delete properties["list-style-type"];
                            onChangeStyle();

                        setStylePriority({ ...stylePriority, listStyleType: '' });


                            style.removeProperty('list-style-type');
                        }}
                    ></Button>
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <Select
                    style={{ width: 200 }}
                    showSearch
                    value={style.listStyleType || 'none'}
                    onChange={onChangeStyleType}
                    placeholder="Select Type"
                >
                    {listTypes.map(item => (
                        <Option key={item}>{item}</Option>
                    ))}
                </Select>
            </div>


            <div style={{ marginBottom: "10px" }}>
                <strong >List Style Pos:   </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        name='listStylePosition' data-name="list-style-position"
                         checked={stylePriority.listStylePosition === 'important'
                         } onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();

                            if (properties["list-style-position"])
                                delete properties["list-style-position"];
                            onChangeStyle();

                        setStylePriority({ ...stylePriority, listStylePosition: '' });
                           
                            style.removeProperty('list-style-position');
                        }}
                        className="ac-icons-btn"
                    ></Button>
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>

                {listPos.map(s => <Button onClick={(e) => { e.preventDefault(); onChangeStylePos(s) }}
                    type={`${s === style.listStylePosition ? 'primary' : ''}`}>
                    {s.toUpperCase()}
                </Button>)}
            </div>

            <div style={{ marginBottom: "10px" }}>
                <strong >List Style Image:  </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        name='listStyleImage' data-name="list-style-image"
                        checked={stylePriority.listStyleImage === 'important'}
                        onChange={onChangePriority}>i
                    </Checkbox>
                </Tooltip>

                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();

                            if (properties["list-style-image"])
                                delete properties["list-style-image"];
                            onChangeStyle();

                        setStylePriority({ ...stylePriority, listStyleImage: '' });

                            style.removeProperty('list-style-image');
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
        </>


        :
        <></>
    }
        <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={image} onSelect={onSelect} />


    </>


}


