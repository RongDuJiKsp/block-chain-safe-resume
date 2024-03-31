import {Modal, Statistic, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {componentUtils} from "../../../../controller/util/component.tsx";
import CountUp from "react-countup";
import {useCallback, useEffect, useState} from "react";
import {ResumeInfoRes} from "../../../../model/http-bodys/ress.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";

interface ApplicantResumeRequestStatusTableTuple {

}

const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

const tableColumn: ColumnsType<ApplicantResumeRequestStatusTableTuple> = [{}];
export default function ApplicantStatus() {
    const userService = ApplicantWorkHooks.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [resumeInfo, setResumeInfo] = useState<ResumeInfoRes | null>(null);
    useEffect(() => {
        userService.getResumeInfoAsync().then(r => setResumeInfo(r));
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <TableHeader title={"访问请求"} onFresh={changeAction}/>
            <ResumeRequestComponent/>
        </div>
        <div className={" bg-white py-8"}>
            <ResumeInfoComponent info={resumeInfo}/>
        </div>

    </div>;
}

function ResumeInfoComponent({info}: { info: ResumeInfoRes | null }) {

    return <div className={"flex justify-around"}>
        <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                   value={info?.downloadtimes} suffix={"次"} formatter={numberCountUpFormatter}/>
        <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")}
                   value={info?.putTime}/>
        <Statistic title={"待处理请求"} prefix={componentUtils.getIcon("icon-money-finance-buyer")}
                   value={0} suffix={"条"}/>
    </div>;
}

function ResumeRequestComponent() {
    const [selected, setSelected] = useState<ApplicantResumeRequestStatusTableTuple | null>(null);
    const cleanSelected = useCallback(() => {
        setSelected(null);
    }, []);
    return <div>
        <AcceptAndDelayRequestModel selected={selected} finish={cleanSelected}/>
        <Table columns={tableColumn}/>
    </div>;
}

function AcceptAndDelayRequestModel({selected, finish}: {
    selected: ApplicantResumeRequestStatusTableTuple | null,
    finish: CallBackWithSideEffect
}) {
    return <Modal open={selected !== null} onOk={finish} onCancel={finish}>
        {String(selected)}
    </Modal>;
}