import React, { useCallback, useEffect } from 'react'
import './App.css'

import { useDispatch, useSelector } from 'react-redux'
import { AppRootStateType } from './store'
import { RequestStatusType } from './app-reducer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
	AppBar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography
} from '@mui/material';
import Menu from "@mui/icons-material/Menu"
import { initializeApp, logout } from '../features/auth/auth-reducer'
import { ErrorSnackbar } from '../common/components/ErrorSnackbar/Error-snackbar'
import { Login } from '../features/auth/Login'
import { TodolistsList } from '../features/todolists-list/todolists/todolists-list'

type PropsType = {
	demo?: boolean
}

function App({demo = false}: PropsType) {
	const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
	const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
	const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
	const dispatch = useDispatch<any>()

	useEffect(() => {
		dispatch(initializeApp())
	}, [dispatch])

	const logoutHandler = useCallback(() => {
		dispatch(logout())
	}, [dispatch])

	if (!isInitialized) {
		return <div
			style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
			<CircularProgress/>
		</div>
	}

	return (
		<BrowserRouter>
			<div className="App">
				<ErrorSnackbar/>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="menu">
							<Menu/>
						</IconButton>
						<Typography variant="h6">
							News
						</Typography>
						{isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
					</Toolbar>
					{status === 'loading' && <LinearProgress/>}
				</AppBar>
				<Container fixed>
					<Routes>
						<Route path={'/'} element={<TodolistsList demo={demo}/>}/>
						<Route path={'/login'} element={<Login/>}/>
					</Routes>
				</Container>
			</div>
		</BrowserRouter>
	)
}

export default App
