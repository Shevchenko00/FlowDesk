// hooks/useAuth.ts
import {
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery, useRegisterMutation,
} from '@/services/userApi'
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const [loginMutation, loginState] = useLoginMutation()
    const [logoutMutation] = useLogoutMutation()
    const meQuery = useGetMeQuery()
    const [registerMutation, registerState] = useRegisterMutation()
    const navigate = useNavigate()
    const register = async (email: string, password: string) => {
        await registerMutation({email, password}).unwrap()
    }

    const login = async (email: string, password: string) => {
        await loginMutation({email, password}).unwrap()
    }

    const logout = async () => {
        await logoutMutation().unwrap()
        navigate('/login')
    }

    return {
        user: meQuery.data,
        isAuth: !!meQuery.data,
        isLoading: meQuery.isLoading,

        login,
        logout,
        register,
        loginLoading: loginState.isLoading,
        loginError: loginState.error,
        registerLoading: registerState.isLoading,
        registerError: registerState.error
    }
}