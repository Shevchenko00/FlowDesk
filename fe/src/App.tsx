import './App.css'
import {Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
function App() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                {/*<Route path="/register" element={<RegisterPage/>}/>*/}
            </Routes>
        </>
    )
}

export default App
