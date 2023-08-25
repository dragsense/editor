
import { Pages } from "./Pages";


export function PageComponent({ type,page, onEdit }) {

    return <Pages type={type} selectedPage={page} onEdit={onEdit}/>
};



