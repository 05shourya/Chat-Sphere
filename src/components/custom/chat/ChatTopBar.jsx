import { useChatStore } from "../../../lib/chatStore"

const ChatTopBar = () => {
	const { user } = useChatStore()
	return (
		<div className="topBar flex flex-row border-b border-current p-3 items-center justify-between">
			<div className="userInfo flex ">
				<div className="avatar cursor-pointer">
					<div className="w-12 rounded-full">
						<img src={user?.avatar || "/profile/profile.jpg"} alt="Avatar" />
					</div>
				</div>
				<div className="ml-4">
					<h2 className="font-semibold text-lg">{user?.username || "User"}</h2>
					<p className="text-sm text-gray-500">Hello there! I am using chatsphere</p>
				</div>
			</div>
		</div>
	)
}

export default ChatTopBar