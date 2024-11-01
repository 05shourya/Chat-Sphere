import React, { useEffect } from 'react'
import List from '../components/custom/list/List'
import Chat from '../components/custom/chat/Chat'
import Detail from '../components/custom/detail/Detail'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../lib/userStore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useChatStore } from '../lib/chatStore'

const MainPage = () => {
	const navigate = useNavigate()
	const { chatId } = useChatStore()
	const { currentUser, isLoading, fetchUserInfo, clearUser } = useUserStore()
	useEffect(() => {

		const unSub = onAuthStateChanged(auth, async (user) => {
			if (user) {
				await fetchUserInfo(user?.uid)
			} else {
				clearUser()
			}
		})
		return unSub;

	}, [])



	if (isLoading) {
		return (
			<>
				<h1>Loading</h1>
			</>
		)
	}

	if (!currentUser) {
		return (
			<>
				<button className="btn btn-primary" onClick={() => { navigate('/signin') }}>Sign in</button>
			</>
		)
	}

	return (
		currentUser &&
		<div className="w-[100vw] h-[100vh] flex">
			<List />
			{chatId && <Chat />}
			{chatId && <Detail />}
		</div>
	)
}

export default MainPage