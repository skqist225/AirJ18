import { Satellite } from "@material-ui/icons";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";
import { IRoom, IRoomGroup, IRoomPrivacy } from "../../types/room/type_Room";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import { IRoomListings } from "../../types/room/type_RoomListings";

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
    "room/fetchRoomsByCategoryAndConditions",
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
                    " "
                )}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedRoom=${bedRoomCount}&bed=${bedCount}&bathRoom=${bathRoomCount}&amentities=${selectedAmentities.join(
                    " "
                )}&bookingDates=${bookingDates.join(",")}`
            );
            if (data) dispatch(setMockingRoomLoading(true));
            return { data };
        } catch (error) {}
    }
);

export const fetchRoomById = createAsyncThunk(
    "room/fetchRoomById",
    async ({ roomid }: { roomid: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/${roomid}`);

            return { data };
        } catch (error) {}
    }
);

interface IFetchUserOwnedRoom {
    page: number;
    query?: string;
    bathRooms?: number;
    bedRooms?: number;
    beds?: number;
    minPrice?: number;
    maxPrice?: number;
    amenityIDs?: string;
    statuses?: string;
    sortField?: string;
    sortDir?: string;
}

export const fetchUserOwnedRoom = createAsyncThunk(
    "room/fetchUserOwnedRoom",
    async (
        {
            page,
            query = "",
            bathRooms = 0,
            bedRooms = 0,
            beds = 0,
            amenityIDs = "",
            statuses = "",
            sortField = "id",
            sortDir = "asc",
        }: IFetchUserOwnedRoom,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as RootState;
            const { filterObject } = state.room;
            let fetchUrl = `/rooms/user/${page}?QUERY=${query}`;

            if (
                (beds && bathRooms && bedRooms) ||
                (filterObject.beds && filterObject.bathRooms && filterObject.bedRooms)
            ) {
                fetchUrl += `&BATHROOMS=${bathRooms}&BEDROOMS=${bedRooms}&BEDS=${beds}`;
                dispatch(
                    setRoomInfo(
                        {
                            beds,
                            bathRooms,
                            bedRooms,
                        } || {
                            beds: filterObject.beds,
                            bathRooms: filterObject.bathRooms,
                            bedRooms: filterObject.bedRooms,
                        }
                    )
                );
            }
            if (amenityIDs || filterObject.amenityIDs) {
                fetchUrl += `&AMENITY_IDS=${amenityIDs || filterObject.amenityIDs}`;
                dispatch(setAmenities(amenityIDs || filterObject.amenityIDs));
            }

            if (statuses || filterObject.statuses) {
                fetchUrl += `&STATUSES=${statuses || filterObject.statuses}`;
                dispatch(setStatus(statuses || filterObject.statuses));
            }

            dispatch(setRoomQuery(query || filterObject.query));
            fetchUrl += `&SORTFIELD=${sortField}&SORTDIR=${sortDir}`;
            dispatch(setSortField(sortField || filterObject.sortField));
            dispatch(setSortDir(sortDir || filterObject.sortDir));

            console.info(fetchUrl);
            const {
                data: { rooms, totalPages, totalRecords },
            } = await api.get(fetchUrl);

            return { rooms, totalPages, totalRecords };
        } catch (error) {}
    }
);

export const fetchRoomPrivacies = createAsyncThunk(
    "room/fetchRoomPrivacies",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room-privacy`);

            return { data };
        } catch (error) {}
    }
);

export const fetchRoomGroups = createAsyncThunk(
    "room/fetchRoomGroups",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room-group`);

            return { data };
        } catch (error) {}
    }
);

export const findAverageRoomPriceByType = createAsyncThunk(
    "room/findAverageRoomPriceByType",
    async (type: string = "PER_NIGHT", { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/rooms/average-price?type=${type}`);

            return { data };
        } catch (error) {}
    }
);

export const addRoom = createAsyncThunk(
    "room/addRoom",
    async (fd: FormData, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.post(`/room/save`, fd, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (data) localStorage.removeItem("room");

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
    "room/updateRoom",
    async (
        { roomid, fieldName, postObj }: IPostUpdateRoom,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const data = await api.post(
                `/manage-your-space/update/${roomid}/${fieldName}`,
                postObj
            );

            if (data) {
                dispatch(fetchRoomById({ roomid: roomid.toString() }));
                dispatch(resetUpdateStatus());
            }

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
    room: IRoomDetails | null;
    loading: boolean;
    roomPrivacies: IRoomPrivacy[];
    roomGroups: IRoomGroup[];
    averageRoomPriceByType: number;
    mockingRoomLoading: boolean;
    filterObject: IFetchUserOwnedRoom & {
        choosenPrivacy: Array<any>;
        bookingDates: Array<any>;
    };
    newlyCreatedRoomId: number;
    updateSuccess: boolean;
    photos: File[];
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
    averageRoomPriceByType: 0,
    filterObject: {
        page: 1,
        query: "",
        choosenPrivacy: [],
        minPrice: 0,
        maxPrice: 100000000,
        beds: 0,
        bedRooms: 0,
        bathRooms: 0,
        amenityIDs: "",
        bookingDates: [],
    },
    newlyCreatedRoomId: 0,
    updateSuccess: false,
    photos: [],
};

const roomSlice = createSlice({
    name: "room",
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
                page: 1,
                query: "",
                choosenPrivacy: [],
                minPrice: 0,
                maxPrice: 100000000,
                beds: 0,
                bedRooms: 0,
                bathRooms: 0,
                amenityIDs: "",
                bookingDates: [],
            };
        },
        resetUpdateStatus: state => {
            state.updateSuccess = false;
        },
        setRoomQuery: (state, { payload }) => {
            state.filterObject.query = payload;
        },
        setRoomInfo: (state, { payload }) => {
            state.filterObject.beds = payload.beds;
            state.filterObject.bedRooms = payload.bedRooms;
            state.filterObject.bathRooms = payload.bathRooms;
        },
        setListingPage: (state, { payload }) => {
            state.filterObject.page = payload;
        },
        setAmenities: (state, { payload }) => {
            state.filterObject.amenityIDs = payload;
        },
        setStatus: (state, { payload }) => {
            state.filterObject.statuses = payload;
        },
        setSortField: (state, { payload }) => {
            state.filterObject.sortField = payload;
        },
        setSortDir: (state, { payload }) => {
            state.filterObject.sortDir = payload;
        },
        setPhotos: (state, { payload }) => {
            state.photos = [...state.photos, payload];
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
            .addCase(findAverageRoomPriceByType.fulfilled, (state, { payload }) => {
                state.averageRoomPriceByType = payload?.data;
            })
            .addCase(addRoom.fulfilled, (state, { payload }) => {
                console.log(payload);
                state.newlyCreatedRoomId = parseInt(payload!.data as any as string);
            })
            .addCase(updateRoom.fulfilled, (state, { payload }) => {
                state.updateSuccess = true;
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
        setRoomInfo,
        setRoomQuery,
        setListingPage,
        setAmenities,
        setStatus,
        setSortField,
        setSortDir,
        setPhotos,
    },
} = roomSlice;

export const roomState = (state: RootState) => state.room;
export default roomSlice.reducer;
