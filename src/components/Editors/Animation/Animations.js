
import {
  Button, Modal, Card, Spin, Alert, Tooltip, InputNumber,
  Radio, Select, Divider, ColorPicker, Layout
} from "antd";
import { useState, useReducer, useEffect, useRef } from "react";
import { ExclamationCircleFilled } from '@ant-design/icons';


import { AnimationsIFrame } from "../../Iframe";

import { MdRedo, MdUndo } from "react-icons/md";

import RigthSideBar from "../Style/Editor/RightSideBar";
import ThemeServices from "../../../lib/services/theme";

import { Preview } from './Preview';
import Add from './Add';

import {
  loadAnimationStyles,
  getAllCssData, clearStore, deleteStyleData,
  deleteAllActions, updateStyleData,
  storeAction, getAction, searchSelector,
  deleteAction, UNDO_STORE_NAME, REDO_STORE_NAME, STYLE_STORE_NAME, storePage, getData, deleteData, saveStyle, updateData
} from '../../../lib/db';

const { Option } = Select;
const { confirm } = Modal;


const reducer = (state, action) => {




  switch (action.type) {
    case "start":
      return { ...state, loading: true }
    case "done":
      return { ...state, done: true }
    case "load":
      return { ...state, page: action.page }
    case "edit":
      return {
        ...state,
        animation: action.animation,
        elementType: action.elementType,
        selector: null,
        error: '',
      }
    case "add":
      return {
        ...state,
        selector: action.selector,
        error: ''
      }
    case "delete":
      return { ...state, selector: null, error: '' }
    case "deleteSelector":
      return { ...state, selector: null, error: '', selectorDeleted: action.selectorDeleted }
    case "deleteAnimation":
      return {
        ...state, animation: {}, selector: null,
        animationDeleted: action.animationDeleted,
        error: ''
      }
    case "clearError":
      return { ...state, error: '' }
    case "error":
      return { ...state, error: action.error }
    case "finish":
      return { ...state, loading: false }
    default:
      return state;
  }
};



