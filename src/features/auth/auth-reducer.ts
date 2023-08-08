import { todolistsActions } from '../TodolistsList/todolists-reducer';
import { Dispatch } from 'redux'
import { appActions } from '../../app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
import { tasksAsctions } from '../TodolistsList/tasks-reducer';
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from '../../common/utils';
import { clearTasksAndTodolist } from '../../common/actions/common.actions';
import { authAPI, LoginParamsType } from './auth-api';




const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
           setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (bilder) => {
        bilder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        .addCase(initializeApp.fulfilled, (state, action)=>{
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})



// thunks

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { values: LoginParamsType }>("auth/login", async (values, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await authAPI.login(values.values)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { isLoggedIn: true }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            dispatch(clearTasksAndTodolist())
            return { isLoggedIn: false }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})


export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('app/initializeApp', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
          return  { isLoggedIn: true } 
        }else{
            // handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
    finally{
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
    }
})


export const authThunks = { logout, login, initializeApp }
export const authReducer = slice.reducer
export const authActions = slice.actions
