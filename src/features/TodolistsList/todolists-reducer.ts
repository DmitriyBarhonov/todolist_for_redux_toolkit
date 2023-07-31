import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { appActions, RequestStatusType } from '../../app/app-reducer'
import { handleServerNetworkError } from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearTasksAndTodolist } from '../../common/actions/common.actions';


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
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            // state.map(tl => tl.id === action.id ? { ...tl, title: action.title } : tl)
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
        },
    },
    extraReducers: (bilder) => {
        bilder.addCase(clearTasksAndTodolist.type, ()=>{
            return []
        })
    }
}
)


export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer


// actions


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({ todolists: res.data }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (id: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: 'loading' }))
        todolistsAPI.deleteTodolist(id)
            .then((res) => {
                // dispatch(removeTodolistAC(todolistId))
                dispatch(todolistsActions.removeTodolist({ id }))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({ id, title }))
            })
    }
}



