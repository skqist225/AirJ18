import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
import { IBooking } from '../../types/booking/type_Booking';

interface IFetchUserBookings {
    page: number;
}

export const fetchUserBookings = createAsyncThunk(
    'booking/fetchUserBookings',
    async ({ page }: IFetchUserBookings, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: {
                    bookings: { content, totalElements },
                },
            } = await api.post(`/booking/listings/${page}`);
            return { content, totalElements };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

interface ICreateBooking {
    roomid: number;
    checkinDate: string;
    checkoutDate: string;
    numberOfDays: number;
}

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (
        { roomid, checkinDate, checkoutDate, numberOfDays }: ICreateBooking,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/booking/${roomid}/create?checkin=${checkinDate}&checkout=${checkoutDate}&numberOfDays=${numberOfDays}`
            );

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

interface IStripeArgs {
    currency: string;
    price: number;
}

export const getStripeClientSecret = createAsyncThunk(
    'booking/getStripeClientSecret',
    async (fetchPayload: IStripeArgs, { dispatch, getState, rejectWithValue }) => {
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
    newlyCreatedBooking: any;
};

const initialState: BookingState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
    clientSecret: '',
    newlyCreatedBooking: {},
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserBookings.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookingsOfCurrentUserRooms = payload?.content;
                state.totalElements = payload?.totalElements;
            })
            .addCase(getStripeClientSecret.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.clientSecret = payload?.clientSecret;
            })
            .addCase(createBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newlyCreatedBooking = payload;
            })
            .addMatcher(isAnyOf(fetchUserBookings.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(fetchUserBookings.rejected), (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const bookingState = (state: RootState) => state.booking;
export default bookingSlice.reducer;
