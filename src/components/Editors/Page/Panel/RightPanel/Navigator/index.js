import Elements, { InlineSkeleton } from './Elements';
import { useMemo } from 'react';


export default function Page({ page, pageUpdated, onClickElement, node, onMove, onDelete, onCopy, onAdd }) {

    const memoizedPage = useMemo(() => {
        return pageUpdated ? <Elements _id={page._id} pageUpdated={pageUpdated}   
        onDelete={onDelete}
        node={node}
        onCopy={onCopy} onAdd={onAdd}
        onClickElement={onClickElement}
        onMove={onMove}/> : <InlineSkeleton />
    }, [page, node, pageUpdated]);

    return <>
        {memoizedPage}

    </>


}