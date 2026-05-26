import {Header} from "@components/Header/Header";
import {useAuth} from "@/hooks/useAuth";

const DashboardPage = () => {
    const {logout} = useAuth();
    return (
        <>
            <Header primaryText={"Logout"} showPrimary={true} onPrimaryClick={logout}/>
        </>
    )
}


export default DashboardPage;