import { api } from './api'
import { setCredentials } from '@/features/auth/authSlice'
import type {AuthResponse, RegisterRequest, User} from './types'

const customerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCustomer: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: '/customer/create',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch {}
            },
            invalidatesTags: ['Customer'],
        }),

        getCustomer: builder.query<User, void>({
            query: () => '/customer',
            providesTags: ['Customer'],
        }),

    }),
    overrideExisting: false,
})

export const {
    useCreateCustomerMutation,
    useGetCustomerQuery

} = customerApi