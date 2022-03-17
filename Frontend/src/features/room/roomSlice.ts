import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { boolean } from 'yup';
import api from '../../axios';
import { RootState } from '../../store';
import { IRoom, IRoomGroup, IRoomPrivacy } from '../../types/room/type_Room';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import { IRoomListings } from '../../types/room/type_RoomListings';

interface IFetchRoomsByCategoryAndConditions {
    categoryid: number;
    privacies?: number[];
    minPrice?: number;
    maxPrice?: number;
    bedRoomCount?: number;
    bedCount?: number;
    bathRoomCount?: number;
    selectedAmentities?: number[];
    bookingDates?: string[];
}

export const fetchRoomsByCategoryAndConditions = createAsyncThunk(
    'room/fetchRoomsByCategoryAndConditions',
    async (
        {
            categoryid,
            privacies = [],
            minPrice = 0,
            maxPrice = 1000000000,
            bedRoomCount = 0,
            bedCount = 0,
            bathRoomCount = 0,
            selectedAmentities = [],
            bookingDates = [],
        }: IFetchRoomsByCategoryAndConditions,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/rooms?categoryId=${categoryid}&privacies=${privacies.join(
                    ' '
                )}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedRoom=${bedRoomCount}&bed=${bedCount}&bathRoom=${bathRoomCount}&amentities=${selectedAmentities.join(
                    ' '
                )}&bookingDates=${bookingDates.join(',')}`
            );
            if (data) dispatch(setMockingRoomLoading(true));
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

interface IGetUserOwnedRoom {
    pageNumber: number;
    query?: string;
    bathRooms?: number;
    bedRooms?: number;
    beds?: number;
    amenityIDs?: string;
    statuses?: string;
}

export const fetchUserOwnedRoom = createAsyncThunk(
    'room/fetchUserOwnedRoom',
    async (
        {
            pageNumber,
            query = '',
            bathRooms = 0,
            bedRooms = 0,
            beds = 0,
            amenityIDs = '',
            statuses = '',
        }: IGetUserOwnedRoom,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const {
                data: { rooms, successMessage, totalPages, totalRecords },
            } = await api.get(
                `/rooms/user/${pageNumber}?query=${query}&BATHROOMS=${bathRooms}&BEDROOMS=${bedRooms}&BEDS=${beds}&AMENITY_IDS=${amenityIDs}&STATUSES=${statuses}`
            );

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

export const addRoom = createAsyncThunk(
    'room/addRoom',
    async (fd: FormData, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/room/save`, fd, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (data) localStorage.removeItem('room');

            return { data };
        } catch (error) {}
    }
);
interface IPostUpdateRoom {
    roomid: number;
    fieldName: string;
    postObj: Object;
}

export const updateRoom = createAsyncThunk(
    'room/updateRoom',
    async (
        { roomid, fieldName, postObj }: IPostUpdateRoom,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.post(
                `/manage-your-space/update/${roomid}/${fieldName}`,
                postObj,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (data === 'OK') dispatch(fetchRoomById({ roomid: roomid.toString() }));

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
    mockingRoomLoading: boolean;
    filterObject: {
        choosenPrivacy: number[];
        minPrice: number;
        maxPrice: number;
        bedCount: number;
        bedRoomCount: number;
        bathRoomCount: number;
        selectedAmentities: number[];
        bookingDates: string[];
    };
    newlyCreatedRoomId: number;
    updateSuccess: boolean;
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
    mockingRoomLoading: true,
    averageRoomPricePerNight: 0,
    filterObject: {
        choosenPrivacy: [],
        minPrice: 0,
        maxPrice: 100000000,
        bedCount: 0,
        bedRoomCount: 0,
        bathRoomCount: 0,
        selectedAmentities: [],
        bookingDates: [],
    },
    newlyCreatedRoomId: 0,
    updateSuccess: false,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setMockingRoomLoading: (state, { payload }) => {
            state.mockingRoomLoading = payload;
        },
        setCurrentFilterObject: (state, { payload }) => {
            state.filterObject = payload;
        },
        resetCurretnFilterObject: state => {
            state.filterObject = {
                choosenPrivacy: [],
                minPrice: 0,
                maxPrice: 100000000,
                bedCount: 0,
                bedRoomCount: 0,
                bathRoomCount: 0,
                selectedAmentities: [],
                bookingDates: [],
            };
        },
        resetUpdateStatus: state => {
            state.updateSuccess = false;
        },
    },
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
            .addCase(addRoom.fulfilled, (state, { payload }) => {
                state.newlyCreatedRoomId = parseInt(payload?.data as string);
            })
            .addCase(updateRoom.fulfilled, (state, { payload }) => {
                if (payload?.data === 'OK') state.updateSuccess = true;
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
export const {
    actions: {
        setMockingRoomLoading,
        setCurrentFilterObject,
        resetCurretnFilterObject,
        resetUpdateStatus,
    },
} = roomSlice;

export const roomState = (state: RootState) => state.room;
export default roomSlice.reducer;
