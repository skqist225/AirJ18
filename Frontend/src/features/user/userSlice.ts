import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';

export interface IAddUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    sex: string;
    birthday: [];
}

export interface IUser extends IAddUser {
    avatarPath: string;
    fullPathAddress: string;
}

type ILoginInfo = {
    email: string;
    password: string;
};

function setUserToLocalStorage(user: IUser) {
    if (user) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export const addUser = createAsyncThunk(
    'user/addUser',
    async (postUser: IAddUser, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { user, successMessage },
            } = await api.post(`/user/add`, postUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setUserToLocalStorage(user);

            return { user, successMessage };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (loginInfo: ILoginInfo, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            const {
                data: { user, successMessage },
            } = await api.post('/user/login', loginInfo, config);

            setUserToLocalStorage(user);

            return { user, successMessage };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        const {
            data: { successMessage },
        } = await api.get('/user/logout');

        localStorage.removeItem('user');

        return { successMessage };
    } catch ({ data: { errorMessage } }) {
        return rejectWithValue(errorMessage);
    }
});

type CountryState = {
    user: IUser | null;
    loading: boolean;
    errorMessage: string | null;
    successMessage: string | null;
};

const initialState: CountryState = {
    user: null,
    loading: true,
    errorMessage: null,
    successMessage: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.successMessage;
                state.user = payload.user;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.successMessage;
                state.user = payload.user;
            })
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.successMessage;
                state.user = null;
            })
            .addMatcher(isAnyOf(addUser.pending, login.pending, logout.pending), state => {
                state.loading = true;
            })
            .addMatcher(
                isAnyOf(addUser.rejected, login.rejected, logout.rejected),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload as string;
                }
            );
    },
});

export default userSlice.reducer;
