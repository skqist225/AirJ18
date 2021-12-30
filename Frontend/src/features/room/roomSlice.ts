import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { IRoomDetails } from '../../type/type_RoomDetails';

export const fetchRoomsByCategoryId = createAsyncThunk(
    'room/fetchRoomsByCategoryId',
    async ({ categoryId }: { categoryId: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/rooms/category/${categoryId}`);
            return { data };
        } catch (error) {}
    }
);

export const fetchRoomById = createAsyncThunk(
    'room/fetchRoomById',
    async ({ roomId }: { roomId: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/${roomId}`);
            return { data };
        } catch (error) {}
    }
);

type RoomState = {
    loading: boolean;
    rooms: [];
    room: IRoomDetails;
};

const initialState: RoomState = {
    loading: true,
    rooms: [],
    room: null,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRoomsByCategoryId.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.rooms = payload?.data;
            })
            .addCase(fetchRoomById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.room = payload?.data;
            })
            .addMatcher(isAnyOf(fetchRoomsByCategoryId.pending, fetchRoomById.pending), state => {
                state.loading = true;
            })
            .addMatcher(
                isAnyOf(fetchRoomsByCategoryId.rejected, fetchRoomById.rejected),
                (state, { payload }) => {
                    state.loading = false;
                }
            );
    },
});

export default roomSlice.reducer;
