import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";
import InvitePage from "@/pages/InvitePage/InvitePage";

import { ProtectedRoute } from "@components/ProtectedRoute/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route path="/sign_in" element={<LoginPage />} />


            <Route path="/invite/:token" element={<InvitePage />} />
        </Routes>
    );
}

export default App;