import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setTasks: (state, action) => {
            state.items = action.payload;
        },
        addTask: (state, action) => {
            state.items.unshift(action.payload);
        },
        updateTask: (state, action) => {
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.items = state.items.filter(t => t.id !== action.payload);
        },
        toggleComplete: (state, action) => {
            const index = state.items.findIndex(t => t.id === action.payload);
            if (index !== -1) {
                state.items[index].completed = !state.items[index].completed;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setTasks, addTask, updateTask, deleteTask, toggleComplete, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;
