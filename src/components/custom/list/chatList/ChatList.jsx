import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid'
import React, { useEffect, useState } from 'react'
import ChatTile from './ChatTile'
import { db } from '../../../../lib/firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useUserStore } from '../../../../lib/userStore'
import AddUserModal from './AddUserModal'

const ChatList = () => {
	const [addMode, setAddMode] = useState(true)
	const [chats, setChats] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const { currentUser } = useUserStore()

	useEffect(() => {
		const unsub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
			const items = res.data().chats;
			const promises = items.map(async (item) => {
				const userDocRef = doc(db, "users", item.receiverId);
				const userDocSnap = await getDoc(userDocRef);

				const user = userDocSnap.data()

				return { ...item, user }
			})

			const chatData = await Promise.all(promises)

			setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
		});
		return unsub;
	}, [currentUser.id])

	const filteredChats = chats.filter(chat =>
		chat.user.username.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div>
			<div className="flex justify-between items-center gap-5 pr-3 pl-1">
				<label className="input input-bordered flex items-center gap-2 flex-[2]">
					<input
						type="text"
						className="grow"
						placeholder="Search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="h-4 w-4 opacity-70">
						<path
							fillRule="evenodd"
							d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
							clipRule="evenodd" />
					</svg>
				</label>
				<button className="btn btn-square btn-outline" onClick={() => {
					setAddMode(prev => !prev)
					document.getElementById('AddUserModal').showModal()
					document.getElementById('addUserSearchInput').focus()
				}}>
					<PlusIcon className='h-7 w-7 ' />
				</button>
			</div>
			<div className="chatTileList flex flex-col mt-5 ">
				{
					filteredChats.map((chat, index) => (
						<ChatTile key={index} name={chat.user.username} subtitle={chat.lastMessage} avatar={chat.user.avatar || "/profile/profile.jpg"} chat={chat} chats={chats} />
					))
				}
			</div>
		</div>
	)
}

export default ChatList
