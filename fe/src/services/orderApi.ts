import { api } from './api'
import {OrderStatus} from "@/types/order";

export interface DeliveryMethod {
    id: number;
    name: string;
    is_active: boolean;
}

export interface Order {
    id: number;
    product_id: number;
    customer_id: number;
    delivery_method: DeliveryMethod;
    status: string;
    is_processed: boolean;
    is_successful: boolean | null;
    ordered_at: string;
}

export interface Address {
    country: string;
    city: string;
    street: string;
    postal_code: string;
}

export interface CreateOrderPayload {
    product_id: number;
    delivery_method_id: number;
    address: Address;
}

const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getDeliveryMethods: builder.query<DeliveryMethod[], void>({
            query: () => '/order/delivery-methods',
            providesTags: ['Order'],
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
    }),

    overrideExisting: false,
})

export const {
    useGetDeliveryMethodsQuery,
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation
} = orderApi;