import Elements, { InlineSkeleton } from './Elements';
import { useMemo } from 'react';


export default function Page({ page, pageUpdated, onUpdateStates, loading }) {

    const memoizedPage = useMemo(() => {
        return pageUpdated ? <Elements _id={page._id} onUpdateStates={onUpdateStates}  pageUpdated={pageUpdated} loading={loading} /> : <InlineSkeleton />
    }, [page, pageUpdated]);

    return <>
        {memoizedPage}

    </>


}