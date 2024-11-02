import { FaceSmileIcon } from '@heroicons/react/16/solid';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../../lib/chatStore';
import { useUserStore } from '../../../lib/userStore';
import { db } from '../../../lib/firebase';

const MessageInput = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const emojiPickerRef = useRef(null);
	const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, } = useChatStore()
	const { currentUser } = useUserStore()


	const handleSend = async () => {
		if (message === "") return;

		try {
			await updateDoc(doc(db, "chats", chatId), {
				messages: arrayUnion({
					senderId: currentUser.id,
					message,
					createdAt: new Date(),
				})
			})

			const userIds = [currentUser.id, user.id]

			userIds.forEach(async (id) => {
				const userChatRef = doc(db, "userChats", id)
				const userChatsSnapshot = await getDoc(userChatRef)

				if (userChatsSnapshot.exists()) {
					const userChatsData = userChatsSnapshot.data()

					const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

					userChatsData.chats[chatIndex].lastMessage = message;
					userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
					userChatsData.chats[chatIndex].updatedAt = Date.now();

					await updateDoc(userChatRef, {
						chats: userChatsData.chats
					})
				}
			})


		} catch (error) {
			console.log(error)
		} finally {
			setMessage('')
		}
	}

	const handleEmojiClick = (e) => {
		setMessage((prevMessage) => prevMessage + e.emoji);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [emojiPickerRef]);

	const handleEmojiIconClick = (e) => {
		e.stopPropagation();
		setOpen((prev) => !prev);
	};

	return (
		<div className='w-full flex p-3 gap-4 items-center '>
			<div className="icons gap-3 flex justify-center items-center relative">
				<FaceSmileIcon className='h-6 w-6 cursor-pointer' onClick={handleEmojiIconClick} />
				{open && (
					<div ref={emojiPickerRef} className='absolute bottom-12 left-0'>
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}
			</div>
			<div className="messageInput flex-1">
				<input
					type="text"
					placeholder="Type a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="input input-bordered w-full"
					onKeyDown={(e) => {
						if (e.key == 'Enter') {
							handleSend()
						}
					}}
				/>
			</div>
			<button className={`btn btn-success ${isCurrentUserBlocked || isReceiverBlocked ? "btn-disabled" : ""}`} onClick={handleSend}>Send</button>
		</div>
	);
};

export default MessageInput;
