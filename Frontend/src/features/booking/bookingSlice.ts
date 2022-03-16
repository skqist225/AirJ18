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
            } = await api.get(`/booking/listings/${page}`);
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
    clientMessage: string;
}

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (
        { roomid, checkinDate, checkoutDate, numberOfDays, clientMessage }: ICreateBooking,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/booking/${roomid}/create?checkin=${checkinDate}&checkout=${checkoutDate}&numberOfDays=${numberOfDays}&clientMessage=${clientMessage}`
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

export const cancelBooking = createAsyncThunk(
    'booking/cancelBooking',
    async ({ bookingid }: { bookingid: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { status },
            } = await api.get(`/booking/${bookingid}/canceled`);
            return { status };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const approveBooking = createAsyncThunk(
    'booking/approveBooking',
    async ({ bookingid }: { bookingid: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { status },
            } = await api.get(`/booking/${bookingid}/approved`);
            return { status };
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
    cancelMessage: string;
};

const initialState: BookingState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
    clientSecret: '',
    newlyCreatedBooking: {},
    cancelMessage: '',
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
            .addCase(cancelBooking.fulfilled, (state, { payload }) => {
                state.cancelMessage = payload?.status;
            })
            .addCase(approveBooking.fulfilled, (state, { payload }) => {
                state.cancelMessage = payload?.status;
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
