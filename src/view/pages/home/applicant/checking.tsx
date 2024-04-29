import React, {ReactNode, useEffect, useState} from "react";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import {TeamOutlined} from "@ant-design/icons";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {App} from "antd";
import {CheckingSelfResumeStatus} from "../../../../model/entity/applicant.ts";

type ResumeStatus = "Waiting" | "Accept" | "Delay";
type StatusUnitProps = {
    status: ResumeStatus
    failReason?: string;
    handleTime?: string;
    title?: string;
};
const colorMap: Record<ResumeStatus, string> = {
    Accept: "#68EDC6", Delay: "#E78F8E", Waiting: "#4C5B5C"

};

function calStatus(a: ResumeStatus, b: ResumeStatus, c: ResumeStatus): ResumeStatus {
    if (a === "Accept" && b === "Accept" && c === "Accept") return "Accept";
    if (a === "Delay" || b === "Delay" || c === "Delay") return "Delay";
    return "Waiting";
}

export default function ApplicantChecking(): ReactNode {
    const userServer = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [statuss, setStatus] = useState<CheckingSelfResumeStatus[]>([]);
    const [flag, swaps] = useSwapBoolean();
    useEffect(() => {
        userServer.getCheckingSelfResumeStatusList().then(r => {
            if (r.success) {
                message.success("获取数据成功！").then();
                setStatus(r.data);
            } else message.error(r.message).then();
        }).catch(e => {
            message.error("发送错误" + e).then();
        });
    }, [flag]);

    return <MainContainerProvider>
        <TableHeader title={'简历状态'} onFresh={swaps}/>
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