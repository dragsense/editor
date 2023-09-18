import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import ThemeServices from '../../../..//lib/services/theme';
import SettingServices from '../../../../lib/services/setting';

// Function to load CSS styles
const loadCSSStyles = async () => {
    try {
        let res = await SettingServices.get();
        if (res?.setting) {
            document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);
            document.body.insertAdjacentHTML("beforeend", res.setting.scripts?.footer);
        }
        res = await ThemeServices.getFonts();
        loadFonts(res);
        const root = document.documentElement;
        loadFontStyles(res, root);
        res = await ThemeServices.getColors();
        loadColorStyles(res, root);
        res = await ThemeServices.getVariables();
        loadVariableStyles(res, root);
        let style = document.createElement('style');
        style.textContent = getAnimationStyles();
        document.head.appendChild(style);
        res = await ThemeServices.getCss();
        if (res.css) {
            style = document.createElement('style');
            style.textContent = res.css;
            document.head.appendChild(style);
        }
        return true;
    } catch (e) {
        throw new Error(e?.message);
    }
}

// Function to load fonts
const loadFonts = (res) => {
    if (res.fonts)
        res.fonts.data.forEach(loadFont);
}

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

// Function to load font styles
const loadFontStyles = async (res, root) => {
    if (res.fonts)
        for await (let font of res.fonts.data) {
            root.style.setProperty(font.variable, font.fontFamily);
        }
}

// Function to load color styles
const loadColorStyles = async (res, root) => {
    if (res.colors)
        for await (let color of res.colors.data) {
            root.style.setProperty(color.variable, color.color);
        }
}

// Function to load variable styles
const loadVariableStyles = async (res, root) => {
    if (res.variables)
        for await (let variable of res.variables.data) {
            root.style.setProperty(variable.variable, variable.value);
        }
}

// Function to get animation styles
const getAnimationStyles = () => {
    return `
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
}

// Inner component
const InnerComponent = ({ children, document, onLoad, _id, type }) => {
    useEffect(() => {
        if (!_id)
            return;
        loadCSSStyles().then((status) => {
            onLoad({ _id }, type, document);
        }).catch((e) => {
            message.error(e?.message || 'Something went wrong!');
        });
    }, [_id]);
    return children;
};

// ShadowRootComponent is a wrapper component that provides a shadow root for its children
const ShadowRootComponent = ({ children }) => {
    const rootRef = useRef();

    useEffect(() => {
        if (rootRef.current) {
            const shadowRoot = rootRef.current.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(children);
        }
    }, [children]);

    return <div ref={rootRef} />;
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
