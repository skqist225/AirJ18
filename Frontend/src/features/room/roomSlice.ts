import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { IRoom, IRoomGroup, IRoomPrivacy } from '../../type/room/type_Room';
import { IRoomDetails } from '../../type/room/type_RoomDetails';
import { IRoomListings } from '../../type/room/type_RoomListings';

interface IFetchRoomsByCategoryAndConditions {
    categoryid: number;
    privacies?: number[];
    minPrice?: string;
    maxPrice?: string;
    bedRoomCount?: number;
    bedCount?: number;
    bathRoomCount?: number;
    selectedAmentities?: number[];
}

export const fetchRoomsByCategoryAndConditions = createAsyncThunk(
    'room/fetchRoomsByCategoryId',
    async (
        {
            categoryid,
            privacies = [],
            minPrice = '0',
            maxPrice = '1000000000',
            bedRoomCount = 0,
            bedCount = 0,
            bathRoomCount = 0,
            selectedAmentities = [],
        }: IFetchRoomsByCategoryAndConditions,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/rooms?categoryId=${categoryid}&privacies=${privacies.join(
                    ' '
                )}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedRoom=${bedRoomCount}&bed=${bedCount}&bathRoom=${bathRoomCount}&amentities=${selectedAmentities.join(
                    ' '
                )}`
            );
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

export const fetchRoomGroups = createAsyncThunk(
    'room/fetchRoomGroups',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room-group`);

            return { data };
        } catch (error) {}
    }
);

export const getAverageRoomPricePerNight = createAsyncThunk(
    'room/getAverageRoomPricePerNight',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/getAverageRoomPricePerNight`);

            return { data };
        } catch (error) {}
    }
);

type RoomState = {
    rooms: IRoom[];
    hosting: {
        rooms: IRoomListings[];
        loading: boolean;
        totalPages: number;
        totalRecords: number;
    };
    room: IRoomDetails;
    loading: boolean;
    roomPrivacies: IRoomPrivacy[];
    roomGroups: IRoomGroup[];
    averageRoomPricePerNight: number;
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
    roomGroups: [],
    averageRoomPricePerNight: 0,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRoomsByCategoryAndConditions.fulfilled, (state, { payload }) => {
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
            .addCase(fetchRoomGroups.fulfilled, (state, { payload }) => {
                state.roomGroups = payload?.data;
            })
            .addCase(getAverageRoomPricePerNight.fulfilled, (state, { payload }) => {
                state.averageRoomPricePerNight = payload?.data;
            })
            .addMatcher(
                isAnyOf(fetchRoomsByCategoryAndConditions.pending, fetchRoomById.pending),
                state => {
                    state.loading = true;
                }
            )
            .addMatcher(
                isAnyOf(fetchRoomsByCategoryAndConditions.rejected, fetchRoomById.rejected),
                (state, { payload }) => {
                    state.loading = false;
                }
            );
    },
});

export default roomSlice.reducer;
