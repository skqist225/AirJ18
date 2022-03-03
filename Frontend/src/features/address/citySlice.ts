import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';

export const fetchCitiesByState = createAsyncThunk(
    'city/fetchCitiesByState',
    async ({ stateId }: { stateId: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/cities/state/${stateId}`);
            return { data };
        } catch (error) {}
    }
);

interface ICity {
    id: number;
    name: string;
}

type CityState = {
    cities: ICity[];
    loading: boolean;
};

const initialState: CityState = {
    cities: [],
    loading: true,
};

const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCitiesByState.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.cities = payload?.data;
            })
            .addMatcher(isAnyOf(fetchCitiesByState.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(fetchCitiesByState.rejected), (state, { payload }) => {
                state.loading = false;
            });
    },
});

export default citySlice.reducer;
