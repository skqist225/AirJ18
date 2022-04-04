import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';

export const fetchInbox = createAsyncThunk(
    'inbox/fetchInbox',
    async ({ hostid }: { hostid: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { bookedRooms, ratingLabels },
            } = await api.get(`/user/booked-rooms?query=${hostid}`);

            return { bookedRooms, ratingLabels };
        } catch (error) {}
    }
);

type InboxState = {};

const initialState: InboxState = {};

const inboxSlice = createSlice({
    name: 'inbox',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // builder.addCase;
    },
});

export const inboxState = (state: RootState) => state.inbox;
export default inboxSlice.reducer;
