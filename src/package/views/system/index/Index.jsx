import UserInfo from "./UserInfo";
import Notice from "./Notice";


export default function Index(props) {

  return (
    <section className="system-index">
      <UserInfo {...props} />
      <div className="index-body">
        <div className="index-left"></div>
        <div className="index-right">
          <Notice/>
        </div>
      </div>
    </section>
  )
}
