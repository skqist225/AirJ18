import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import categorySlice from './features/category/categorySlice';
import roomSlice from './features/room/roomSlice';

const rootReducer = combineReducers({
    room: roomSlice,
    category: categorySlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
