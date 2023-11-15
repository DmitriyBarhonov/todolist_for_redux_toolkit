import React, { ChangeEvent } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from '../../../../common/components/EditableSpan/Editable-span'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from '../../../../common/enums'
import { TaskType } from '../../api/todolist.types.api'
import { useAppDispatch } from '../../../../common/hooks/useAppDispatch'
import { tasksThunks } from '../../tasks/tasks-reducer'


type TaskPropsType = {
	task: TaskType
	todolistId: string
}

// const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
//     dispatch(tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId }))
// }, [])

export const Task = React.memo((props: TaskPropsType) => {

	const dispatch = useAppDispatch()
	const onClickHandler = () => {
		dispatch(tasksThunks.removeTask({ taskId: props.task.id, todolistId: props.todolistId }))
	}

	const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
		let newIsDoneValue = e.currentTarget.checked
		const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New 
		dispatch(tasksThunks.updateTask({ taskId: props.task.id, domainModel: {status}, todolistId: props.todolistId }))
	}

	const onTitleChangeHandler = (newValue: string)=>{
		dispatch(tasksThunks.updateTask({ taskId: props.task.id, domainModel: {title: newValue}, todolistId: props.todolistId }))
	}
	return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
		<Checkbox
			checked={props.task.status === TaskStatuses.Completed}
			color="primary"
			onChange={changeStatusHandler}
		/>

		<EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
		<IconButton onClick={onClickHandler}>
			<Delete />
		</IconButton>
	</div>
})
