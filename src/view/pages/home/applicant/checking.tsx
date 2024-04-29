import React, {ReactNode, useState} from "react";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import {TeamOutlined} from "@ant-design/icons";
import TableHeader from "../../../components/comp/tableHeader.tsx";

export default function ApplicantChecking(): ReactNode {
    const [statuss, setStatus] = useState<string[]>([]);

    return <MainContainerProvider>
        <TableHeader title={'简历状态'} onFresh={() => {
        }}/>
        <div className={"flex flex-col justify-center gap-12 h-full"}>
            <div className={"flex justify-center gap-14"}>
                <StatusUnit status={"Accept"} title={"MOE LTD"}/>
                <StatusUnit status={"Delay"} title={"MOE LTD"} failReason={"你这是违法行为,走,跟我去自首!"}/>
                <StatusUnit status={"Waiting"}/>
            </div>
            <div className={"flex justify-center"}>
                <StatusUnit status={"Waiting"}/>
            </div>
        </div>
    </MainContainerProvider>;
}
type ResumeStatus = "Waiting" | "Accept" | "Delay";
type StatusUnitProps = {
    status: ResumeStatus
    failReason?: string;
    handleTime?: string;
    title?: string;
};
const colorMap: Record<ResumeStatus, string> = {
    Accept: "#68EDC6", Delay: "#E78F8E", Waiting: "#4C5B5C"

}

function StatusUnit({status, failReason, handleTime, title}: StatusUnitProps): ReactNode {
    return <div className={"flex flex-col gap-1 text-center"}>
        <div className={"flex justify-center"}><TeamOutlined style={{fontSize: 52, color: colorMap[status]}}/></div>
        <div className={"flex flex-col gap-0.5 "} style={{color: colorMap[status]}}>
            <div>{status}</div>
            {title && <div>{title}</div>}
            {failReason && <div>{"打回原因: " + failReason}</div>}
            {handleTime && <div>{handleTime}</div>}
        </div>
    </div>;
}