
import React, { useState, useEffect, useRef } from 'react';
import { message, theme } from 'antd';
import ReactDOM from 'react-dom';

import ThemeServices from '../../lib/services/theme';
import SettingServices from '../../lib/services/setting'

const InnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadCSSStyles().then((_id) => {
      onLoad(_id);
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });

  }, []);

  const loadCSSStyles = async () => {
    return new Promise(async (resolve, reject) => {

      try {

        const settingRes = await SettingServices.get();
        if (settingRes?.setting)
          document.head.insertAdjacentHTML("beforeend", settingRes.setting.scripts?.head);



        let res = await ThemeServices.getFonts();

        if (res.fonts)
          res.fonts.data.forEach(async (font) => {
            const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;

            if (isGoogleFont && src) {
              const linkElement = document.createElement('div');
              linkElement.id = 'google-font-' + _uid;
              linkElement.innerHTML = src;
              document.head.appendChild(linkElement);
            }
            else
              if (Array.isArray(fontSrc)) {
                try {

                  for (const src of fontSrc) {

                    const fontFace = new FontFace(fontFamily, `url(${src.src}) format('${src.format}')`);
                    await fontFace.load();
                    document.fonts.add(fontFace);


                  }
                } catch (error) {
                  message.error(`Failed to load ${fontFamily} font: ${error}`);
                }
              }
          });


        document.fonts.onloadingerror = () => {
        };



        document.fonts.ready.then(async function () {

        });
        const root = document.documentElement;

        if (res.fonts)
          for await (let font of res.fonts.data) {
            console.log(font)
            root.style.setProperty(font.variable, font.fontFamily);
          }
        res = await ThemeServices.getColors()

        if (res.colors)
          for await (let color of res.colors.data) {
            root.style.setProperty(color.variable, color.color);
          }

        res = await ThemeServices.getVariables()

        if (res.variables)
          for await (let variable of res.variables.data) {
            root.style.setProperty(variable.variable, variable.value);
          }


        res = await ThemeServices.getCss();
        let style = document.createElement('style');
        style.id = 'ac-stylesheet-global'
        if (res.css) {
          style.textContent = res.css;
        }
        document.head.appendChild(style);

        resolve(settingRes.setting?._id);


      } catch (e) {
        reject(e?.message);
      }
    })
  }


  return children;


};

const ShadowRootComponent = ({ children }) => {
  const rootRef = useRef();

  return children;
};


export default function IFrame({ children, onLoad }) {

  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



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



const AnimationsInnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadallAnimations().then((_id) => {
       onLoad(_id);
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, []);


  const loadallAnimations = async () => {

    return new Promise(async (resolve, reject) => {

      try {


        let style = document.createElement('style');

        const res = await ThemeServices.getAnimationsCss();

        style.id = 'ac-stylesheet-global'
        if (res.css) {
          style.textContent = res.css;
        }
        document.head.appendChild(style);
        console.log(res)
        resolve(res._id)
        

      } catch (e) {
        reject(e?.message, "Sdsd");
      }

    })


  }


  return children;


};



export function AnimationsIFrame({ children, onLoad }) {

  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



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

