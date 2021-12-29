import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';

// interface room {}

export const fetchRoomsByCategoryId = createAsyncThunk(
    'room/fetchRoomsByCategoryId',
    async ({ categoryId }: { categoryId: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/rooms/category/${categoryId}`);
            return { data };
        } catch (error) {}
    }
);

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        loading: true,
        rooms: [],
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRoomsByCategoryId.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.rooms = payload?.data;
            })
            .addCase(fetchRoomsByCategoryId.pending, state => {
                state.loading = true;
            })
            .addCase(fetchRoomsByCategoryId.rejected, (state, { payload }) => {
                state.loading = false;
            });
    },
});

export default roomSlice.reducer;
