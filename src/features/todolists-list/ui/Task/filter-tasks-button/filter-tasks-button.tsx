import Button from "@mui/material/Button/Button"
import React, { FC } from "react"
import { useAppDispatch } from "../../../../../common/hooks/useAppDispatch"
import { FilterValuesType, TodolistDomainType, todolistsActions } from "../../../todolists/todolists-reducer"

type PropsType = {
    todolist: TodolistDomainType
}

export const FilterTasksButton: FC<PropsType> = (props) => {
    const dispatch = useAppDispatch()

    const changeTAsksFilterHandler = (filter: FilterValuesType)=>{
        dispatch(todolistsActions.changeTodolistFilter({ filter, id: props.todolist.id }))
    } 

    return (
        <>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                onClick={()=> changeTAsksFilterHandler("all")}
                color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
               onClick={()=> changeTAsksFilterHandler("active")}
                color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
               onClick={()=> changeTAsksFilterHandler("completed")}
                color={'secondary'}>Completed
            </Button>
        </>
    )
}





