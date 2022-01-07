import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { countrySlice, categorySlice, roomSlice } from './features';

const rootReducer = combineReducers({
    room: roomSlice,
    category: categorySlice,
    country: countrySlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
