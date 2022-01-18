import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';

export const fetchAmenities = createAsyncThunk(
    'amenity/fetchAmenities',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities`);
            return { data };
        } catch (error) {}
    }
);

export interface IAmenity {
    id: number;
    status: boolean;
    createdDate: number;
    updatedDate: number;
    name: string;
    iconImage: string;
    description: string;
    prominent: boolean;
    favorite: boolean;
    safe: boolean;
    amentityCategory: {
        id: number;
        name: string;
        description: string | null;
    };
    iconImagePath: string;
}

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

export default amenitySlice.reducer;
