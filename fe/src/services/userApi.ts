import { api } from './api'
import { setCredentials, logout } from '@/features/auth/authSlice'
import type { AuthResponse, User, LoginRequest, RegisterRequest } from './types'

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: '/auth/sign_in',
                credentials: "include",
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch {
                }
            },
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch }) {
                dispatch(logout())
                dispatch(api.util.resetApiState())
            },
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: '/auth/sign_up',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch {}
            },
            invalidatesTags: ['User'],
        }),

        getMe: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

    }),
    overrideExisting: false,
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery,
    useRegisterMutation
} = userApi