import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
import { Review } from '../../types/review/type_Review';

export const fetchReviews = createAsyncThunk(
    'review/fetchReviews',
    async (
        { numberOfStars = 0 }: { numberOfStars: number },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const {
                data: { reviews, finalRatings },
            } = await api.get(`/progress/reviews?numberOfStars=${numberOfStars}`);
            return { reviews, finalRatings };
        } catch (error) {}
    }
);

type ReviewState = {
    reviews: Review[];
    finalRatings: number;
    loading: boolean;
};

const initialState: ReviewState = {
    finalRatings: 0,
    reviews: [],
    loading: true,
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchReviews.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reviews = payload?.reviews;
                state.finalRatings = payload?.finalRatings;
            })
            .addCase(fetchReviews.pending, state => {
                state.loading = true;
            })
            .addCase(fetchReviews.rejected, (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const reviewState = (state: RootState) => state.review;
export default reviewSlice.reducer;
