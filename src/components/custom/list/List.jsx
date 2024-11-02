import ChatList from "./chatList/ChatList"
import UserInfo from "./userInfo/UserInfo"

const List = () => {
	return (
		<div className={"flex-1 flex flex-col gap-7 "}>
			<UserInfo />
			<ChatList />
		</div>
	)
}

export default List