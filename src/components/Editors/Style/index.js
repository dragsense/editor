import Style from "./Style";


export default function StyleEditor({ children, onBack }) {
    return  <><Style onBack={onBack}>{children}</Style> </>
}