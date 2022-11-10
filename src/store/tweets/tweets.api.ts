import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://jsonplaceholder.typicode.com';


export const tweetsApi = createApi({
    reducerPath: 'tweetsApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  API_URL ?? `${process.env.REACT_APP_API_ENDPOINT }`,
    }),
    endpoints: builder => ({
        getTweets: builder.query<any, any>({
            query: () => `/posts`,
        }),
      
    }),
});

export const { useGetTweetsQuery } = tweetsApi;
