import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase'
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import upload from '../../../lib/upload';
import Notification from '../notification/Notification';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

const Login = ({ isLoggingIn }) => {
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isMatching, setIsMatching] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'sunset'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		checkMatch(e.target.value, confirmPassword);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		checkMatch(password, e.target.value);
	};

	const checkMatch = (password, confirmPassword) => {
		setIsMatching(password === confirmPassword);
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			setImage(URL.createObjectURL(file));
		} else {
			alert("Please select a valid image file");
		}
	};

	const toastErrors = (error) => {
		console.log(error)
		switch (error.code) {
			case "auth/invalid-email":
				toast.error("Invalid email format. Please check and try again.");
				break;
			case "auth/email-already-in-use":
				toast.warn("An account with this email already exists. Please sign in.");
				break;
			case "auth/weak-password":
				toast.error("Password should be at least 6 characters long.");
				break;
			case "auth/network-request-failed":
				toast.warn("Network error. Please check your connection and try again.");
				break;
			case "auth/operation-not-allowed":
				toast.warn("Email/password sign-up is disabled. Please contact support.");
				break;
			case "auth/too-many-requests":
				toast.warn("Too many attempts. Please wait and try again later.");
				break;
			case "auth/internal-error":
				toast.error("Internal server error. Please try again later.");
				break;
			case "auth/user-disabled":
				toast.warn("This account has been disabled. Please contact support.");
				break;
			case "auth/user-not-found":
				toast.warn("No account found with this email. Please sign up.");
				break;
			case "auth/wrong-password":
				toast.error("Incorrect password. Please try again.");
				break;
			case "auth/invalid-credential":
				toast.error("Invalid email or password.");
				break;
			default:
				toast.warn("An unknown error occurred. Please try again.");
		}

	}

	const handleSignup = async (e) => {
		e.preventDefault();
		if (!isMatching) {
			return toast.error("Passwords do not match")
		}

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const { username, email, password, profile } = Object.fromEntries(formData.entries());
		const usernameLower = username.toLowerCase();

		try {
			const usersRef = collection(db, "users");
			const usernameQuery = query(usersRef, where("usernameLower", "==", usernameLower));
			const querySnapshot = await getDocs(usernameQuery);

			if (!querySnapshot.empty) {
				toast.error("Username is already taken. Please choose a different one.");
				setLoading(false);
				return;
			}

			const res = await createUserWithEmailAndPassword(auth, email, password);
			const imgUrl = await upload(profile);

			await setDoc(doc(db, "users", res.user.uid), {
				username,
				email,
				avatar: imgUrl,
				id: res.user.uid,
				blocked: [],
				usernameLower
			});

			await setDoc(doc(db, "userChats", res.user.uid), {
				chats: []
			});

			toast.success("Account Created");
			navigate("/signin");
		} catch (error) {
			toastErrors(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSignin = async e => {
		e.preventDefault()
		setLoading(true)
		const formData = new FormData(e.currentTarget)
		const { email, password } = Object.fromEntries(formData.entries())

		try {

			await signInWithEmailAndPassword(auth, email, password)
			toast.success("Successfully Signed in")
			navigate('/')

		} catch (error) {
			toastErrors(error)

		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Notification />
			{loading && (
				<div className="fixed inset-0 flex items-center justify-center bg-white-200 bg-opacity-60 backdrop-blur-md z-50">
					<span className="loading loading-ring w-24"></span>
				</div>
			)}

			<div className="card gap-5 p-10 px-20 ">
				<h2 className="text-2xl font-semibold text-center mb-5">{isLoggingIn ? "Sign in" : "Create Account"}</h2>

				<form onSubmit={isLoggingIn ? handleSignin : handleSignup}>
					{!isLoggingIn && <div className="flex justify-center items-center flex-col gap-6 mb-6">
						<div className="avatar relative">
							<div className={"w-32 h-32 rounded-full overflow-hidden " + (!image ? "border" : "")}>
								{image ? (
									<img src={image} alt="Preview" className="object-cover w-full h-full" />
								) : (
									<div className="flex items-center justify-center w-full h-full text-gray-400">
										Upload Profile
									</div>
								)}
							</div>

							<input
								name='profile'
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="absolute inset-0 opacity-0 cursor-pointer"
								required
							/>
						</div>
					</div>}

					<label className="input input-bordered flex items-center gap-2 mb-4 min-w-[20vw]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-5 w-5 opacity-70">
							<path
								d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
							<path
								d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
						</svg>
						<input name='email' type="email" className="grow" placeholder="Email" required />
					</label>

					{!isLoggingIn && <label className="input input-bordered flex items-center gap-2 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-5 w-5 opacity-70">
							<path
								d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
						</svg>
						<input name='username' type="text" className="grow" placeholder="Username" required />
					</label>}

					<label className="input input-bordered flex items-center gap-2 mb-6">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-5 w-5 opacity-70">
							<path
								fillRule="evenodd"
								d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
								clipRule="evenodd" />
						</svg>
						<input
							name="password"
							type={showPassword ? 'text' : 'password'}
							className="grow"
							placeholder="Password"
							required
							value={password}
							onChange={handlePasswordChange}
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="focus:outline-none">
							{showPassword ? (
								<EyeIcon className='w-5 text-current' />
							) : (
								<EyeSlashIcon className='w-5 text-current' />
							)}
						</button>
					</label>

					{!isLoggingIn && (
						<label
							className={`input input-bordered flex items-center gap-2 mb-6 ${!isMatching ? 'border-red-500' : ''
								}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-5 w-5 opacity-70">
								<path
									fillRule="evenodd"
									d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
									clipRule="evenodd" />
							</svg>
							<input
								name="confirmPassword"
								type="password"
								className="grow"
								placeholder="Confirm Password"
								required
								value={confirmPassword}
								onChange={handleConfirmPasswordChange}
							/>
						</label>
					)}

					{!isMatching && !isLoggingIn && (
						<p className="text-red-500 text-sm mt-2">Passwords do not match</p>
					)}



					<button type='submit' className="btn btn-primary w-full" disabled={loading}>
						{isLoggingIn ? "Sign In" : "Create"}
					</button>

					<div className="mt-4 text-center">
						<p>
							{isLoggingIn ? "Don’t have an account?" : "Already have an account?"} <a href={isLoggingIn ? "/signup" : '/signin'} className="text-primary">{isLoggingIn ? "Sign up" : "Sign in"}</a>
						</p>

					</div>
				</form >
			</div >
		</>
	)
}

export default Login