import { api } from './api'
import { setCredentials } from '@/features/auth/authSlice'
import type {AuthResponse, RegisterRequest, User} from './types'

const employeeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createEmployee: builder.mutation<AuthResponse, RegisterRequest>({
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
            invalidatesTags: ['Employee'],
        }),
        getEmployee: builder.query<User, void>({
            query: () => '/employee',
            providesTags: ['Employee'],
        }),

    }),
    overrideExisting: false,
})

export const {
    useCreateEmployeeMutation,
    useGetEmployeeQuery
} = employeeApi