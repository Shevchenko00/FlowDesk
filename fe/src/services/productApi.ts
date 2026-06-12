import { api } from './api'
import {DeleteResponse, Product} from "@/types/product";

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

        deleteProduct: builder.mutation<DeleteResponse, number>({
            query: (productId) => ({
                url: `/product/${productId}`,
                method: 'DELETE',
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
} = productApi