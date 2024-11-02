import React from 'react'
import { useChatStore } from '../../../lib/chatStore'

const UserDetails = () => {
	const { user } = useChatStore()
	return (
		<div className='flex flex-col gap-4 justify-center items-center py-8 w-full'>
			<div className="avatar">
				<div className="w-52 rounded-full">
					<img src={user?.avatar || "profile/profile.jpg"} />
				</div>
			</div>
			<h1 className='font-bold text-3xl'>{user?.username || "User"}</h1>
		</div>
	)
}

export default UserDetails