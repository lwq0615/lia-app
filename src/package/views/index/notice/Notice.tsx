import { useEffect, useRef, useState} from "react"
import Publish from "./Publish"
import './notice.scss'
import { hasAuth } from "@/package/request/system/auth"



export default function Notice() {

  const [canPubilsh, setCanPubilsh] = useState<boolean>(false)

  useEffect(() => {
    hasAuth("system:notice:add").then(res => {
      setCanPubilsh(res as any)
    })
  }, [])

  return (
    <div className="index-notice">
      <h3 className='title'>
        通知/公告
        { canPubilsh && <Publish /> }
      </h3>
    </div>
  )
}