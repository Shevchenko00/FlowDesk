import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery.ts'


export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    keepUnusedDataFor: 0,
    tagTypes: ['User', 'Product', 'Employee', 'Customer'],
    endpoints: () => ({}),
})