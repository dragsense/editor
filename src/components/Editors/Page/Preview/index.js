import Elements, { InlineSkeleton } from "./Elements";
import { useMemo } from "react";

export default function Page({ page, preview, loading }) {
  const memoizedPage = (
    <Elements _id={page._id} preview={preview} loading={loading} />
  );

  return <>{memoizedPage}</>;
}
