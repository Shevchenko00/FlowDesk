import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {Loader} from "@components/Loader/Loader";

export const ProtectedRoute = ({ children }) => {
    const { isAuth, isLoading } = useAuth()

    if (isLoading) return <Loader/>

    if (!isAuth) {
        return <Navigate to="/sign_in" replace />
    }

    return children
}