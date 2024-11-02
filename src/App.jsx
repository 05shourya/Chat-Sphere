import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/custom/login/Login'
import MainPage from './pages/MainPage'
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'sunset'
		document.documentElement.setAttribute('data-theme', theme)
	}, [])


	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<MainPage />} />
					<Route path='/signin' element={<Login isLoggingIn={true} />} />
					<Route path='/signup' element={<Login isLoggingIn={false} />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
