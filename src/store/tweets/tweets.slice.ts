import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState= {};

export const tweetsSlice = createSlice({
    name: 'tweets',
    initialState,
    reducers: {
        settweets: (state, action: PayloadAction<any>) => {
            state = action.payload;
        },
    }
});

export const tweetsActions = tweetsSlice.actions;
export const tweetsReducer = tweetsSlice.reducer;
