import { createSlice } from '@reduxjs/toolkit';
import todosService, { todosEndepoint } from '../services/todos.service';
import { setError } from './errors';
import httpService from '../services/http.service';
const initialState = { entities: [], isLoading: true };

const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		recived(state, action) {
			state.entities = action.payload;
			state.isLoading = false;
		},
		update(state, action) {
			const elementIndex = state.entities.findIndex(
				(el) => el.id === action.payload.id
			);
			state.entities[elementIndex] = {
				...state.entities[elementIndex],
				...action.payload,
			};
		},
		remove(state, action) {
			state.entities = state.entities.filter(
				(el) => el.id !== action.payload.id
			);
		},
		taskRequested(state) {
			state.isLoading = true;
		},
		taskRequestFailed(state, action) {
			state.isLoading = false;
		},
	},
});
const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recived, taskRequested, taskRequestFailed } = actions;

export const loadTasks = () => async (dispatch) => {
	dispatch(taskRequested());
	try {
		const data = await todosService.fetch();
		dispatch(recived(data));
	} catch (error) {
		dispatch(taskRequestFailed());
		dispatch(setError(error.message));
	}
};

export const completeTask = (id) => (dispatch, getState) => {
	dispatch(update({ id, completed: true }));
};

export function titleChanged(id) {
	return update({ id, title: `New title for ${id}` });
}
export function taskDeleted(id) {
	return remove({ id });
}

// 19. Redux. Часть 2 Задание #1. Добавить задачу
export const createTask = (state) => async (dispatch) => {
	try {
		const data = await addTodoService.fetch();
		dispatch(recived([...state, data[0]]));
		console.log(data[0]);
	} catch (error) {
		dispatch(taskRequestFailed());
		dispatch(setError(error.message));
	}
};
const addTodoService = {
	_page: 11,
	fetch: async () => {
		const { data } = await httpService.get(todosEndepoint, {
			params: {
				_page: addTodoService._page,
				_limit: 1,
			},
		});
		addTodoService._page += 1;
		return data;
	},
};
// 19. Redux. Часть 2 Задание #1. Добавить задачу

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
