import Publish from "./Publish"
import './notice.scss'
import useHasAuth from "@/package/hook/hasAuth"



export default function Notice() {

  const canPubilsh = useHasAuth("system:notice:add")

  return (
    <div className="index-notice">
      <h3 className='title'>
        通知/公告
        { canPubilsh && <Publish /> }
      </h3>
    </div>
  )
}