import {Routes, Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
function App() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<LandingPage/>}/>
                {/*<Route path="/register" element={<RegisterPage/>}/>*/}
            </Routes>
        </>
    )
}

export default App
