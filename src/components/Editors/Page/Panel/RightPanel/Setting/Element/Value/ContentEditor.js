import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { fetcher } from "@/lib/fetch";
import { Button, Modal, message, theme, Space } from "antd";
import {
  FileImageOutlined,
} from "@ant-design/icons";
import { AlloyEditor } from 'alloyeditor';
import HtmlEditor from './HtmlEditor';
import SwitchComponents from "@/components/Panel";

import MediaServices from "@/lib/services/media";

class ButtonImage extends React.Component {


  static key = 'imageFromFile';

  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.progress = -1;
  }

  onProgress = ({ progress }) => {

    this.progress = progress;
  };

  onResetProgress = () => {
    this.progress = -1;
  };


  render() {
    const inputSyle = { display: 'none' };

    return (
      <div>
        <button
          aria-label={AlloyEditor.Strings.image}
          className="ae-button"
          data-type="button-image"
          onClick={this.handleClick}
          tabIndex={this.props.tabIndex}
          title={AlloyEditor.Strings.image}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M14 9l-2.519 4-2.481-1.96-5 6.96h16l-6-9zm8-5v16h-20v-16h20zm2-2h-24v20h24v-20zm-20 6c0-1.104.896-2 2-2s2 .896 2 2c0 1.105-.896 2-2 2s-2-.895-2-2z" /></svg>

        </button>

        <input
          accept="image/*"
          onChange={this._onInputChange}
          ref={this.fileInput}
          style={inputSyle}
          type="file"
        />

        {this.progress >= 0 && (
          <div>
            <progress value={this.progress} max="100" />
          </div>
        )}
      </div>
    );
  }


  handleClick = () => {
    this.fileInput.current.click();
  };


  _onInputChange = async () => {
    const inputEl = this.fileInput.current;



    try {

      if (!inputEl.files.length)
        throw "Please Select File";



      const formData = new FormData();

      formData.append('file', inputEl.files[0]);


      const res = await MediaServices.upload('images', formData, this.onProgress)

      message.success('upload successfully.');


      if (res.media) {
        const editor = this.props.editor.get('nativeEditor');

        const el = CKEDITOR.dom.element.createFromHtml(
          `<img src="${res.media.src}" alt="${res.media.alt}" width="400">`
        );


        editor.insertElement(el);

        editor.fire('actionPerformed', this);

      }



    } catch (e) {
      message.error(e?.message || 'upload failed.');
    }
    finally {
      this.onResetProgress();
    }


    inputEl.value = '';
  };
}


AlloyEditor.Buttons['acimage'] = AlloyEditor.ButtonImage = ButtonImage;

var Selections = [{
  name: 'link',
  buttons: ['linkEdit'],
  test: AlloyEditor.SelectionTest.link
}, {
  name: 'image',
  buttons: ['imageLeft', 'imageCenter', 'imageRight', 'removeImage'],
  test: AlloyEditor.SelectionTest.image
}, {
  name: 'text',
  buttons: ['styles', , 'paragraphLeft', 'paragraphCenter', 'paragraphRight', 'paragraphJustify',
    'indentBlock', 'outdentBlock', 'bold', 'italic', 'underline', 'link', 'quote', 'strike', 'removeFormat'],
  test: AlloyEditor.SelectionTest.text
}, {
  name: 'table',
  buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
  getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
  setPosition: AlloyEditor.SelectionSetPosition.table,
  test: AlloyEditor.SelectionTest.table
}];

var toolbars = {
  add: {
    buttons: ['acimage', 'camera', 'hline', 'table', 'ul', 'ol'],
    tabIndex: 2
  },
  styles: {
    selections: Selections,
    tabIndex: 1
  },

};



export default function RichTextEditor({ content, onSave, isOnlyHTML = 0 }) {


  const {
    token: { colorPrimary },
  } = theme.useToken();



  const [code, setCode] = useState({ code: '', status: false });
  const [cont, setContent] = useState(content);

  
  useEffect(() => {


    setContent(content)

  }, [content]);

  const [type, setType] = useState(isOnlyHTML);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };



  const handleOk = () => {

    if (type == 0) {
      const _content = document.getElementById('content-editor');
      if (_content)
        onSave(_content.innerHTML);
    } else {
      if (code) {
        const _code = code.status ? code.code : '';
        onSave(_code);
      }
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };



  return (
    <>
      <Button className="ac-tabs-btn" onClick={showModal}>
        Edit Content
      </Button>
      <Modal width="60%" title="Edit Content" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

        <Space wrap>
          {isOnlyHTML == 0 ? <Button
            style={type == 0 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
            onClick={(e) => {
              e.preventDefault();
              const _code = code.status ? code.code : '';
              setContent(_code)

              setType(0)
            }}
          > Visual </Button> : <></>}
          <Button
            style={type == 1 ? { borderColor: colorPrimary, color: colorPrimary } : {}}

            onClick={(e) => {
              e.preventDefault();
              const _content = document.getElementById('content-editor');
              setContent(_content.innerHTML); setType(1);
            }}
          > html </Button>
        </Space>

        <br />
        <br />
        <div style={{ padding: 10, overflow: 'auto', maxHeight: '50vh' }}>

          <SwitchComponents active={type}>

            <AlloyEditorComponent
              container='content-editor'
              content={cont}
              index={0}

            />
            <div style={{ position: 'relative' }} index={1}>

              <HtmlEditor content={cont} code={code} setCode={setCode} />
            </div>
          </SwitchComponents>

        </div>
      </Modal>
    </>
  );
};



function AlloyEditorComponent({ container, alloyEditorConfig, content }) {

  let _editor = null;

  useEffect(() => {


    _editor = AlloyEditor.editable(container, {
      toolbars, enterMode: CKEDITOR.ENTER_BR,
      shiftEnterMode: CKEDITOR.ENTER_BR,
    });


    return () => {

      if (_editor)
        _editor.destroy();
    }

  }, []);


  return (
    <div id={container}
      dangerouslySetInnerHTML={{ __html: content }}>

    </div>
  );

}



