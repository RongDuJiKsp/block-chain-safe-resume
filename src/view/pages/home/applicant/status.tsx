import {App, Button, Popconfirm, Spin, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import React, {ReactNode, useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {ResumeLicenseRequestInfo} from "../../../../model/entity/applicant.ts";
import {useBoolean} from "ahooks";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";


export default function ApplicantStatus() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();

    const [tableInfo, setTableInfo] = useState<ResumeLicenseRequestInfo[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    useEffect(() => {
        loadingAction.setTrue();
        userService.getResumeRequestListAsync().then(r => {
            if (r.status) setTableInfo(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        }).finally(loadingAction.setFalse);
    }, [flashFlag]);
    return <MainContainerProvider>
        <TableHeader title={"访问请求"} onFresh={changeAction}/>
        <Spin delay={500} spinning={isLoading}>
            <ResumeRequestComponent tableVal={tableInfo}/>
        </Spin>
    </MainContainerProvider>;
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
    return <div className={"mx-28 my-3"}>
        <Table<ResumeLicenseRequestInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                         pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}/>
    </div>;
}

