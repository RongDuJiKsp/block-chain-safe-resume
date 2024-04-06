import {App, Button, Spin, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ConnectingResumeInfo} from "../../../../model/entity/recruiter.ts";
import {RecruiterWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {useBoolean} from "ahooks";


export default function RecruiterNotice() {
    const userService = RecruiterWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ConnectingResumeInfo[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    useEffect(() => {
        userService.getResumeStatusListAsync().then(r => setTableVal(r.list)).catch(e => message.success(e.toString()).then()).finally(loadingAction.setFalse);
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window"}>
        <div className={"basis-3/4  mx-11  pt-6 px-6 work-window-color"}>
            <TableHeader title={"申请简历状态"} onFresh={changeAction}/>
            <Spin spinning={isLoading} delay={500}>
                <RecruiterHavingHandlesStatusTableComponent tableVal={tableVal}/>
            </Spin>
        </div>
    </div>;
}

function RecruiterHavingHandlesStatusTableComponent({tableVal}: { tableVal: ConnectingResumeInfo[] }) {
    const userService = RecruiterWorkHooks.useMethod();
    const {message} = App.useApp();
    const [isLoading, loadingAction] = useBoolean();

    const onDownloadResume = (info: ConnectingResumeInfo) => {
        loadingAction.setTrue();
        userService.autoDownloadFile(info.ApAddress, info.ApUserName)
            .then((): void => {
                message.success("文件下载成功").then();
            })
            .catch((e): void => {
                message.error("文件下载失败，原因为 " + e.toString()).then();
            })
            .finally(loadingAction.setFalse);
    };
    const tableColumn: ColumnsType<ConnectingResumeInfo> = [
        {
            title: "用户名",
            dataIndex: "ApUserName",
            width: "16%",
            align: "center",
        },
        {
            title: "地址",
            dataIndex: "ApAddress",
            align: "center"
        },
        {
            title: "状态",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    {item.status ?
                        <Tag color="green">获取成功</Tag> :
                        <Tag color="volcano">等待中</Tag>
                    }
                </div>;
            }

        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    {item.status ?
                        <Button type={"primary"}
                                onClick={() => onDownloadResume(item)}>下载简历</Button> :
                        <div>等待中</div>
                    }
                </div>;
            }
        }
    ];
    return <div>
        <Spin spinning={isLoading} fullscreen delay={500}/>
        <Table<ConnectingResumeInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                     pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}