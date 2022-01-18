import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { IRoomDetails } from '../../type/type_RoomDetails';
import { IRoomListings } from '../../type/type_RoomListings';

export const fetchRoomsByCategoryId = createAsyncThunk(
    'room/fetchRoomsByCategoryId',
    async ({ categoryid }: { categoryid: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/category/${categoryid}`);
            return { data };
        } catch (error) {}
    }
);

export const fetchRoomById = createAsyncThunk(
    'room/fetchRoomById',
    async ({ roomid }: { roomid: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/${roomid}`);

            return { data };
        } catch (error) {}
    }
);

export const fetchUserOwnedRoom = createAsyncThunk(
    'room/fetchUserOwnedRoom',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { rooms, successMessage },
            } = await api.get(`/room/user`);

            return { rooms, successMessage };
        } catch (error) {}
    }
);

type RoomState = {
    rooms: [];
    roomsListings: IRoomListings[];
    room: IRoomDetails;
    loading: boolean;
};

const initialState: RoomState = {
    rooms: [],
    roomsListings: [],
    room: null,
    loading: true,
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
            .addCase(fetchUserOwnedRoom.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.roomsListings = payload?.rooms;
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
