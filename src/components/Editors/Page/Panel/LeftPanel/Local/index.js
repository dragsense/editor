
import { Elements } from "./Elements";


export function ElementsComponent({ state, dispatch, pageId}) {

    return pageId && <Elements state={state} dispatch={dispatch} pageId={pageId}/>
};



