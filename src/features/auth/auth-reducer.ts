import { appActions } from '../../app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from '../../common/utils';
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
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})



// thunks

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { values: LoginParamsType }>("auth/login", async (values, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.login(values.values)
        if (res.data.resultCode === 0) {
            return { isLoggedIn: true }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(res.data)
        }
    })


})


export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTasksAndTodolist())
            return { isLoggedIn: false }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })



})



export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('app/initializeApp', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
            return { isLoggedIn: true }
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
            return rejectWithValue(null)
        }
        
    })
})
// export const _initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('app/initializeApp', async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//         const res = await authAPI.me()
//         if (res.data.resultCode === 0) {
//             return { isLoggedIn: true }
//         } else {
//             handleServerAppError(res.data, dispatch)
//             return rejectWithValue(null)
//         }

//     } catch (error) {
//         handleServerNetworkError(error, dispatch)
//         return rejectWithValue(null)
//     }
//     finally {
//         dispatch(appActions.setAppInitialized({ isInitialized: true }));
//     }
// })


export const authThunks = { logout, login, initializeApp }
export const authReducer = slice.reducer
export const authActions = slice.actions
