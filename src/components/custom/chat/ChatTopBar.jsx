import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid"
import { useChatStore } from "../../../lib/chatStore"
import { useMobileViewStore } from "../../../lib/mobileViewStore"

const ChatTopBar = () => {
	const { user } = useChatStore()
	const { changeView } = useMobileViewStore()
	return (
		<div className="topBar gap-6 flex flex-row border-b border-current p-3 items-center justify-start">
			<ArrowUturnLeftIcon className="w-8 md:hidden cursor-pointer" onClick={() => {
				changeView('list')
			}} />
			<div className="userInfo flex " onClick={() => {
				changeView('detail')
			}}>
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