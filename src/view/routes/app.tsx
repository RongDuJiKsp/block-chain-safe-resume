import {Navigate, Route, Routes} from "react-router-dom";
import RegisterPage from "../pages/account/register.tsx";
import LoginPage from "../pages/account/login.tsx";
import {UserWorkHooks} from "../../controller/Hooks/Atom/WorkHooks.ts";
import {UserIdentityEnum} from "../../model/Enum/WorkEnum.ts";
import ApplicantPage from "../pages/home/applicant.tsx";
import RecruiterPage from "../pages/home/recruiter.tsx";
import KeyKeeperPage from "../pages/home/keykeeper.tsx";

export function AppRoutes() {
    return <Routes>
        <Route path={"/register"} element={<RegisterPage/>}/>
        <Route path={"/login/*"} element={<LoginPage/>}/>
        <Route path={"/home/*"} element={<HomeRoutes/>}/>
        <Route path={"/*"} element={<Navigate to={"/login/user"} replace={true}/>}/>
    </Routes>;
}

function HomeRoutes() {
    const userInfo = UserWorkHooks.useValue();
    const toRedirectUrl = userInfo.userInfo === null ? "/" : "/home/" + userInfo.userInfo.identity.toString();
    return <Routes>
        {userInfo.userInfo?.identity === UserIdentityEnum.Applicant &&
            <Route path={"/Applicant/*"} element={<ApplicantRoutes/>}/>}
        {userInfo.userInfo?.identity === UserIdentityEnum.Recruiter &&
            <Route path={"/Recruiter/*"} element={<RecruiterRoutes/>}/>}
        {userInfo.userInfo?.identity === UserIdentityEnum.KeyKeeper &&
            <Route path={"/KeyKeeper/*"} element={<KeyKeeperRoutes/>}/>}
        <Route path={"/login/*"} element={<Navigate to={toRedirectUrl} replace={true}/>}/>
        <Route path={"/*"} element={<Navigate to={"/"} replace={true}/>}/>
    </Routes>;
}

function ApplicantRoutes() {
    return <Routes>
        <Route path={"/*"} element={<ApplicantPage/>}/>
    </Routes>;
}

function RecruiterRoutes() {
    return <Routes>
        <Route path={"/*"} element={<RecruiterPage/>}/>
    </Routes>;
}

function KeyKeeperRoutes() {
    return <Routes>
        <Route path={"/*"} element={<KeyKeeperPage/>}/>
    </Routes>;
}
