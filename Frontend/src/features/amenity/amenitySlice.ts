import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
import IAmenity from '../../types/type_Amenity';

export const fetchAmenities = createAsyncThunk(
    'amenity/fetchAmenities',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities`);
            return { data };
        } catch (error) {}
    }
);

type AmenityState = {
    amenities: IAmenity[];
    loading: boolean;
};

const initialState: AmenityState = {
    amenities: [],
    loading: true,
};

const amenitySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAmenities.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.amenities = payload?.data;
            })
            .addMatcher(isAnyOf(fetchAmenities.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(fetchAmenities.rejected), (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const amenityState = (state: RootState) => state.amenity;
export default amenitySlice.reducer;
