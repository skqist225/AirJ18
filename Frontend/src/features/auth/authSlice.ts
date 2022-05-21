import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";
import { IForgotPassword, ILogin, IResetPassword } from "../../types/auth/type_Auth";
import { IUser } from "../../types/user/type_User";
import { setUserToLocalStorage } from "../common";
import { setUser } from "../user/userSlice";

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (resetPasswordData: IResetPassword, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/auth/reset-password`, resetPasswordData);

            return { data };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (loginInfo: ILogin, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post("/auth/login", loginInfo);
            if (data) {
                setUserToLocalStorage(data);
                dispatch(setUser(data));
            }

            return { data };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (forgotPassword: IForgotPassword, { rejectWithValue }) => {
        try {
            const {
                data: { message, resetPasswordCode, email },
            } = await api.post("/auth/forgot-password", forgotPassword);
            return { message, resetPasswordCode, email };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await api.get("/auth/logout");
        if (data) {
            localStorage.removeItem("user");
            dispatch(setUser(null));
        }
        return { data };
    } catch ({ data: { errorMessage } }) {
        return rejectWithValue(errorMessage);
    }
});

type AuthState = {
    user: IUser | null;
    loading: boolean;
    errorMessage: string | null;
    successMessage: string | null;
};

const initialState: AuthState = {
    user: null,
    loading: true,
    errorMessage: null,
    successMessage: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
            })
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.data;
                state.user = null;
            })
            .addCase(
                forgotPassword.fulfilled,
                (state, { payload: { message, resetPasswordCode, email } }) => {
                    state.successMessage = message;
                    localStorage.setItem("email", email);
                    localStorage.setItem("resetPasswordCode", resetPasswordCode);
                }
            )
            .addCase(resetPassword.fulfilled, (state, { payload }) => {
                state.successMessage = payload.data;
            })
            .addMatcher(
                isAnyOf(
                    login.pending,
                    logout.pending,
                    forgotPassword.pending,
                    resetPassword.pending
                ),
                (state, _) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                isAnyOf(
                    login.rejected,
                    logout.rejected,
                    forgotPassword.rejected,
                    resetPassword.rejected
                ),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload as string;
                }
            );
    },
});

export const authState = (state: RootState) => state.auth;
export default authSlice.reducer;
