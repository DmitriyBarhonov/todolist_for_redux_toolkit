import React, { useEffect } from "react";
import { Task } from "../Task/Task";
import {
  TodolistDomainType,
  todolistThunks,
} from "../../todolists/todolists-reducer";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "../../tasks/tasks-reducer";
import { useAppDispatch } from "../../../../common/hooks/useAppDispatch";
import { EditableSpan } from "../../../../common/components/EditableSpan/Editable-span";
import { AddItemForm } from "../../../../common/components/AddItemForm/AddItem-form";
import { TaskStatuses } from "../../../../common/enums";
import { TaskType } from "../../api/todolist.types.api";
import { FilterTasksButton } from "../Task/filter-tasks-button/filter-tasks-button";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({
  demo = false,
  ...props
}: PropsType) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) return;
    dispatch(tasksThunks.fetchTasks(props.todolist.id));
  }, [dispatch, props.todolist.id, demo]);

  const addTaskCallBack = (title: string) => {
    dispatch(tasksThunks.addTask({ title, todolistId: props.todolist.id }));
  };

  const removeTodolist = () => {
    dispatch(todolistThunks.removeTodolist(props.todolist.id));
  };

  const changeTodolistTitle = (title: string) => {
    dispatch(
      todolistThunks.changeTodolistTitle({ id: props.todolist.id, title })
    );
  };

  //   const onAllClickHandler = useCallback(
  //     () =>
  //       dispatch(
  //         todolistsActions.changeTodolistFilter({
  //           filter: "all",
  //           id: props.todolist.id,
  //         })
  //       ),
  //     [dispatch,props.todolist.id]
  //   );
  //   const onActiveClickHandler = useCallback(
  //     () =>
  //       dispatch(
  //         todolistsActions.changeTodolistFilter({
  //           filter: "active",
  //           id: props.todolist.id,
  //         })
  //       ),
  //     [dispatch, props.todolist.id]
  //   );
  //   const onCompletedClickHandler = useCallback(
  //     () =>
  //       dispatch(
  //         todolistsActions.changeTodolistFilter({
  //           filter: "completed",
  //           id: props.todolist.id,
  //         })
  //       ),
  //     [dispatch,props.todolist.id]
  //   );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter(
      (t) => t.status === TaskStatuses.Completed
    );
  }

  return (
    <div>
      <h3>
        <EditableSpan
          value={props.todolist.title}
          onChange={changeTodolistTitle}
        />
        <IconButton
          onClick={removeTodolist}
          disabled={props.todolist.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        addItem={addTaskCallBack}
        disabled={props.todolist.entityStatus === "loading"}
      />
      <div>
        {tasksForTodolist?.map((t) => (
          <Task key={t.id} task={t} todolistId={props.todolist.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton todolist={props.todolist} />
      </div>
    </div>
  );
});
