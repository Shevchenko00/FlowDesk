import { api } from "./api";
import { setCredentials, logout } from "@/features/auth/authSlice";
import type {
    AuthResponse,
    User,
    LoginRequest,
    RegisterRequest,
} from "./types";

const userApi = api.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/sign_in",
                method: "POST",
                body,
                credentials: "include",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch {}
            },
            invalidatesTags: ["User"],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                    dispatch(api.util.resetApiState());
                } catch (e) {
                    console.error("Logout failed", e);
                }
            },
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: "/auth/sign_up",
                method: "POST",
                body,
                credentials: "include",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch {}
            },
            invalidatesTags: ["User"],
        }),

        getMe: builder.query<User, void>({
            query: () => "/auth/me",
            providesTags: ["User"],
        }),

        // ✅ FIXED
        setPassword: builder.mutation<
            void,
            { old_password: string; new_password: string }
        >({
            query: (body) => ({
                url: "/auth/set-password",
                method: "POST",
                body,
                credentials: "include",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.endpoints.getMe.initiate());
                } catch {}
            },
            invalidatesTags: ["User"],
        }),

        getInvite: builder.query<any, string>({
            query: (token) => `/employee/invite/${token}`,
        }),

        setPasswordInvite: builder.mutation<
            void,
            { token: string; new_password: string }
        >({
            query: ({ token, new_password }) => ({
                url: `/employee/invite/${token}`,
                method: "POST",
                body: { new_password },
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useSetPasswordMutation, // ✅ ВАЖНО
    useGetMeQuery,
    useRegisterMutation,
    useGetInviteQuery,
    useSetPasswordInviteMutation,
} = userApi;