import {Navigate, Route, Routes} from "react-router-dom";
import RegisterPage from "../pages/account/register.tsx";
import LoginPage from "../pages/account/login.tsx";

export function AppRoutes() {
    return <Routes>
        <Route path={"/register"} element={<RegisterPage/>}/>
        <Route path={"/login/*"} element={<LoginPage/>}/>
        <Route path={"/*"} element={<Navigate to={"/login/user"} replace={true}/>}/>
    </Routes>
}