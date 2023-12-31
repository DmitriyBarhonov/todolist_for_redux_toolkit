import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit'

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
    },
    extraReducers: (bilder) => {
        bilder.addMatcher((action: AnyAction) => {
            console.log(action);
            return action.type.endsWith("/pending")


        }, (state, action: AnyAction) => {
            state.status = 'loading'
        })
            .addMatcher((action: AnyAction) => {
                return action.type.endsWith("/fulfilled")
            }, (state, action: AnyAction) => {
                state.status = 'idle'
            })
            .addMatcher((action: AnyAction) => {
                return action.type.endsWith("/rejected")
            }, (state, action: AnyAction) => {
                state.status = 'failed'
            })
    }
})





export const appReducer = slice.reducer
export const appActions = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
