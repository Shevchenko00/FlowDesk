import {Routes, Route} from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage/>
                    </ProtectedRoute>}/>

                <Route path="/sign_in" element={<LoginPage/>}/>
            </Routes>
        </>
    )
}

export default App
