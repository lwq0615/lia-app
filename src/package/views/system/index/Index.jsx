import UserInfo from "./UserInfo";
import Notice from "./Notice";


export default function Index() {

  return (
    <section className="system-index">
      <UserInfo />
      <div className="index-body">
        <div className="index-left"></div>
        <div className="index-right">
          <Notice/>
        </div>
      </div>
    </section>
  )
}
