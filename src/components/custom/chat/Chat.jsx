import { useEffect } from "react"
import ChatBox from "./ChatBox"
import ChatTopBar from "./ChatTopBar"
import MessageInput from "./MessageInput"

const Chat = () => {
	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'sunset'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])
	return (
		<div className={"flex-[2] flex flex-col border-current border-x h-[100vh]"}>
			<ChatTopBar />
			<ChatBox />
			<MessageInput />
		</div>
	)
}

export default Chat