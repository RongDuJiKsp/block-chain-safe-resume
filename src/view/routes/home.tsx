import {Navigate, Route, Routes} from "react-router-dom";
import ApplicantStatus from "../pages/home/applicant/status.tsx";
import RecruiterNotice from "../pages/home/recruiter/notice.tsx";
import KeyKeeperNotice from "../pages/home/keykeeper/notice.tsx";
import RecruiterRequire from "../pages/home/recruiter/require.tsx";
import ApplicantUpload from "../pages/home/applicant/upload.tsx";
import ApplicantRecord from "../pages/home/applicant/record.tsx";
import KeyKeeperGetSubKey from "../pages/home/keykeeper/get.tsx";
import HomePage from "../pages/home/public/home.tsx";
import KeyKeeperAuditPage from "../pages/home/keykeeper/audit.tsx";
import ApplicantChecking from "../pages/home/applicant/checking.tsx";
import SearchPage from "../pages/home/public/search.tsx";
import ReadWaterPage from "../pages/home/public/readwater.tsx";

export const APPLICANT_THIS_PATH: string = "/home/Applicant";

export function ApplicantRoutes() {
    return <Routes>
        <Route path={"/status"} element={<ApplicantStatus/>}/>
        <Route path={"/upload"} element={<ApplicantUpload/>}/>
        <Route path={"/record"} element={<ApplicantRecord/>}/>
        <Route path={"/checking"} element={<ApplicantChecking/>}/>
        <Route path={"/home"} element={<HomePage/>}/>
        <Route path={"/search"} element={<SearchPage/>}/>
        <Route path={"/readwater"} element={<ReadWaterPage/>}/>
        <Route path={"/*"} element={<Navigate to={APPLICANT_THIS_PATH + "/home"}/>}/>
    </Routes>;
}

export const RECRUITER_THIS_PATH: string = "/home/Recruiter";

export function RecruiterRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<RecruiterNotice/>}/>
        <Route path={"/require"} element={<RecruiterRequire/>}/>
        <Route path={"/home"} element={<HomePage/>}/>
        <Route path={"/search"} element={<SearchPage/>}/>
        <Route path={"/readwater"} element={<ReadWaterPage/>}/>
        <Route path={"/*"} element={<Navigate to={RECRUITER_THIS_PATH + "/home"}/>}/>
    </Routes>;
}

export const KEYKEEPER_THIS_PATH: string = "/home/KeyKeeper";

export function KeyKeeperRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<KeyKeeperNotice/>}/>
        <Route path={"/get"} element={<KeyKeeperGetSubKey/>}/>
        <Route path={"/home"} element={<HomePage/>}/>
        <Route path={"/audit"} element={<KeyKeeperAuditPage/>}/>
        <Route path={"/search"} element={<SearchPage/>}/>
        <Route path={"/readwater"} element={<ReadWaterPage/>}/>
        <Route path={"/*"} element={<Navigate to={KEYKEEPER_THIS_PATH + "/home"}/>}/>
    </Routes>;
}
