import Style from "./Style";

export default function StyleEditor({ children, onBack, host, isStyleEditor = false }) {
    return  <><Style onBack={onBack} host={host} isStyleEditor={isStyleEditor}>{children}</Style> </>
}