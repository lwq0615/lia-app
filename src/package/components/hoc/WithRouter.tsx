import { useNavigate, useLocation, useLoaderData, useParams } from 'react-router-dom'
import React from 'react';
import { useRouterListen } from '@/package/hook/routerHooks'


export default (Component: React.FC | typeof React.Component): React.FC => {
  return (props: any) => (
    <Component
      {...props}
      navigate={useNavigate()}
      location={useLocation()}
      loaderData={useLoaderData()}
      params={useParams()}
      useRouterListen={useRouterListen}
    />
  )
}