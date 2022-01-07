import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { countrySlice, categorySlice, roomSlice, userSlice } from './features';

const rootReducer = combineReducers({
    room: roomSlice,
    category: categorySlice,
    country: countrySlice,
    user: userSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
