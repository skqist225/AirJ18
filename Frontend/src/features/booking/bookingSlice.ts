import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";
import { IBooking } from "../../types/booking/type_Booking";

interface IFetchUserBookings {
    query?: string;
    page: number;
    bookingDateMonth?: string;
    bookingDateYear?: string;
    bookingDate?: string;
    isComplete?: string;
    totalFee?: number;
}

export const fetchUserBookings = createAsyncThunk(
    "booking/fetchUserBookings",
    async (
        {
            page,
            query = "",
            bookingDateMonth,
            bookingDateYear,
            bookingDate,
            isComplete,
            totalFee,
        }: IFetchUserBookings,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            let fetchUrl = `/booking/listings/${page}?query=${query}`;

            if (bookingDateMonth && bookingDateYear) {
                fetchUrl += `&booking_date_month=${bookingDateMonth}&booking_date_year=${bookingDateYear}`;
                dispatch(setBookingDateMonth(bookingDateMonth));
                dispatch(setBookingDateYear(bookingDateYear));
            } else if (bookingDateMonth) {
                fetchUrl += `&booking_date_month=${bookingDateMonth}`;
                dispatch(setBookingDateMonth(bookingDateMonth));
            } else if (bookingDateYear) {
                fetchUrl += `&booking_date_year=${bookingDateYear}`;
                dispatch(setBookingDateYear(bookingDateYear));
            }
            if (bookingDate) {
                fetchUrl += `&booking_date=${bookingDate}`;
                dispatch(setBookingDate(bookingDate));
            }

            if (isComplete) {
                fetchUrl += `&is_complete=${isComplete}`;
                dispatch(setIsComplete(isComplete));
            }

            if (totalFee) {
                fetchUrl += `&total_fee=${totalFee}`;
                dispatch(setTotalFee(totalFee));
            }
            dispatch(setQuery(query));

            const {
                data: { content, totalElements },
            } = await api.get(fetchUrl);

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
    "booking/createBooking",
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
    "booking/getStripeClientSecret",
    async (fetchPayload: IStripeArgs, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { clientSecret },
            } = await api.post(`/create-payment-intent`, fetchPayload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return { clientSecret };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const cancelBooking = createAsyncThunk(
    "booking/cancelBooking",
    async ({ bookingid }: { bookingid: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/booking/${bookingid}/canceled`);
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const approveBooking = createAsyncThunk(
    "booking/approveBooking",
    async ({ bookingid }: { bookingid: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/booking/${bookingid}/approved`);
            return { data };
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
    fetchData: IFetchUserBookings;
};

const initialState: BookingState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
    clientSecret: "",
    newlyCreatedBooking: {},
    cancelMessage: "",
    fetchData: {
        query: "",
        page: 1,
        bookingDateMonth: "",
        bookingDateYear: "",
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setPage: (state, { payload }) => {
            state.fetchData.page = payload;
        },
        setQuery: (state, { payload }) => {
            state.fetchData.query = payload;
        },
        setBookingDateMonth: (state, { payload }) => {
            state.fetchData.bookingDateMonth = payload;
        },
        setBookingDateYear: (state, { payload }) => {
            state.fetchData.bookingDateYear = payload;
        },
        setBookingDate: (state, { payload }) => {
            state.fetchData.bookingDateYear = payload;
        },
        setIsComplete: (state, { payload }) => {
            state.fetchData.isComplete = payload;
        },
        setTotalFee: (state, { payload }) => {
            state.fetchData.totalFee = payload;
        },
    },
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
                state.cancelMessage = payload?.data;
            })
            .addCase(approveBooking.fulfilled, (state, { payload }) => {
                state.cancelMessage = payload?.data;
            })
            .addMatcher(isAnyOf(fetchUserBookings.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(fetchUserBookings.rejected), (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const {
    setPage,
    setQuery,
    setBookingDateMonth,
    setBookingDateYear,
    setBookingDate,
    setIsComplete,
    setTotalFee,
} = bookingSlice.actions;
export const bookingState = (state: RootState) => state.booking;
export default bookingSlice.reducer;
