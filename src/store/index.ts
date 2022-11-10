import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {tweetsReducer} from "./tweets/tweets.slice";
import { tweetsApi } from "./tweets/tweets.api";

export const store = configureStore({
  reducer: {
    [tweetsApi.reducerPath]: tweetsApi.reducer,
    currencies: tweetsReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tweetsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
