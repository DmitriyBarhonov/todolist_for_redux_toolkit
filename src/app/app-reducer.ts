import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// import { AppThunk } from './store'
// import { authActions } from '../features/auth/auth-reducer'
// import { authAPI } from '../features/auth/auth-api'
// import { createAppAsyncThunk, handleServerNetworkError } from '../common/utils'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

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
