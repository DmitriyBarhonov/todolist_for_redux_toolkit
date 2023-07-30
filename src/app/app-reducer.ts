import { authAPI } from '../api/todolists-api'
import { authActions } from '../features/Login/auth-reducer'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './store'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}
// export type InitialStateType =  typeof slice.getInitialState

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})





export const appReducer = slice.reducer
export const appActions = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'




export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        }
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
    })
}

// export type SetAppErrorActionType = ReturnType<typeof authActionsApp.>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>