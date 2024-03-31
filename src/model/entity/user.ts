import {UserIdentityEnum} from "../Enum/WorkEnum.ts";
import {ReactNode} from "react";



export interface UserGroup {
    userHeader: ReactNode;
    userIdentity: string;
}

export interface ApplicantResumeRequestStatusTableTuple {

}
export interface ApplicantResumeVisitStatusTableTuple {

}
export interface RecruiterHandledResumeStatusTableTuple{

}
export interface KeyKeeperReceivedRequestStatusTableTuple{

}

export interface BasicUserState {
    nick: string;
    identity: UserIdentityEnum;
    address: string;
}