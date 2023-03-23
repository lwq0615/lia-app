import UserInfo from "./UserInfo";
import Notice from "./notice/Notice";
import System from "./system/System";


export default function Index() {

  return (
    <section className="system-index">
      <UserInfo />
      <div className="index-body">
        <div className="index-left">
          <System/>
        </div>
        <div className="index-right">
          <Notice/>
        </div>
      </div>
    </section>
  )
}
