import ChatBox from "./ChatBox"
import ChatTopBar from "./ChatTopBar"
import MessageInput from "./MessageInput"

const Chat = () => {
	return (
		<div className={"flex-[2] flex flex-col border-current border-x"}>
			<ChatTopBar />
			<ChatBox />
			<MessageInput />
		</div>
	)
}

export default Chat