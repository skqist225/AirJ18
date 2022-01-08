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

const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {
        user: {
            user: localUser,
            loading: false,
            successMessage: null,
            errorMessage: null,
        },
    },
});

export default store;
