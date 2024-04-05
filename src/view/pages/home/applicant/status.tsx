import {App, Button, Popconfirm, Statistic, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {componentUtils} from "../../../../controller/util/component.tsx";
import CountUp from "react-countup";
import React, {ReactNode, useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ResumeLicenseRequestInfo} from "../../../../model/entity/applicant.ts";
import {ResumeInfoRes} from "../../../../model/http-bodys/user/applicant/res.ts";
import dayjs from "dayjs";


export default function ApplicantStatus() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [resumeInfo, setResumeInfo] = useState<ResumeInfoRes | null>(null);
    const [tableInfo, setTableInfo] = useState<ResumeLicenseRequestInfo[]>([]);
    useEffect(() => {
        userService.getResumeInfoAsync().then(r => {
            if (r.status) setResumeInfo(r);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        });
        userService.getResumeRequestListAsync().then(r => {
            if (r.status) setTableInfo(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        });
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-6"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4 basis-3/4"}>
            <TableHeader title={"访问请求"} onFresh={changeAction}/>
            <ResumeRequestComponent tableVal={tableInfo}/>
        </div>
        <div className={" bg-white py-8 "}>
            <ResumeInfoComponent info={resumeInfo}/>
        </div>

    </div>;
}
const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

function ResumeInfoComponent({info}: { info: ResumeInfoRes | null }) {
    console.log(info);
    return <div className={"flex justify-around"}>
        <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                   value={info?.downloadtimes} suffix={"次"} formatter={numberCountUpFormatter}/>
        <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")} className={"basis-1/5"}
                   value={info && info.putTime ?dayjs.unix(info.putTime).format("YYYY-MM-DD HH:mm"):"加载中..."}/>
        <Statistic title={"待处理请求"} prefix={componentUtils.getIcon("icon-money-finance-buyer")}
                   value={0} suffix={"条"}/>
    </div>;
}


function ResumeRequestComponent({tableVal}: { tableVal: ResumeLicenseRequestInfo[] }) {
    const apService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const onOpResumeLicense = (status: number, data: ResumeLicenseRequestInfo): void => {
        apService.giveOrDelayResumeLicensingAsync(data.address, status).then(r => {
            if (r.status) message.success("操作成功").then();
            else message.error("操作失败，原因：" + r.message).then();
        })
            .catch(e => message.error(e.toString()));
    };

    const tableColumn: ColumnsType<ResumeLicenseRequestInfo> = [
        {
            title: "用户名",
            dataIndex: "username",
            width: "16%",
            align: "center",
        },
        {
            title: "地址",
            dataIndex: "address",
            align: "center"
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, rec): ReactNode {
                return <div className={"justify-around flex"}>
                    {rec.status ? <Tag color={"green"}>已授权</Tag> :
                        <>
                            <Popconfirm title={"确认对用户进行授权？"} onConfirm={() => onOpResumeLicense(1, rec)}>
                                <Button type={"primary"}>授权</Button>
                            </Popconfirm>
                            <Popconfirm title={"确认拒绝用户授权？"} onConfirm={() => onOpResumeLicense(0, rec)}>
                                <Button type={"primary"} danger={true}>拒绝</Button>
                            </Popconfirm>
                        </>}
                </div>;
            },
            filters: [
                {text: "未处理", value: false},
                {text: "已授权", value: true}
            ],
            onFilter(value: boolean | React.Key, record: ResumeLicenseRequestInfo): boolean {
                return Boolean(record.status) === value;
            },
            filterResetToDefaultFilteredValue: true,
        },


    ];
    return <div>
        <div className={"mx-28 my-3"}>
            <Table<ResumeLicenseRequestInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                             pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}/>
        </div>
    </div>;
}

