import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
import { Booking } from '../../types/progress/type_Earning';

export const fetchEarnings = createAsyncThunk(
    'earning/fetchEarnings',
    async ({ year = 2022 }: { year: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { bookings, feesInMonth, numberOfBookingsInMonth, totalFee },
            } = await api.get(`/progress/earnings?year=${year}`);
            return { bookings, feesInMonth, numberOfBookingsInMonth, totalFee };
        } catch (error) {}
    }
);

type EarningState = {
    bookings: Booking[];
    feesInMonth: { [key: number]: number };
    numberOfBookingsInMonth: { [key: number]: number };
    totalFee: number;
    loading: boolean;
};

const initialState: EarningState = {
    bookings: [],
    feesInMonth: {},
    numberOfBookingsInMonth: {},
    totalFee: 0,
    loading: true,
};

const earningSlice = createSlice({
    name: 'earning',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchEarnings.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookings = payload?.bookings;
                state.feesInMonth = payload?.feesInMonth;
                state.numberOfBookingsInMonth = payload?.numberOfBookingsInMonth;
                state.totalFee = payload?.totalFee;
            })
            .addCase(fetchEarnings.pending, state => {
                state.loading = true;
            })
            .addCase(fetchEarnings.rejected, (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const earningState = (state: RootState) => state.earning;
export default earningSlice.reducer;
