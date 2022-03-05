import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import {
    IAddUser,
    ILoginInfo,
    IUser,
    IUserUpdate,
    IBookedRoom,
    RoomWishlists,
    IRatingLabel,
} from '../../type/user/type_User';

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

export const fetchWishlistsIDsOfCurrentUser = createAsyncThunk(
    'user/fetchWishlistsIDsOfCurrentUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/wishlists/ids`);
            return { data };
        } catch (error) {}
    }
);

export const fetchWishlistsOfCurrentUser = createAsyncThunk(
    'user/fetchWishlistsOfCurrentUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/wishlists`);
            return { data };
        } catch (error) {}
    }
);

export const updateUserInfo = createAsyncThunk(
    'user/updateUserInfo',
    async (updatedInfo: IUserUpdate, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { user, successMessage },
            } = await api.post(`/user/update-personal-info`, updatedInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            //update local user info
            setUserToLocalStorage(user);

            return { user, successMessage };
        } catch (error) {}
    }
);

export const fetchBookedRooms = createAsyncThunk(
    'user/fetchBookedRooms',
    async ({ query }: { query: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { bookedRooms, ratingLabels },
            } = await api.get(`/user/bookedRooms?query=${query}`);
            //update local user info

            return { bookedRooms, ratingLabels };
        } catch (error) {}
    }
);

type UserState = {
    user: IUser | null;
    loading: boolean;
    wishlistsFetching: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    update: {
        loading: boolean;
        errorMessage: string | null;
        successMessage: string | null;
    };
    wishlistsIDs: number[];
    wishlists: RoomWishlists[];
    bookedRooms: IBookedRoom[];
    ratingLabels: IRatingLabel[];
};

const initialState: UserState = {
    user: null,
    loading: true,
    wishlistsFetching: true,
    errorMessage: null,
    successMessage: null,
    update: {
        loading: true,
        errorMessage: null,
        successMessage: null,
    },
    wishlistsIDs: [],
    wishlists: [],
    bookedRooms: [],
    ratingLabels: [],
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
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.successMessage;
                state.user = null;
            })
            .addCase(fetchWishlistsIDsOfCurrentUser.fulfilled, (state, { payload }) => {
                state.wishlistsFetching = false;
                state.wishlistsIDs = payload?.data;
            })
            .addCase(fetchWishlistsOfCurrentUser.fulfilled, (state, { payload }) => {
                state.wishlistsFetching = false;
                state.wishlists = payload?.data;
            })
            .addCase(fetchWishlistsOfCurrentUser.pending, (state, { payload }) => {
                state.wishlistsFetching = true;
            })
            // .addCase(fetchWishlistsOfCurrentUser.pending, (state, { payload }) => {
            //     state.wishlistsFetching = true;
            // })
            .addCase(fetchBookedRooms.fulfilled, (state, { payload }) => {
                state.bookedRooms = payload?.bookedRooms;
                state.ratingLabels = payload?.ratingLabels;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.successMessage;
                state.user = payload.user;
            })
            .addCase(updateUserInfo.fulfilled, (state, { payload }) => {
                state.update.loading = false;
                state.update.successMessage = payload?.successMessage;
                state.user = payload?.user;
            })
            .addCase(updateUserInfo.pending, (state, { payload }) => {
                state.update.loading = true;
            })
            .addMatcher(isAnyOf(addUser.pending, login.pending, logout.pending), state => {
                state.loading = true;
            })
            .addMatcher(
                isAnyOf(
                    addUser.rejected,
                    login.rejected,
                    logout.rejected,
                    fetchWishlistsOfCurrentUser.rejected
                ),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload as string;
                }
            );
    },
});

export default userSlice.reducer;
