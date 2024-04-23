import {Navigate, Route, Routes} from "react-router-dom";
import RegisterPage from "../pages/account/register.tsx";
import LoginPage from "../pages/account/login.tsx";
import {UserWorkHooks} from "../../controller/Hooks/Store/WorkHooks.ts";
import {UserIdentityEnum} from "../../model/Enum/WorkEnum.ts";
import ApplicantPage from "../pages/home/applicant/page.tsx";
import RecruiterPage from "../pages/home/recruiter/page.tsx";
import KeyKeeperPage from "../pages/home/keykeeper/page.tsx";

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
            <Route path={"/Applicant/*"} element={<ApplicantPage/>}/>}
        {userInfo.userInfo?.identity === UserIdentityEnum.Recruiter &&
            <Route path={"/Recruiter/*"} element={<RecruiterPage/>}/>}
        {userInfo.userInfo?.identity === UserIdentityEnum.KeyKeeper &&
            <Route path={"/KeyKeeper/*"} element={<KeyKeeperPage/>}/>}
        <Route path={"/login/*"} element={<Navigate to={toRedirectUrl} replace={true}/>}/>
        <Route path={"/*"} element={<Navigate to={"/"} replace={true}/>}/>
    </Routes>;
}


