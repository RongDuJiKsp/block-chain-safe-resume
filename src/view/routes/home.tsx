import {Navigate, Route, Routes} from "react-router-dom";
import ApplicantStatus from "../pages/home/applicant/status.tsx";
import RecruiterNotice from "../pages/home/recruiter/notice.tsx";
import KeyKeeperNotice from "../pages/home/keykeeper/notice.tsx";

export const APPLICANT_THIS_PATH: string = "/home/Applicant";

export function ApplicantRoutes() {
    return <Routes>
        <Route path={"/status"} element={<ApplicantStatus/>}/>
        <Route path={"/*"} element={<Navigate to={APPLICANT_THIS_PATH + "/status"}/>}/>
    </Routes>;
}

export const RECRUITER_THIS_PATH: string = "/home/Recruiter";

export function RecruiterRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<RecruiterNotice/>}/>
        <Route path={"/*"} element={<Navigate to={RECRUITER_THIS_PATH + "/notice"}/>}/>
    </Routes>;
}

export const KEYKEEPER_THIS_PATH: string = "/home/Applicant";

export function KeyKeeperRoutes() {
    return <Routes>
        <Route path={"/notice"} element={<KeyKeeperNotice/>}/>
        <Route path={"/*"} element={<Navigate to={KEYKEEPER_THIS_PATH + "/notice"}/>}/>
    </Routes>;
}
