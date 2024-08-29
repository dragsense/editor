import Elements, { InlineSkeleton } from './Elements';
import { useMemo } from 'react';


export default function Page({ page, pageType, pageUpdated, onUpdateStates, loading }) {



    const memoizedPage = useMemo(() => {
        return pageUpdated ? <Elements
            _id={page._id}
            pageType={pageType}
            onUpdateStates={onUpdateStates}
            pageUpdated={pageUpdated}
            loading={loading} /> : <InlineSkeleton />
    }, [page, pageUpdated]);

    return <>
        {memoizedPage}
    </>

}