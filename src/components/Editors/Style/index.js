import Style from "./Style";

export default function StyleEditor({ children, onBack, host }) {
    return  <><Style onBack={onBack} host={host}>{children}</Style> </>
}