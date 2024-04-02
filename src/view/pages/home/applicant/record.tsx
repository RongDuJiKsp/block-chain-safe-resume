import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ResumeVisitHistoryInfo} from "../../../../model/entity/applicant.ts";


const tableColumn: ColumnsType<ResumeVisitHistoryInfo> = [{}];//TODO:和后端确定历史记录的内容
export default function ApplicantRecord() {
    const userService = ApplicantWorkHooks.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ResumeVisitHistoryInfo[]>([]);
    useEffect(() => {
        userService.getResumeRequestHistoryListAsync().then(r => setTableVal(r.list));
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12 "}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4 basis-3/4"}>
            <TableHeader title={"访问记录"} onFresh={changeAction}/>
            <ResumeHistoryComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function ResumeHistoryComponent({tableVal}: { tableVal: ResumeVisitHistoryInfo[] }) {
    return <div>
        <Table<ResumeVisitHistoryInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                       pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}