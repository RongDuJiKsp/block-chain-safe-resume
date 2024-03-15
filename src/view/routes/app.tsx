import {Navigate, Route, Routes} from "react-router-dom";
import RegisterPage from "../pages/account/register.tsx";

export function AppRoutes() {
    return <Routes>
        <Route path={"/register"} element={<RegisterPage/>}/>
        <Route path={"/login"} element={<RegisterPage/>}/>
        <Route path={"/*"} element={<Navigate to={"/login"} replace={true}/>}/>
    </Routes>
}