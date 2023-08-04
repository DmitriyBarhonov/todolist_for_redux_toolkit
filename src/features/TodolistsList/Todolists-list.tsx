import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import { fetchTodolists, FilterValuesType,TodolistDomainType,todolistsActions, todolistThunks} from './todolists-reducer'
import { TasksStateType, tasksThunks } from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { Todolist } from './ui/Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../common/hooks/useAppDispatch'
import { AddItemForm } from '../../common/components/AddItemForm/AddItem-form'
import { TaskStatuses } from '../../common/enums'


type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = fetchTodolists()
        dispatch(thunk)
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({ taskId, todolistId }))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({ title, todolistId }))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId }))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        dispatch( tasksThunks.updateTask({taskId, domainModel:{ title: newTitle }, todolistId}))
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, id: string) {
        const action = todolistsActions.changeTodolistFilter({ id, filter: value })
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
 
        dispatch(todolistThunks.removeTodolist(id))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(todolistThunks.changeTodolistTitle({id,title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todolistThunks.addTodolist(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: '10px' }}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
