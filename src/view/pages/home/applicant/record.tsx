import {App, Spin, Statistic, Table, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import React, {useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {ResumeVisitHistoryInfo} from "../../../../model/entity/applicant.ts";
import {useBoolean} from "ahooks";
import CountUp from "react-countup";
import {ResumeInfoRes} from "../../../../model/http-bodys/user/applicant/res.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import dayjs from "dayjs";


export default function ApplicantRecord() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [isLoading, loadingAction] = useBoolean();
    const [tableVal, setTableVal] = useState<ResumeVisitHistoryInfo[]>([]);
    const [resumeInfo, setResumeInfo] = useState<ResumeInfoRes | null>(null);
    useEffect(() => {
        loadingAction.setTrue();
        userService.getResumeRequestHistoryListAsync().then(r => {
            r.list.sort((a, b) => Number(a.downloadTime) - Number(b.downloadTime));
            if (r.status) setTableVal(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        }).finally(loadingAction.setFalse);
        userService.getResumeInfoAsync().then(r => {
            if (r.status === 1) {
                setResumeInfo(r);
            } else if (r.status === 2) {
                message.info("没有查询到上传的信息，请上传信息").then();
            } else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        });
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-4 "}>
        <div className={"bg-white  px-6 py-4 basis-3/4 basic-shadow-box"}>
            <TableHeader title={"访问记录"} onFresh={changeAction}/>
            <Spin spinning={isLoading} delay={500}>
                <ResumeHistoryTable tableVal={tableVal}/>
            </Spin>
        </div>
        <div className={"bg-white py-8 basic-shadow-box "}>
            <ResumeInfoComponent info={resumeInfo} firstInfo={tableVal.length ? tableVal[0] : null}/>
        </div>
    </div>;
}
const tableColumn: ColumnsType<ResumeVisitHistoryInfo> = [
    {
        title: "用户名",
        dataIndex: "ReUserName",
        width: "16%",
        align: "center",
    },
    {
        title: "下载时间",
        dataIndex: "downloadTime",
        align: "center",
        render(unixTime: string) {
            return dayjs.unix(Number(unixTime)).format("YYYY-MM-DD HH:mm");
        }
    },
];

function ResumeHistoryTable({tableVal}: { tableVal: ResumeVisitHistoryInfo[] }) {
    return <div className={"mx-28 my-3"}>
        <Table<ResumeVisitHistoryInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                       pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

function ResumeInfoComponent({info, firstInfo}: {
    info: ResumeInfoRes | null,
    firstInfo: ResumeVisitHistoryInfo | null
}) {
    console.log(info);
    return <div className={"flex justify-around"}>
        <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                   value={info?.downloadtimes} suffix={"次"} formatter={numberCountUpFormatter}/>
        <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")}
                   value={info && info.putTime ? dayjs.unix(info.putTime).format("YYYY-MM-DD HH:mm") : "N/A"}/>
        <Statistic title={"最新访问时间"} prefix={componentUtils.getIcon("icon-keyhole")}
                   value={firstInfo ? dayjs.unix(Number(firstInfo.downloadTime)).format("YYYY-MM-DD HH:mm") : "N/A"}/>

    </div>;
}
