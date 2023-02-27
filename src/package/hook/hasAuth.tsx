import { useEffect, useState } from "react";
import { hasAuth } from "../request/system/auth";



/**
 * @param key 权限key
 * @returns 返回当前用户是否有接口或组件的访问权限
 */
export default function useHasAuth(key: string) {

  const [can, setCan] = useState<boolean>(false)

  useEffect(() => {
    hasAuth(key).then(res => {
      setCan(res as any)
    })
  }, [])

  return can

}