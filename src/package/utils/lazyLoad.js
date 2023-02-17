import React, { Suspense } from "react"



// 组件懒加载
export default function lazyLoad(imp, Loading) {
  if(!Loading){
    Loading = () => <div></div>
  }
  const LazyElement = React.lazy(imp);
  return (
    <Suspense fallback={<Loading />}>
      <LazyElement />
    </Suspense>
  );
}