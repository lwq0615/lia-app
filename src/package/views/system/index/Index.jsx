import UserInfo from "./UserInfo";


export default function Index(props){

  return (
    <section className="system-index">
      <UserInfo {...props}/>
    </section>
  )
}
