import { useEffect } from "react"
import ChatList from "./chatList/ChatList"
import UserInfo from "./userInfo/UserInfo"

const List = () => {

	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'sunset'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])
	return (
		<div className={"flex-1 flex flex-col gap-7 h-[100vh] "}>
			<UserInfo />
			<ChatList />
		</div>
	)
}

export default List