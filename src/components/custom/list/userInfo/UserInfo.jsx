import { useUserStore } from "../../../../lib/userStore";
import { useChatStore } from "../../../../lib/chatStore";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";

const UserInfo = () => {
	const { currentUser } = useUserStore()
	const { chatId, clearInfo } = useChatStore()
	const themes = ['bumblebee', 'dark', 'cupcake', 'synthware', 'forest', 'black', 'coffee', 'sunset']
	return (
		<div className="mt-5 flex items-center justify-between px-3">
			<div className="user flex gap-3 items-center justify-center font-bold text-2xl">
				<div className="rounded-full w-14 h-14 flex justify-center items-center overflow-hidden">
					<img src={currentUser.avatar} alt="" className="object-cover h-full w-full" />
				</div>
				<h2>{currentUser.username}</h2>
			</div>
			<div className="flex items-center gap-5 ">
				<div className="dropdown mb-0">
					<div
						tabIndex="0"
						role="button"
						className="btn m-1"
					>
						Themes
						<svg
							width="12px"
							height="12px"
							className="inline-block h-2 w-2 fill-current opacity-60"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 2048 2048"
						>
							<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
						</svg>
					</div>
					<ul tabIndex="0" className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
						{themes.map((t, index) => (
							<li key={index}>
								<input
									key={index}
									type="radio"
									name="theme-dropdown"
									className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
									aria-label={t}
									value={t}
									onChange={(e) => { localStorage.setItem('theme', e.target.value) }}
								/>
							</li>
						))}
					</ul>
				</div>
				{(!chatId || window.innerWidth < 768) && (
					<button
						className="btn btn-warning"
						onClick={() => {
							signOut(auth);
							clearInfo();
						}}
					>
						Sign out
					</button>
				)}
			</div>

		</div>
	);
};

export default UserInfo;