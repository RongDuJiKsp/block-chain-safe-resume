import {Navigate, Route, Routes} from "react-router-dom";
import ApplicantStatus from "../pages/home/applicant/status.tsx";
import RecruiterNotice from "../pages/home/recruiter/notice.tsx";
import KeyKeeperNotice from "../pages/home/keykeeper/notice.tsx";
import RecruiterRequire from "../pages/home/recruiter/require.tsx";
import ApplicantUpload from "../pages/home/applicant/upload.tsx";
import ApplicantRecord from "../pages/home/applicant/record.tsx";

export const APPLICANT_THIS_PATH: string = "/home/Applicant";

export function ApplicantRoutes() {
    return <Routes>
        <Route path={"/status"} element={<ApplicantStatus/>}/>
        <Route path={"/upload"} element={<ApplicantUpload/>}/>
        <Route path={"/record"} element={<ApplicantRecord/>}/>
        <Route path={"/*"} element={<Navigate to={APPLICANT_THIS_PATH + "/status"}/>}/>
    </Routes>;
}

export const RECRUITER_THIS_PATH: string = "/home/Recruiter";

export function RecruiterRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<RecruiterNotice/>}/>
        <Route path={"/require"} element={<RecruiterRequire/>}/>
        <Route path={"/*"} element={<Navigate to={RECRUITER_THIS_PATH + "/notice"}/>}/>
    </Routes>;
}

export const KEYKEEPER_THIS_PATH: string = "/home/KeyKeeper";

export function KeyKeeperRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<KeyKeeperNotice/>}/>
        <Route path={"/*"} element={<Navigate to={KEYKEEPER_THIS_PATH + "/notice"}/>}/>
    </Routes>;
}
