import React, { Suspense } from "react"



// 组件懒加载
export default function lazyLoad(imp, Loading) {
  const LazyElement = React.lazy(imp);
  return (
    <Suspense fallback={Loading && <Loading />}>
      <LazyElement />
    </Suspense>
  );
}