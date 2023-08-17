import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../../app/store'
import { fetchTodolists,TodolistDomainType, todolistThunks} from './todolists-reducer'
import { TasksStateType } from '../tasks/tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { Todolist } from '../ui/Todolist/todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../../common/hooks/useAppDispatch'
import { AddItemForm } from '../../../common/components/AddItemForm/AddItem-form'


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


    const addTodolistCallBack = useCallback((title: string) => {
        dispatch(todolistThunks.addTodolist(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolistCallBack} />
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
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
