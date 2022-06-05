import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { makeGetAsyncThunk, makePostAsyncThunk } from "../../helpers/create_async_thunk";
import { RootState } from "../../store";
import { IForgotPassword, ILogin, IResetPassword } from "../../types/auth/type_Auth";
import { IRegisterUser, IUser } from "../../types/user/type_User";
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
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
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

export const logout = makeGetAsyncThunk("auth/logout", {
    uri: "/auth/logout/",
    isLogout: true,
});

export const checkPhoneNumber = makeGetAsyncThunk("auth/checkPhoneNumber", {
    uri: "/auth/check-phonenumber/",
    fieldName: "phoneNumber",
    insertIntoURIPosition: -1,
});

export const registerUser = makePostAsyncThunk("auth/register", {
    uri: "/auth/register",
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
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload as IUser;
        },
        clearErrorMessage(state, _) {
            state.errorMessage = null;
        },
        clearSuccessMessage(state, _) {
            state.successMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.data;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
            })
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.data;
                state.user = null;
                localStorage.removeItem("user");
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
            .addCase(checkPhoneNumber.fulfilled, (state, { payload }) => {
                state.successMessage = payload.data as string;
            })
            .addMatcher(
                isAnyOf(
                    login.pending,
                    logout.pending,
                    forgotPassword.pending,
                    resetPassword.pending,
                    registerUser.pending
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
                    resetPassword.rejected,
                    registerUser.rejected,
                    checkPhoneNumber.rejected
                ),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload as string;
                }
            );
    },
});

export const { clearErrorMessage, clearSuccessMessage } = authSlice.actions;
export const authState = (state: RootState) => state.auth;
export default authSlice.reducer;
