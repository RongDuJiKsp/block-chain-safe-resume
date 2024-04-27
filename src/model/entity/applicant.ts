export interface ResumeLicenseRequestInfo {
    username: string;
    address: string;
    status: number;
}

export interface ResumeVisitHistoryInfo {
    ReUserName: string;
    downloadTime: string;
}
export  enum CheckingSelfResumeStatusEnum{
    Checking,Ok,Err
}
export interface CheckingSelfResumeStatus{
    kkName:string;
    status:CheckingSelfResumeStatusEnum;
}