import Elements, { InlineSkeleton } from "./Elements";
import { useMemo } from "react";

export default function Page({ page, pageType, preview, loading }) {
  const memoizedPage = (
    <Elements _id={page._id} pageType={pageType} preview={preview} loading={loading} />
  );

  return <>{memoizedPage}</>;
}
