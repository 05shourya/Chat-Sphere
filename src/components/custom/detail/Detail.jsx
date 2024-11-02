import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useChatStore } from "../../../lib/chatStore"
import { auth, db } from "../../../lib/firebase"
import UserDetails from "./UserDetails"
import { useUserStore } from "../../../lib/userStore"
import { useMobileViewStore } from "../../../lib/mobileViewStore"
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid"
import { useEffect } from "react"

const Detail = () => {
	const { user, clearInfo, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
	const { currentUser } = useUserStore()
	const { changeView } = useMobileViewStore()
	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'sunset'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])
	const handleBlock = async () => {
		if (!user) return;
		const userDocRef = doc(db, "users", currentUser.id)

		try {

			await updateDoc(userDocRef, {
				blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
			})

			changeBlock()

		} catch (error) {
			console.log(error)
		}


	}
	return (
		<div className="flex-1 flex flex-col items-center px-5 pb-5 overflow-scroll justify-center gap-6">
			<UserDetails />
			<div className="flex gap-5 w-full justify-center flex-col">
				<button className="btn btn-accent md:hidden" onClick={() => {
					changeView('chat')
				}}>
					<ArrowUturnLeftIcon className="w-6 md:hidden cursor-pointer" />
					Back to Chat
				</button>
				<button
					className={`btn text-black flex-1 ${isReceiverBlocked ? "btn-error" : "bg-red-500 hover:bg-red-600"}`}
					onClick={handleBlock}
				>
					{
						isReceiverBlocked ? "Unblock " : "Block " + (user?.username || "user")
					}
				</button>
				<button className="btn btn-warning flex-1" onClick={() => {
					auth.signOut()
					clearInfo()

				}}>Sign out</button>
			</div>
			{isCurrentUserBlocked && (
				<p className="text-xl">
					You are Blocked!
				</p>
			)}
		</div>

	)
}

export default Detail