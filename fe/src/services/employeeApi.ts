import { api } from './api'
import { setCredentials } from '@/features/auth/authSlice'
import type { AuthResponse, RegisterRequest } from './types'

export const employeeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: '/employee/create',
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


    }),
    overrideExisting: false,
})

export const {
    useCreateMutation
} = employeeApi