import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
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
            } = await api.post(`/booking/listings/${fetchPayload.page}`);
            return { content, totalElements };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

interface StripeInfo {
    currency: string;
    price: number;
}

export const getStripeClientSecret = createAsyncThunk(
    'booking/getStripeClientSecret',
    async (fetchPayload: StripeInfo, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { clientSecret },
            } = await api.post(`/create-payment-intent`, fetchPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return { clientSecret };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

type BookingState = {
    bookingsOfCurrentUserRooms: IBooking[];
    totalElements: number;
    loading: boolean;
    clientSecret: string;
};

const initialState: BookingState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
    clientSecret: '',
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
            .addCase(getStripeClientSecret.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.clientSecret = payload?.clientSecret;
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

export const bookingState = (state: RootState) => state.booking;
export default bookingSlice.reducer;