export default function Animations({ menuKeys, children, onBack }) {

  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [isChange, setIsChange] = useState(false);
  const [isStyleChange, setIsStyleChange] = useState(false);



  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    animationsName: "",
    elementType: "",
    selector: null,
    animation: {},
    page: {},
    done: false,
    error: ''
  });

  const pageIdRef = useRef(null);

  useEffect(() => {


    const fetchData = async () => {
      try {
        dispatch({ type: 'start' });

        await clearStore(UNDO_STORE_NAME);
        await clearStore(REDO_STORE_NAME);
        await loadAnimationStyles(dispatch, true);
        dispatch({ type: 'done' });

      } finally {

        dispatch({ type: 'finish' });
      }

    }

    fetchData();

  }, [])

  useEffect(() => {

    if (!state.done)
      return;

    dispatch({ type: 'load', page: { _id: pageIdRef.current } });

  }, [state.done])

  const onLoad = async (_id) => {
    pageIdRef.current = _id;

  }

  const saveIsChange = (callback) => {

    if (isChange) {
      confirm({
        title: 'Please remember to update first?',
        icon: <ExclamationCircleFilled />,
        okText: 'Update',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          if (state.selector)
            await onUpdateSelector(state.selector);

          callback();
        },
        onCancel() {

        },
      });
    } else
      callback();
  }


  const onEdit = async (animation) => {

    if (!animation || !state.page?._id)
      return;

    saveIsChange(() => {
      dispatch({ type: 'edit', animation: animation, elementType: animation.name });
    });


  }


  useEffect(() => {
    async function promptBeforeClose(event) {
      if (isChange) {
        event.preventDefault();

        const shouldSave = await window.autocode.checkUnsavedChanges(isChange);

        if (shouldSave) {
          await onSubmit();
        }

        setTimeout(() => {
          window.close();
        }, 100);

      }

      setIsChange(false);




    }

    window.addEventListener('beforeunload', promptBeforeClose);

    return () => {
      window.removeEventListener('beforeunload', promptBeforeClose);
    };
  }, [isChange]);


  const onSubmit = async () => {


    dispatch({ type: 'start' });


    try {


      if (isStyleChange)
        await onUpdateSelector(state.selector);


      const page = state.page;
      await saveStyle(page, 'animation');
      setIsChange(false)

      dispatch({
        type: 'clearError'
      })

    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    } finally {
      dispatch({ type: 'finish' });
    }


  };

  const onDeleteAnimation = async (STORE = UNDO_STORE_NAME, redo) => {
    try {


      if (!state.animation)
        throw new Error('Animation not selected!')

      const animation = state.animation;

      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const sheet = iframeDocument.styleSheets[0];
      const cssRules = sheet.cssRules || sheet.rules;
      const rules = Array.from(cssRules).filter(rule => rule.type === 7);
      const ruleIndex = rules.findIndex(item => item.name === animation.name);

      if (ruleIndex >= 0) {
        sheet.deleteRule(ruleIndex);
      }

      await deleteData(state.page._id, animation._uid, STYLE_STORE_NAME);

      dispatch({
        type: 'deleteAnimation',
        animationDeleted: animation._uid
      })

      setIsChange(true)



    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }
    finally {
    }
  };



  const onSelectSelector = async (newSelector, STORE = UNDO_STORE_NAME, redo) => {

    try {

      let { selectorText, properties = {}, store = STYLE_STORE_NAME, _uid,
      } = newSelector;


      if (!selectorText || !state.animation) {
        throw new Error('Animation || Selector not found.');
      }

      const animation = state.animation;

      dispatch({ type: 'start' });



      if (!validatClass(selectorText))
        throw new Error('Please Enter Valid Selector.');


      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;


      const styleSheets = iframeDocument.styleSheets;
      let sheet = null;

      for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
          break;
      }

      let cssRules = sheet.cssRules || sheet.rules;

      // Find the keyframes rule for the animation or create it if it doesn't exist
      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === animation.name) {
          ruleIndex = i;
          break;
        }
      }

      let keyframesRule;
      if (ruleIndex < 0) {
        keyframesRule = `@keyframes ${animation.name} {}`;
        ruleIndex = sheet.insertRule(keyframesRule, cssRules.length);
      }


      const keyframesRules = cssRules[ruleIndex];
      // Find the rule for the current selector or create it if it doesn't exist
      let index = -1

      for (let i = 0; i < keyframesRules.cssRules.length; i++) {
        const selector = keyframesRules.cssRules[i].keyText;
        if (selector === selectorText) {
          index = i;
          break;
        }
      }


      let rule;
      if (index < 0) {
        const ruleText = `${selectorText} {}`;
        index = keyframesRules.appendRule(ruleText);
        rule = keyframesRules.cssRules[keyframesRules.cssRules.length - 1];

      } else
        rule = keyframesRules.cssRules[index];


      const selector = {
        style: rule.style,
        properties,
        selectorText: selectorText,
        animationName: animation.name,
        store
      };

      dispatch({ type: 'add', selector });

    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
    } finally {
      dispatch({ type: 'finish' });
    }



  };




  const onDeleteSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
    try {



      if (!selector || !state.animation)
        throw new Error('Animation || Selector not found!');

      const { store,
        selectorText,
      } = selector;

      const animation = state.animation;


      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const styleSheets = iframeDocument.styleSheets;
      let sheet = null;

      for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
          break;
      }

      let cssRules = sheet.cssRules || sheet.rules;


      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === animation.name) {
          ruleIndex = i;
          break;
        }
      }


      if (ruleIndex < 0) {
        throw new Error('Animation not found!');
      }



      let keyframeToDeleteKey = '';

      const keyframeRule = cssRules[ruleIndex];
      for (let i = 0; i < keyframeRule.cssRules.length; i++) {
        const rule = keyframeRule.cssRules[i];
        if (rule.keyText === selectorText) {
          keyframeToDeleteKey = rule.keyText;
          break;
        }
      }


      if (!animation.style)
        animation.style = {}

      delete animation.style[selectorText];

      await updateData(state.page._id, animation, STYLE_STORE_NAME)



      setIsChange(true)
      dispatch({ type: 'deleteSelector', selectorDeleted: selectorText });

      if (keyframeToDeleteKey) {
        keyframeRule.deleteRule(keyframeToDeleteKey);
      } else {
        throw new Error('Selector not found!');
      }


    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }
    finally {
    }
  };



  const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {



    try {

      if (!selector || !state.animation) {
        throw new Error('Animation || Selector not found!');
      }
      dispatch({ type: 'start' });

      const animation = state.animation;


      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;


      const styleSheets = iframeDocument.styleSheets;
      let sheet = null;

      for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
          break;
      }

      let cssRules = sheet.cssRules || sheet.rules;


      // Find the keyframes rule for the animation or create it if it doesn't exist
      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === animation.name) {
          ruleIndex = i;
          break;
        }
      }

      if (ruleIndex < 0) {
        throw new Error('Animation not found!');
      }


      // Find the rule for the current selector or create it if it doesn't exist
      let index = -1

      for (let i = 0; i < cssRules[ruleIndex].cssRules.length; i++) {
        const sel = cssRules[ruleIndex].cssRules[i].keyText;
        if (sel === selector.selectorText) {
          index = i;
          break;
        }
      }


      let rule;
      if (index < 0)
        throw new Error('Rule not found!');

      rule = cssRules[ruleIndex].cssRules[index];

      if (rule) {
        // Remove existing properties
        const styleDeclaration = rule.style;
        const properties = Array.from(styleDeclaration);
        properties.forEach(property => {
          styleDeclaration.removeProperty(property);
        });

        if (!selector.properties)
          selector.properties = {};

        Object.keys(selector.properties).forEach(key => {
          const value = selector.properties[key]?.value;
          const priority = selector.properties[key]?.priority;
          rule.style.setProperty(key, value, priority);
        });
      }


      if (!animation.style)
        animation.style = {}

      if (!animation.style[selector.selectorText])
        animation.style[selector.selectorText] = {}


      onAddAction({
        action: 'updateStyle',
        selector: {
          properties: animation.style[selector.selectorText].properties,
          selectorText: selector.selectorText,
          store: selector.store
        },
      }, STORE, isRedo);



      animation.style[selector.selectorText].properties = selector.properties;
      animation.style[selector.selectorText].selectorText = selector.selectorText;


      await updateData(state.page._id, animation, selector.store);


      setIsStyleChange(false);
      setIsChange(true)

      dispatch({ type: 'updateStyle' });


    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }
    finally {
      dispatch({ type: 'finish' });

    }


  };


  const onAddAction = async (action, STORE, isRedo) => {

    if (!isRedo) {
      // const actions = await getAllActions(REDO_STORE_NAME);
      await deleteAllActions(REDO_STORE_NAME);

      //await storeActions(actions, UNDO_STORE_NAME)
    }

    await storeAction(action, STORE);
  };

  const performAction = async (STORE1, STORE2) => {
    const action = await getAction(STORE1);

    if (!action)
      return;

    switch (action.action) {
      case 'updateStyle':
        await onUpdateSelector(
          action.selector,
          STORE2, true);
        break;
      default:
        break;


    }

    await deleteAction(STORE1);
  };

  const undo = async () => {
    await performAction(UNDO_STORE_NAME, REDO_STORE_NAME);
  };

  const redo = async () => {
    await performAction(REDO_STORE_NAME, UNDO_STORE_NAME);

  };


  const validatClass = (inputValue) => {
    const regex = /^(100|[1-9][0-9]?|0)%|from|to$/;
    const isValid = regex.test(inputValue);
    return isValid;
  };



  const onChange = async (name, value, priority, unit) => {

    // state.selector.properties[name] = { value, priority, unit }

    setIsChange(true);
    setIsStyleChange(true)
  }

  const LeftTools = () => <span>Setting: &nbsp;&nbsp;

    <ColorPicker value={backgroundColor}
      allowClear={true}
      format={"hex"}
      onChangeComplete={(color, hex) => {
        const metaColor = color.metaColor;
        const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;
        setBackgroundColor(rgbColor)
      }} />
  </span>

  const RightTools = () => <>

    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
      <Tooltip placement="bottom" title="Undo">
        <Button
          icon={<MdUndo size={20} />}
          onClick={(e) => { e.preventDefault(); undo(); }}
        >  </Button>
      </Tooltip>

      <Tooltip placement="bottom" title="Redo">
        <Button
          icon={<MdRedo size={20} />}
          onClick={(e) => { e.preventDefault(); redo(); }}
        >  </Button>
      </Tooltip>

    </div>
  </>

  const [delay, setDelay] = useState(1);
  const [duration, setDuration] = useState(4);
  const [timeFun, setTimeFun] = useState('ease');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('none');
  const [playState, setPlayState] = useState('running');

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [borderRadius, setBorderRadius] = useState(100);
  const [backgroundItemColor, setBackgroundItemColor] = useState('#000');

  const inputs = `${duration + "s"} ${timeFun} ${delay + "s"} infinite ${direction} ${fillMode} ${playState}  ${state.animation?.name}`;
  const style = {
    animation: inputs,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${borderRadius}px`,
    backgroundColor: backgroundItemColor
  }


  const handleBackClick = async (e) => {
    e.preventDefault();
    if (isChange) {
      const shouldSave = await window.autocode.checkUnsavedChanges(isChange);

      if (shouldSave) {
        await onSubmit();
      }
    }

    // Navigate back
    onBack();
  };

  return <div>

    <div style={{ textAlign: 'center', padding: 10 }}>
      <img src="./images/logo/nav-logo.png" width="50" alt="autocode-logo" />
    </div>

    <Card loading={state.loading && !document}
      headStyle={{ padding: 10 }}
      bodyStyle={{ padding: 0 }}
      extra={<><Button type="dashed" style={{ marginRight: 10 }}
        loading={state.loading}
        onClick={handleBackClick}>Back</Button> <Button type="primary" onClick={onSubmit} loading={state.loading} disabled={!isChange}>Save</Button></>}
      title={<><div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LeftTools /> <div style={{ width: 400 }}>
          <Add onDelete={onDeleteAnimation}
            animation={state.animation}
            state={state}
            onChange={() => setIsChange(true)}

            onEdit={onEdit} />
        </div><RightTools /></div></>}>

      {state.error && <Alert message={state.error}
        style={{ margin: '10px 0' }} type="error" showIcon closable />}
      <div style={{ display: 'flex', minHeight: '80vh', position: 'relative' }}>


        <Spin tip="Loading" size="small" spinning={state.loading}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
        </Spin>

        <div style={{ width: 280 }}>
          {state.animation ? (
            <div>
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <label>Width: </label>&nbsp; &nbsp;
                  <InputNumber
                    value={width}
                    onChange={(value) => setWidth(value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Height: </label> &nbsp; &nbsp;
                  <InputNumber
                    value={height}
                    onChange={(value) => setHeight(value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Border Radius: </label> &nbsp; &nbsp;
                  <InputNumber
                    value={borderRadius}
                    onChange={(value) => setBorderRadius(value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Background:</label> &nbsp; &nbsp;


                  <ColorPicker value={backgroundItemColor}
                    allowClear={true}
                    format={"hex"}
                    onChangeComplete={(color, hex) => {
                      const metaColor = color.metaColor;
                      const rgbColor = `rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`;
                      setBackgroundItemColor(rgbColor)
                    }} />

                </div>
                <Divider orientation="left" orientationMargin="0">Animation</Divider>
                <div style={{ marginBottom: 16 }}>
                  <label>Name: </label> &nbsp; &nbsp;
                  <strong>{state.animation.name}</strong>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Duration: </label> &nbsp; &nbsp;
                  <InputNumber
                    value={duration}
                    onChange={(value) => setDuration(value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Timing Function: </label> &nbsp; &nbsp;
                  <Select
                    style={{ width: 120 }}
                    value={timeFun}
                    onChange={(value) => setTimeFun(value)}
                  >
                    <Option value="linear">linear</Option>
                    <Option value="ease">ease</Option>
                    <Option value="ease-in">ease-in</Option>
                    <Option value="ease-in-out">ease-in-out</Option>
                    <Option value="ease-out">ease-out</Option>
                    <Option value="cubic-bezier(0.1, -0.6, 0.2, 0)">
                      cubic-bezier(0.1, -0.6, 0.2, 0)
                    </Option>
                    <Option value="cubic-bezier(0, 1.1, 0.8, 4)">
                      cubic-bezier(0, 1.1, 0.8, 4)
                    </Option>
                    <Option value="steps(3, start)">steps(3, start)</Option>
                    <Option value="steps(4)">steps(4)</Option>
                  </Select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Delay: </label>&nbsp; &nbsp;
                  <InputNumber value={delay} onChange={(value) => setDelay(value)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Direction: </label>&nbsp; &nbsp;
                  <Select
                    style={{ width: 120 }}
                    value={direction}
                    onChange={(value) => setDirection(value)}
                  >
                    <Option value="normal">normal</Option>
                    <Option value="reverse">reverse</Option>
                    <Option value="alternate">alternate</Option>
                    <Option value="alternate-reverse">alternate-reverse</Option>
                  </Select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Fill Mode: </label>&nbsp; &nbsp;
                  <Select
                    style={{ width: 120 }}
                    value={fillMode}
                    onChange={(value) => setFillMode(value)}
                  >
                    <Option value="none">none</Option>
                    <Option value="forwards">forwards</Option>
                    <Option value="backwards">backwards</Option>
                    <Option value="both">both</Option>
                  </Select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Play State: </label>&nbsp; &nbsp;
                  <Radio.Group
                    value={playState}
                    onChange={(e) => setPlayState(e.target.value)}
                  >
                    <Radio value="running">Running</Radio>
                    <Radio value="paused">Paused</Radio>
                  </Radio.Group>
                </div>

              </Card>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>

          <AnimationsIFrame onLoad={onLoad}>
            <div style={{ backgroundColor, width: '100%', height: '100%' }}>
              <Preview style={style} />
            </div>
          </AnimationsIFrame>
        </div>


          <RigthSideBar
            state={state}
            onSelect={onSelectSelector}
            onDelete={onDeleteSelector}
            onSubmit={onUpdateSelector}
            onChange={onChange}
            animation={state.animation}
          
            menuKeys={menuKeys}
          >
            <div style={{ textAlign: 'right', marginTop: 10, padding: 10 }}>
              <Button type="primary" onClick={(e) => {
                e.preventDefault();
                onUpdateSelector(state.selector);
              }

              } loading={state.loading} disabled={!isStyleChange}> Update </Button>
            </div>
          </RigthSideBar>
       
      </div>





    </Card>
  </div>
}

