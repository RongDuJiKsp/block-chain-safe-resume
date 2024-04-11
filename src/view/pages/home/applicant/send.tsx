import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {App, Button, Spin, Table} from "antd";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useBoolean} from "ahooks";
import {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ColumnsType} from "antd/es/table";
import {BasicEncryptInfo} from "../../../../model/entity/user.ts";
import {ColumnFilterItem} from "antd/es/table/interface";

export default function ApplicationSend() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [isLoading, loadingAction] = useBoolean();
    const [tableVal, setTableVal] = useState<BasicEncryptInfo[]>([]);
    useEffect(() => {
        loadingAction.setTrue();
        userService.getKKInfoForSendListAsync().then(r => {
            if (r.status) setTableVal(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        }).finally(loadingAction.setFalse);
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12 "}>
        <div className={"bg-white  px-6 py-4 basis-3/4 basic-shadow-box"}>
            <TableHeader title={"可分发kk"} onFresh={changeAction}/>
            <Spin spinning={isLoading} delay={500}>
                <ResumeHistoryTable tableVal={tableVal}/>
            </Spin>
        </div>
    </div>;
}

function ResumeHistoryTable({tableVal}: { tableVal: BasicEncryptInfo[] }) {
    const tableColumn: ColumnsType<BasicEncryptInfo> = [
        {
            title: "用户名",
            dataIndex: "name",
            width: "16%",
            align: "center",
            filterSearch(input: string, item: ColumnFilterItem): boolean {
                return input === item.value;
            }
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
            render(_, item: BasicEncryptInfo): ReactNode {
                return <span>
                    <Button onClick={() => console.log(item)}>Ok</Button>
                </span>;
            }
        }
    ];

    return <div>
        <Table<BasicEncryptInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                 pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}