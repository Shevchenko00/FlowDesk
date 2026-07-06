import { api } from './api'
import {CreateDeliveryPayload, CreateOrderPayload, DeliveryMethod, Order, OrderStatus} from "@/types/order";


const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getDeliveryMethods: builder.query<DeliveryMethod[], void>({
            query: () => '/order/delivery-methods',
            providesTags: ['Order'],
        }),

        updateDeliveryMethod: builder.mutation<
            DeliveryMethod,
            { id: number; name?: string; price?: number; is_active?: boolean }
        >({
            query: ({ id, ...body }) => ({
                url: `/order/delivery-methods/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Order"],
        }),
        createDeliveryMethod: builder.mutation<DeliveryMethod, CreateDeliveryPayload>({
            query: (body) => ({
                url: '/order/delivery-methods/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Order', 'Product'],
        }),
        createOrder: builder.mutation<Order, CreateOrderPayload>({
            query: (body) => ({
                url: '/order/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Order', 'Product'],
        }),

        getMyOrders: builder.query<Order[], void>({
            query: () => '/order/my',
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query<Order[], void>({
            query: () => '/order/all',
            providesTags: ['Order'],
        }),
        getPendingAllOrders: builder.query<Order[], void>({
            query: () => '/order/all_pending',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation<
            Order,
            { order_id: number; status: OrderStatus }
        >({
            query: ({ order_id, status }) => ({
                url: `/order/${order_id}/status`,
                method: "PATCH",
                body: {
                    status,
                },
            }),
            invalidatesTags: ["Order"],
        }),
        cancelOrder: builder.mutation<Order, { order_id: number }>({
            query: ({ order_id }) => ({
                url: `/order/${order_id}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Order"],
        }),
    }),

    overrideExisting: false,
})

export const {
    useGetDeliveryMethodsQuery,
    useCreateOrderMutation,
    useCreateDeliveryMethodMutation,
    useUpdateDeliveryMethodMutation,
    useGetMyOrdersQuery,
    useGetPendingAllOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation
} = orderApi;