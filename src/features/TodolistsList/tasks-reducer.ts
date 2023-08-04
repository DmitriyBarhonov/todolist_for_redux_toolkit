
import { appActions } from '../../app/app-reducer'
import {  createSlice } from '@reduxjs/toolkit'
import { todolistsActions } from './todolists-reducer'
import { clearTasksAndTodolist } from '../../common/actions/common.actions'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError,} from '../../common/utils'
import { TaskType, UpdateTaskModelType, todolistsAPI } from './todolist.api'
import { TaskPriorities, TaskStatuses } from '../../common/enums'

const initialState: TasksStateType = {}


const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
    },
    extraReducers: (bilder) => {
        bilder.addCase(todolistsActions.addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolist.type, () => {
                return {}
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action)=>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTask.fulfilled, (state, action)=>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = { ...tasks[index], ...action.payload.domainModel }
                }
            })
    }
})




// thunks


const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { tasks, todolistId }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const removeTask = createAppAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }>('tasks/removeTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        return arg
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>('tasks/addTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.createTask(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            const task = res.data.data.item
            return { task }
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }

    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const updateTask = createAppAsyncThunk<{ taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, any>('tasks/updateTask', async (arg, thunkAPI) => {
    const { getState, dispatch, rejectWithValue } = thunkAPI

    try {
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            console.warn('task not found in the state')
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)

        if (res.data.resultCode === 0) {
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }


    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }

})

// export const _updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//     (dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             //throw new Error("task not found in the state");
//             console.warn('task not found in the state')
//             return
//         }

//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel
//         }

//         todolistsAPI.updateTask(todolistId, taskId, apiModel)
//             .then(res => {
//                 if (res.data.resultCode === 0) {
//                     const action = tasksAsctions.updateTask({ taskId, model: domainModel, todolistId })
//                     dispatch(action)
//                 } else {
//                     handleServerAppError(res.data, dispatch);
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch);
//             })
//     }












// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type AddTaskArgType = { title: string, todolistId: string }
export const tasksReducer = slice.reducer
export const tasksAsctions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }