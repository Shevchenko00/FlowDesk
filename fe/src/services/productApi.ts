import { api } from './api'
import { DeleteResponse, Product } from "@/types/product";

const productApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createProduct: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: '/product/create',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Product'],
        }),

        getAllProducts: builder.query<Product[], void>({
            query: () => '/product/get_all',
            providesTags: ['Product'],
        }),
        updateProductPrice: builder.mutation<Product, { id: number; price: number }>({
            query: ({ id, price }) => ({
                url: `/product/${id}/price`,
                method: 'PATCH',
                body: { price },
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation<DeleteResponse, number>({
            query: (productId) => ({
                url: `/product/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),

        updateProductCount: builder.mutation<Product, { id: number; count: number }>({
            query: ({ id, count }) => ({
                url: `/product/${id}/count`,
                method: 'PATCH',
                body: { count },
            }),
            invalidatesTags: ['Product'],
        }),

        toggleAvailability: builder.mutation<Product, number>({
            query: (id) => ({
                url: `/product/${id}/availability`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Product'],
        }),

        orderProduct: builder.mutation<Product, number>({
            query: (id) => ({
                url: `/product/${id}/order`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
    overrideExisting: false,
})

export const {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useDeleteProductMutation,
    useUpdateProductCountMutation,
    useToggleAvailabilityMutation,
    useOrderProductMutation,
    useUpdateProductPriceMutation,
} = productApi