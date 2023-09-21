import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import ThemeServices from '../../../..//lib/services/theme';
import SettingServices from '../../../../lib/services/setting';

// InnerComponent is responsible for loading CSS styles and calling the onLoad function
const InnerComponent = ({ children, document, onLoad, _id, type }) => {


    // Function to load a single font
    const loadFont = async (font) => {
      const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;
      if (isGoogleFont && src) {
        const linkElement = document.createElement('div');
        linkElement.id = 'google-font-' + _uid;
        linkElement.innerHTML = src;
        document.head.appendChild(linkElement);
      }
      else if (Array.isArray(fontSrc)) {
        try {
          const styleElement = document.createElement('style');
          styleElement.textContent = '';
          for (const src of fontSrc) {
            if (src.src)
              styleElement.textContent += `
                @font-face {
                  font-family: "${fontFamily}";
                  src: url("${src.src}");
                }
              `;
          }
          document.head.appendChild(styleElement);
        } catch (error) {
          message.error(`Failed to load ${fontFamily} font: ${error}`);
        }
      }
    }
  
    // Function to append custom styles to document head
    const appendCustomStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .cke_editable.ae-editable, .cke_editable.ae-editable *{
          background: #fff !important;
        }
        @keyframes ac-001-pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    // Function to load CSS styles
    const loadCSSStyles = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          // Fetch settings and append scripts to document head
          let res = await SettingServices.get();
  
          if (res?.setting) {
            document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);
            document.body.insertAdjacentHTML("beforeend", res.setting.scripts?.footer);
          }
  
          //Fetch fonts and append to document head
          res = await ThemeServices.getFonts();
          if (res.fonts)
            res.fonts.data.forEach(loadFont);
  
          // Set font styles to root
          const root = document.documentElement;
          if (res.fonts)
            for await (let font of res.fonts.data) {
              root.style.setProperty(font.variable, font.fontFamily);
            }
  
          // Fetch colors and set to root
          res = await ThemeServices.getColors()
          if (res.colors)
            for await (let color of res.colors.data) {
              root.style.setProperty(color.variable, color.color);
            }
  
          // Fetch variables and set to root
          res = await ThemeServices.getVariables()
          if (res.variables)
            for await (let variable of res.variables.data) {
              root.style.setProperty(variable.variable, variable.value);
            }
  
          // Append custom styles to document head
          appendCustomStyles();
  
          // Fetch custom CSS and append to document head
          res = await ThemeServices.getCss();
          if (res.css) {
            const style = document.createElement('style');
            style.textContent = res.css;
            document.head.appendChild(style);
          }
  
          resolve(true);
        } catch (e) {
          reject(e?.message);
        }
      })
    }
  
    // useEffect hook to load CSS styles and call onLoad function when _id changes
    useEffect(() => {
  
      if (_id)
        loadCSSStyles().then((status) => {
          onLoad({ _id }, type, document);
        }).catch((e) => {
  
          message.error(e?.message || 'Something went wrong!');
        });
      else
        onLoad(null, '', document);
    }, [_id]);
  
  
    return children;
  };

// ShadowRootComponent is a wrapper component that provides a shadow root for its children
const ShadowRootComponent = ({ children }) => {
    // const rootRef = useRef();
  
    // useEffect(() => {
    //   if (rootRef.current) {
    //     if (!rootRef.current.shadowRoot) {
    //       const shadowRoot = rootRef.current.attachShadow({ mode: 'open' });
    //       ReactDOM.render(children, shadowRoot);
    //     } else {
    //       ReactDOM.render(children, rootRef.current.shadowRoot);
    //     }
    //   }
    // }, [children]);
  
    return children //<div style={{height: '100%', width: '100%'}} ref={rootRef} />;
  };

// Preview iframe component
export default function PreviewIFrame({
    _id,
    pageType,
    loading,
    children,
    onLoad, }) {
    const iframeRef = useRef();
    const [container, setConainer] = useState(null);
    useEffect(() => {
        if (!iframeRef.current)
            return;
        const iframe = iframeRef.current;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeWindow = iframe.contentWindow;
        setConainer({ window: iframeWindow, mountTarget: iframeDocument.body, document: iframeDocument });
    }, [iframeRef.current])
    return <ShadowRootComponent>
        <iframe frameBorder={0} id="ac-editor-iframe-preview-doc"
            width="100%"
            height="95%" ref={iframeRef}>
            {container && ReactDOM.createPortal(<InnerComponent
                _id={_id} type={pageType}
                onLoad={onLoad}
                document={container.document}>
                {!loading ? children : <p>Loading...</p>}
            </InnerComponent>, container.mountTarget)}
        </iframe>
    </ShadowRootComponent>
}
