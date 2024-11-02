import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';
import { useUserStore } from '../../../lib/userStore';

const ChatBox = () => {
	const endRef = useRef(null)
	const [chats, setChats] = useState()
	const { chatId } = useChatStore()
	const { currentUser } = useUserStore()

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [])

	useEffect(() => {

		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChats(res.data())
		})


		return unSub

	}, [chatId])

	return (
		<div className='flex flex-col p-4 overflow-y-scroll flex-grow md:h-full'>
			{chats &&
				chats.messages.map((message, index) => (
					<div className={`chat ${message.senderId === currentUser?.id ? "chat-end" : "chat-start"}`} key={index}>
						<div className="chat-bubble chat-bubble-primary">
							<div>{message.message}</div>
							<div className="text-xs text-gray-500 mt-1">{message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
						</div>
					</div>

				))
			}

			<div className="end" ref={endRef}></div>
		</div>
	);
};

export default ChatBox;
