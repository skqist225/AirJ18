import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { IBooking } from '../../types/booking/type_Booking';

interface IFetchPayload {
    page: number;
}

export const fetchBookingListOfCurrentUserRooms = createAsyncThunk(
    'booking/fetchBookingListOfCurrentUserRooms',
    async (fetchPayload: IFetchPayload, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: {
                    bookings: { content, totalElements },
                },
            } = await api.get(`/booking/listings/${fetchPayload.page}`);
            return { content, totalElements };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

type BookingState = {
    bookingsOfCurrentUserRooms: IBooking[];
    totalElements: number;
    loading: boolean;
};

const initialState: BookingState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBookingListOfCurrentUserRooms.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookingsOfCurrentUserRooms = payload?.content;
                state.totalElements = payload?.totalElements;
            })
            .addMatcher(isAnyOf(fetchBookingListOfCurrentUserRooms.pending), state => {
                state.loading = true;
            })
            .addMatcher(
                isAnyOf(fetchBookingListOfCurrentUserRooms.rejected),
                (state, { payload }) => {
                    state.loading = false;
                }
            );
    },
});

export default bookingSlice.reducer;
