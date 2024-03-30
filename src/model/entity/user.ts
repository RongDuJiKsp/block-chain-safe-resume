import {UserIdentityEnum} from "../Enum/WorkEnum.ts";
import {ReactNode} from "react";



export interface UserGroup {
    userHeader: ReactNode;
    userIdentity: string;
}

export interface ApplicantResumeRequestStatusTuple {

}
export interface ApplicantResumeVisitStatusTuple{

}

export interface BasicUserState {
    nick: string;
    identity: UserIdentityEnum;
    address: string;
}