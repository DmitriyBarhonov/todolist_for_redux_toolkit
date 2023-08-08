import { instance } from "../../../common/api/api";
import { BaseResponseType } from "../../../common/types";
import { AddTaskArgType, } from "../tasks-reducer";
import { GetTasksResponse, TaskType, TodolistType, UpdateTaskModelType } from "./todolist.types.api";

// api
export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistType[]>('todo-lists');
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<BaseResponseType<{ item: TodolistType }>>('todo-lists', { title: title });
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = instance.delete<BaseResponseType>(`todo-lists/${id}`);
        return promise;
    },
    updateTodolist(id: string, title: string) {
        const promise = instance.put<BaseResponseType>(`todo-lists/${id}`, { title: title });
        return promise;
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<BaseResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}


