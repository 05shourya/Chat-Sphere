import { useChatStore } from "../../../../lib/chatStore";
import { useUserStore } from "../../../../lib/userStore";
import { db } from "../../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useMobileViewStore } from "../../../../lib/mobileViewStore";

const ChatTile = ({ name, subtitle, avatar, chat, chats }) => {
	const { changeChat } = useChatStore()
	const { currentUser } = useUserStore()
	const { changeView } = useMobileViewStore()

	const handleSelect = async (chat) => {
		changeChat(chat.chatId, chat.user)
		changeView('chat')

		const userChats = chats.map((item) => {
			const { user, ...rest } = item
			return rest
		})


		const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
		userChats[chatIndex].isSeen = true;

		const userChatsRef = doc(db, "userChats", currentUser.id)

		try {
			await updateDoc(userChatsRef, {
				chats: userChats,
			})
		} catch (error) {
			error
		}

	}


	return (
		<div className="flex items-center p-4 border-b border-current cursor-pointer duration-500 hover:bg-opacity-20 hover:bg-accent" onClick={() => handleSelect(chat)}>
			<div className="avatar">
				<div className="w-12 rounded-full">
					<img src={avatar} alt="Avatar" />
				</div>
			</div>
			<div className={`ml-4 ${chat.isSeen === false ? "font-extrabold" : ""}`}>
				<h2 className={`${chat.isSeen === false ? "font-extrabold" : "font-semibold"} text-lg`}>{name}</h2>
				<p className="text-sm text-gray-500">{subtitle}</p>
			</div>
		</div >
	);
};

export default ChatTile