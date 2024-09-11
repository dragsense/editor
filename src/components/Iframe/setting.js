import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import ReactDOM from 'react-dom';

import ThemeServices from '../../lib/services/theme';
import SettingServices from '../../lib/services/setting'

// InnerComponent is responsible for loading CSS styles and rendering children
const InnerComponent = ({ children, document, onLoad }) => {

  // useEffect hook is used to load CSS styles on component mount
  useEffect(() => {
    loadCSSStyles().then(onLoad).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });
  }, []);

  // loadCSSStyles function is used to fetch and apply styles from the server
  const loadCSSStyles = async () => {
    try {
      const settingRes = await SettingServices.get();
      if (settingRes?.settings)
        document.head.insertAdjacentHTML("beforeend", settingRes.settings.scripts?.head);

      let res = await ThemeServices.getFonts();
      if (res.fonts)
        res.fonts.data.forEach(loadFont);

      document.fonts.onloadingerror = () => {};
      await document.fonts.ready;

      const root = document.documentElement;
      if (res.fonts)
        res.fonts.data.forEach(font => root.style.setProperty(font.variable, font.fontFamily));

      res = await ThemeServices.getColors();
      if (res.colors)
        res.colors.data.forEach(color => root.style.setProperty(color.variable, color.color));

      res = await ThemeServices.getVariables();
      if (res.variables)
        res.variables.data.forEach(variable => root.style.setProperty(variable.variable, variable.value));

      res = await ThemeServices.getCss();
      let style = document.createElement('style');
      style.id = 'ac-stylesheet-global';
      if (res.css) {
        style.textContent = res.css;
      }
      document.head.appendChild(style);

      return settingRes.settings?._id;
    } catch (e) {
      throw new Error(e?.message);
    }
  }

  // loadFont function is used to load a font from the server
  const loadFont = async (font) => {
    const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;
    if (isGoogleFont && src) {
      const linkElement = document.createElement('div');
      linkElement.id = 'google-font-' + _uid;
      linkElement.innerHTML = src;
      document.head.appendChild(linkElement);
    } else if (Array.isArray(fontSrc)) {
      try {
        const styleElement = document.createElement('style');
        styleElement.textContent = fontSrc.reduce((acc, src) => acc + `
          @font-face {
            font-family: "${fontFamily}";
            src: url("${src.src}");
          }
        `, '');
        document.head.appendChild(styleElement);
      } catch (error) {
        message.error(`Failed to load ${fontFamily} font: ${error}`);
      }
    }
  };

  return children;
};

// ShadowRootComponent is a wrapper component that provides a shadow root for its children
const ShadowRootComponent = ({ children }) => {
  // const rootRef = useRef();
  
  // useEffect(() => {
  //   if (rootRef.current) {
  //     const shadowRoot = rootRef.current.attachShadow({ mode: 'open' });
  //     shadowRoot.appendChild(children);
  //   }
  // }, [children]);
  
  return children;//<div ref={rootRef} />;
};

// IFrame is a component that provides an isolated context for its children
export default function IFrame({ children, onLoad }) {
  const iframeRef = useRef();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    setContainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {
      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }
  }, [iframeRef.current]);

  return <ShadowRootComponent>
    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<InnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </InnerComponent>, container.mountTarget)}
    </iframe>
  </ShadowRootComponent>
}

// AnimationsInnerComponent is responsible for loading animations and rendering children
const AnimationsInnerComponent = ({ children, document, onLoad }) => {
  useEffect(() => {
    loadAllAnimations().then(onLoad).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });
  }, []);

  // loadAllAnimations function is used to fetch and apply animations from the server
  const loadAllAnimations = async () => {
    try {
      let style = document.createElement('style');
      const res = await ThemeServices.getAnimationsCss();
      style.id = 'ac-stylesheet-global';
      if (res.css) {
        style.textContent = res.css;
      }
      document.head.appendChild(style);
      return res._id;
    } catch (e) {
      throw new Error(e?.message);
    }
  }

  return children;
};

// AnimationsIFrame is a component that provides an isolated context for its children with animations
export function AnimationsIFrame({ children, onLoad }) {
  const iframeRef = useRef();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    setContainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {
      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }
  }, [iframeRef.current]);

  return <ShadowRootComponent>
    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<AnimationsInnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </AnimationsInnerComponent>, container.mountTarget)}
    </iframe>
  </ShadowRootComponent>
}
