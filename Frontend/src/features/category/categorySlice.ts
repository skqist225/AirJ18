import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/categories`);
            return { data };
        } catch (error) {}
    }
);

const roomSlice = createSlice({
    name: 'category',
    initialState: {
        loading: true,
        categories: [],
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.categories = payload?.data;
            })
            .addCase(fetchCategories.pending, state => {
                state.loading = true;
            })
            .addCase(fetchCategories.rejected, (state, { payload }) => {
                state.loading = false;
            });
    },
});

export default roomSlice.reducer;
