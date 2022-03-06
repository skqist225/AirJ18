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
    async ({ pageNumber }: { pageNumber: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { rooms, successMessage, totalPages, totalRecords },
            } = await api.get(`/room/user/page/${pageNumber}`);

            return { rooms, successMessage, totalPages, totalRecords };
        } catch (error) {}
    }
);

export const fetchRoomPrivacies = createAsyncThunk(
    'room/fetchRoomPrivacies',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room-privacy`);

            return { data };
        } catch (error) {}
    }
);

interface IRoomPrivacy {
    id: number;
    name: string;
    description: string;
}

type RoomState = {
    rooms: [];
    hosting: {
        rooms: IRoomListings[];
        loading: boolean;
        totalPages: number;
        totalRecords: number;
    };
    room: IRoomDetails;
    loading: boolean;
    roomPrivacies: IRoomPrivacy[];
};

const initialState: RoomState = {
    rooms: [],
    hosting: {
        rooms: [],
        loading: true,
        totalPages: 0,
        totalRecords: 0,
    },
    room: null,
    loading: true,
    roomPrivacies: [],
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
                state.hosting.loading = false;
                state.hosting.rooms = payload?.rooms;
                state.hosting.totalRecords = payload?.totalRecords;
                state.hosting.totalPages = payload?.totalPages;
            })
            .addCase(fetchUserOwnedRoom.pending, (state, { payload }) => {
                state.hosting.loading = true;
            })
            .addCase(fetchRoomPrivacies.fulfilled, (state, { payload }) => {
                state.roomPrivacies = payload?.data;
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
