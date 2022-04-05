import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '../../axios';
import { RootState } from '../../store';
import { Chat, ReceiverInfo } from '../../types/type_Chat';

export const fetchInboxBetweenSenderAndReceiver = createAsyncThunk(
    'inbox/fetchInboxBetweenSenderAndReceiver',
    async ({ receiver }: { receiver: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/chat/receiver/${receiver}`);

            return { data };
        } catch (error) {}
    }
);

export const fetchReceivers = createAsyncThunk(
    'inbox/fetchReceivers',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/chat/receivers`);

            return { data };
        } catch (error) {}
    }
);

type InboxState = {
    chats: Chat[];
    receivers: ReceiverInfo[];
};

const initialState: InboxState = {
    chats: [],
    receivers: [],
};

const inboxSlice = createSlice({
    name: 'inbox',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchInboxBetweenSenderAndReceiver.fulfilled, (state, { payload }) => {
                state.chats = payload?.data;
            })
            .addCase(fetchReceivers.fulfilled, (state, { payload }) => {
                state.receivers = payload?.data;
            });
    },
});

export const inboxState = (state: RootState) => state.inbox;
export default inboxSlice.reducer;
