

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { message } from 'antd';

import ThemeServices from '../../../..//lib/services/theme';
import SettingServices from '../../../../lib/services/setting';


const InnerComponent = ({ children, document, onLoad, _id, type }) => {


    useEffect(() => {


        if (!_id)
            return;

        loadCSSStyles().then((status) => {
            console.log({ _id }, type)
            onLoad({ _id }, type, document);

        }).catch((e) => {
            message.error(e?.message || 'Something went wrong!');
        });

    }, [_id]);

    const loadCSSStyles = async () => {
        return new Promise(async (resolve, reject) => {

            try {

                let res = await SettingServices.get();
                if (res?.setting)
                    document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);



                res = await ThemeServices.getFonts();

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

                                    const styleElement = document.createElement('style');
                                    styleElement.textContent = '';

                                    for (const src of fontSrc) {
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
                    });

                const root = document.documentElement;

                if (res.fonts)
                    for await (let font of res.fonts.data) {
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



                let style = document.createElement('style');


                style.textContent = `
    

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
        
        `

                document.head.appendChild(style);

                res = await ThemeServices.getCss();

                if (res.css) {
                    style = document.createElement('style');
                    style.textContent = res.css;
                    document.head.appendChild(style);
                }



                resolve(true);

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
                {!loading ? children : <p>Laoding...</p>}
            </InnerComponent>, container.mountTarget)}

        </iframe>

    </ShadowRootComponent>
}

