import Elements, { InlineSkeleton } from './Elements';
import { useMemo } from 'react';


export default function Page({ page }) {

    const memoizedPage = useMemo(() => {
        return <Elements _id={page._id} />
    }, [page]);

    return <>
        {memoizedPage}

    </>


}