export interface ResumeLicenseRequestInfo {
    username: string;
    address: string;
    status: number;
}

export interface ResumeVisitHistoryInfo {
    ReUserName: string;
    downloadTime: string;
}


export interface CheckingSelfResumeStatus {
    isApprove: string;
    reason: string;
    checkUsername: string;
    checkTime: string;
}