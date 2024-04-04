import {App, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ResumeVisitHistoryInfo} from "../../../../model/entity/applicant.ts";


export default function ApplicantRecord() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ResumeVisitHistoryInfo[]>([]);
    useEffect(() => {
        userService.getResumeRequestHistoryListAsync().then(r => {
            if (r.status) setTableVal(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        });
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12 "}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4 basis-3/4"}>
            <TableHeader title={"访问记录"} onFresh={changeAction}/>
            <ResumeHistoryComponent tableVal={tableVal}/>
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
        align: "center"
    },
];

function ResumeHistoryComponent({tableVal}: { tableVal: ResumeVisitHistoryInfo[] }) {
    return <div>
        <Table<ResumeVisitHistoryInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                       pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}