import { AnyAction, combineReducers } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import {appReducer} from './app-reducer'
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/auth-reducer';
import { tasksReducer } from '../features/todolists-list/tasks/tasks-reducer';
import { todolistsReducer } from '../features/todolists-list/todolists/todolists-reducer';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore  
window.store = store;
