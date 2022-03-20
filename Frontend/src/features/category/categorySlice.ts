import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/categories`);
            return { data };
        } catch (error) {}
    }
);

export interface ICategory {
    id: number;
    name: string;
    icon: string;
}

type CategoryState = {
    loading: boolean;
    categories: ICategory[];
};

const initialState: CategoryState = {
    loading: true,
    categories: [],
};

const roomSlice = createSlice({
    name: 'category',
    initialState,
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

export const categoryState = (state: RootState) => state.category;
export default roomSlice.reducer;
