import React, { useEffect, useRef, useState } from 'react';
import { arrayUnion, collection, doc, endAt, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc } from "firebase/firestore";
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/userStore';

const AddUserModal = () => {
	const [inputVal, setInputVal] = useState('');
	const [users, setUsers] = useState([]);
	const searchTimeoutRef = useRef(null);
	const [adding, setAdding] = useState(false);
	const { currentUser } = useUserStore();
	const [addedUserIds, setAddedUserIds] = useState(new Set());

	useEffect(() => {
		// Fetch the current user's chat list to see which users are already added
		const fetchAddedUsers = async () => {
			try {
				const userChatRef = doc(db, "userChats", currentUser.id);
				const userChatDoc = await getDoc(userChatRef);
				if (userChatDoc.exists()) {
					const chats = userChatDoc.data().chats || [];
					// Store already added user IDs in a Set for quick lookup
					const userIds = new Set(chats.map(chat => chat.receiverId));
					setAddedUserIds(userIds);
				}
			} catch (error) {
				console.log("Error fetching user's chats:", error);
			}
		};

		fetchAddedUsers();
	}, [currentUser.id]);

	const handleSearch = async () => {
		if (!inputVal) return setUsers([]);

		try {
			const userRef = collection(db, "users");
			const lowerInputVal = inputVal.trim().toLowerCase();
			const q = query(
				userRef,
				orderBy('usernameLower'),
				startAt(lowerInputVal),
				endAt(lowerInputVal + '\uf8ff'),
				// limit(5)
			);

			const querySnapShot = await getDocs(q);
			const Users = querySnapShot.docs
				.map(doc => ({ id: doc.id, ...doc.data() }))
				.filter(user => user.id !== currentUser.id);
			setUsers(Users);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChange = (e) => {
		setInputVal(e.target.value);

		clearTimeout(searchTimeoutRef.current);
		searchTimeoutRef.current = setTimeout(() => {
			handleSearch();
		}, 100);
	};

	const handleAdd = async (u) => {
		const chatRef = collection(db, 'chats');
		const userChatsRef = collection(db, 'userChats');
		setAdding(true);

		try {
			const newChatRef = doc(chatRef);

			await setDoc(newChatRef, {
				createdAt: serverTimestamp(),
				messages: [],
			});

			await updateDoc(doc(userChatsRef, u.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: currentUser.id,
					updatedAt: Date.now()
				})
			});

			await updateDoc(doc(userChatsRef, currentUser.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: u.id,
					updatedAt: Date.now()
				})
			});

			// Add the user ID to the Set after adding them to the chat list
			setAddedUserIds(prev => new Set(prev).add(u.id));

		} catch (error) {
			console.log(error);
		} finally {
			setAdding(false);
		}
	};

	return (
		<div>
			<dialog id="AddUserModal" className="modal modal-middle">
				<div className="modal-box">
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<h3 className="font-bold text-lg">Add User</h3>
					<div className="flex mt-5 justify-center items-center w-full gap-3">
						<label className="input input-bordered flex items-center gap-2 flex-1">
							<input
								type="text"
								className="grow"
								id='addUserSearchInput'
								placeholder="Search"
								value={inputVal}
								onChange={handleChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSearch()
									}

								}}
								autoFocus
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
						<div className="btn btn-primary" onClick={handleSearch}>Search</div>
					</div>

					<div className="flex flex-col gap-4 mt-5">
						{users.map((u, index) => (
							<div key={index} className="flex flex-row justify-between items-center gap-3 w-full px-5">
								<div className="user flex gap-3 items-center justify-center font-bold text-xl">
									<div className="rounded-full w-10 h-10 flex justify-center items-center overflow-hidden">
										<img src={u.avatar} alt="" className="object-cover h-full w-full" />
									</div>
									<h2>{u.username}</h2>
								</div>
								<div
									className={`btn ${addedUserIds.has(u.id) ? "btn-disabled" : "btn-success"} ${adding ? "btn-disabled" : ""}`}
									onClick={() => {
										if (!addedUserIds.has(u.id)) handleAdd(u);
									}}
								>
									{addedUserIds.has(u.id) ? "Added" : !adding ? "Add" : "Adding"}
								</div>
							</div>
						))}
					</div>
				</div>
			</dialog >
		</div >

	);
};

export default AddUserModal;
