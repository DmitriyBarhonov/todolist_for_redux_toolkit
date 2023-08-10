
import { appActions, RequestStatusType } from '../../app/app-reducer'
import { handleServerNetworkError } from '../../common/utils/handleServerNetworkError'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearTasksAndTodolist } from '../../common/actions/common.actions';
import { todolistsAPI } from './api/todolist.api';
import { TodolistType } from './api/todolist.types.api';
import { createAppAsyncThunk, thunkTryCatch } from '../../common/utils';


// types

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (bilder) => {
        bilder.addCase(clearTasksAndTodolist.type, () => {
            return []
        })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl: any) => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
            })
            .addCase(todolistThunks.changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state[index].title = action.payload.title
            })
    }
}
)



// thunks


export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>("todolists/fetchTodolists", async (undefined, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.getTodolists()
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { todolists: res.data }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null)
    }
})

export const removeTodolist = createAppAsyncThunk<{ id: string }, string>("todolists/removeTodolist", async (id, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: 'loading' }))
        await todolistsAPI.deleteTodolist(id)
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { id }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null)
    }
}
)


export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>('todolists/addTodolist', async (title, thunkAPI) => {
    
return thunkTryCatch(thunkAPI,async () => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await todolistsAPI.createTodolist(title)
    if(res.data.resultCode === 0){
        return { todolist: res.data.data.item }
    }else{
        handleServerNetworkError(res.data, dispatch);
        return rejectWithValue(null)
    }
  
} )

})
export const _addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>('todolists/addTodolist', async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.createTodolist(title)
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { todolist: res.data.data.item }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null)
    }

})

export const changeTodolistTitle = createAppAsyncThunk<{ id: string, title: string }, { id: string, title: string }>("todolists/changeTodolistTitle", async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        await todolistsAPI.updateTodolist(arg.id, arg.title)
        return { id: arg.id, title: arg.title }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null)
    }
})


export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer
export const todolistThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }