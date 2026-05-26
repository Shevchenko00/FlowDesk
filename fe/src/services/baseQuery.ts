import {
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type {RootState} from '@/app/store'
import {setCredentials, logout} from '@/features/auth/authSlice'

interface AuthResponse {
    accessToken: string
    user?: {
        id: string
        email: string
    }
}

const API = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const state = getState() as RootState
        const token = state.auth.accessToken

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
        const refreshResult = await baseQuery(
            {url: '/auth/refresh', method: 'POST'},
            api,
            extraOptions
        )

        if (refreshResult.data) {
            const data = refreshResult.data as AuthResponse

            api.dispatch(setCredentials(data))

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}