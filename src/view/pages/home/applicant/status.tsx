import {Modal, Statistic, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {componentUtils} from "../../../../controller/util/component.tsx";
import CountUp from "react-countup";
import {useEffect, useState} from "react";
import {ResumeInfoRes} from "../../../../model/http-bodys/ress.ts";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";

interface ApplicantResumeRequestStatusTableTuple {

}

const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

const tableColumn: ColumnsType<ApplicantResumeRequestStatusTableTuple> = [{}];
export default function ApplicantStatus() {
    const [flashFlag, changeAction] = useSwapBoolean();
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={" bg-white py-8"}>
            <ResumeInfoComponent/>
        </div>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <TableHeader title={"访问请求"} onFresh={changeAction}/>
            <ResumeRequestComponent/>
        </div>
    </div>;
}

function ResumeInfoComponent() {
    const userServerMethod = ApplicantWorkHooks.useMethod();
    const [resumeInfo, setResumeInfo] = useState<ResumeInfoRes | null>(null);
    useEffect(() => {
        userServerMethod.getResumeInfoAsync().then(r => setResumeInfo(r));
    }, []);
    return <div className={"flex justify-around"}>
        <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                   value={resumeInfo?.downloadtimes} suffix={"次"} formatter={numberCountUpFormatter}/>
        <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")}
                   value={resumeInfo?.putTime}/>
        <Statistic title={"待处理请求"} prefix={componentUtils.getIcon("icon-money-finance-buyer")}
                   value={0} suffix={"条"}/>
    </div>;
}

function ResumeRequestComponent() {
    const [selected, setSelected] = useState<ApplicantResumeRequestStatusTableTuple | null>(null);
    return <div>
        <AcceptAndDelayRequestModel selected={selected}/>
        <Table columns={tableColumn}/>
    </div>;
}

function AcceptAndDelayRequestModel({selected}: { selected: ApplicantResumeRequestStatusTableTuple | null }) {
    return <Modal open={selected !== null}>

    </Modal>;
}