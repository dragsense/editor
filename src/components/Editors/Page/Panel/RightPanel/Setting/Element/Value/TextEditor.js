import React, { Children, useEffect, useRef, useState } from "react";


import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  PictureOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { Button, Space, Popover, Input, Checkbox, Modal } from "antd";


function EditButton(props) {

  return <Button icon={props.icon} key={props.cmd} className="ac-icons-btn"
    onMouseDown={evt => {
      evt.preventDefault(); // Avoids loosing focus from the editable area
      document.execCommand(props.cmd, false, props.arg); // Send the command to the browser

    }}>{props.children}</Button>

}

function LinkButton() {

  const [openLink, setOpenLink] = useState(true);
  const [linkUrl, setLinkUrl] = useState('#');
  const [linkTarget, setLinkTarget] = useState(false);

  const handleOpenLink = (state) => {
    setOpenLink(state);
  };


  return <Popover
    content={<>
      <Input type="text" value={linkUrl} placeholder="url" onChange={(e) => {
        const value = e.target.value;
        setLinkUrl(value);

      }} />
      <Checkbox checked={linkTarget === true} onChange={(e) => {
        setLinkTarget(!linkTarget);
      }} />  <label>Open in new tab</label>
      <br />
      <div style={{ textAlign: 'right' }}>
        <EditButton cmd="insertHTML" arg={`<a href="${linkUrl}">${window.getSelection().toString()}</a>`}>Add</EditButton>
      </div>
    </>
    }
    title="URL"
    trigger="hover"
    open={openLink}
    placement='top'
    onOpenChange={handleOpenLink}
  >
    <Button className="ac-icons-btn" icon={<LinkOutlined />}></Button>
  </Popover>
}

// function ImageButton() {

//   const [openImage, setOpenImage] = useState(true);
//   const [srcUrl, setSrcUrl] = useState('/images/default/default-img.png');
//   const [alt, setAlt] = useState('');

//   const handleOpen = (state) => {
//     setOpenImage(state);
//   };


//   return <Popover
//     content={<>

//       <Space size={2} direction="vertical">

//         <label>src: </label>
//         <Input type="text" value={srcUrl} placeholder="src" onChange={(e) => {
//           const value = e.target.value;
//           setSrcUrl(value);

//         }} />

//         <label>alt: </label>
//         <Input type="text" value={alt} placeholder="alt" onChange={(e) => {
//           const value = e.target.value;
//           setAlt(value);

//         }} />

//       </Space>
//       <br />
//       <br />
//       <div style={{ textAlign: 'right' }}>
//         <EditButton cmd="insertHTML" arg={`<img src="${srcUrl}" alt="${alt}"/>`}>Add</EditButton>
//       </div>
//     </>
//     }
//     title="SRC"
//     trigger="hover"
//     open={openImage}
//     placement='top'
//     onOpenChange={handleOpen}
//   >
//     <Button icon={<PictureOutlined />}></Button>
//   </Popover>
// }


export default function TextEditor({content, setContent, onSave}) {

  const ref = useRef();


  const onOk = () => {

    const _content = ref.current.innerHTML;
    onSave(_content);


  }


  return <Space direction="vertical" size={10} style={{width: '100%'}}>
  
      <Space size={5}>
        <EditButton cmd="bold" icon={<BoldOutlined />} />
        <EditButton cmd="italic" icon={<ItalicOutlined />} />
        <EditButton cmd="underline" icon={<UnderlineOutlined />} />
        <LinkButton />
      </Space>
    
    <div
     ref={ref}
      style={{ border: '1px solid #e5e5e5', 
      padding: 5, display: 'inline-block', 
      width: '100%', 
      minHeight: 100, resize: 'vertical', 
      overflow: 'auto' }}
      contentEditable
      className="content-editor"
      dangerouslySetInnerHTML={{__html: content}}
    ></div>
            <Button onClick={onOk} className="ac-tabs-btn">Update</Button>
  </Space>

}

