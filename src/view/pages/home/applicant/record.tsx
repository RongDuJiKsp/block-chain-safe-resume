import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ResumeVisitHistoryInfo} from "../../../../model/entity/user.ts";


const tableColumn: ColumnsType<ResumeVisitHistoryInfo> = [{}];
export default function ApplicantRecord() {
    const userService = ApplicantWorkHooks.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ResumeVisitHistoryInfo[]>([]);
    useEffect(() => {
        userService.getResumeRequestHistoryListAsync().then(r => setTableVal(r.list));
        //TODO: flash render
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
        <Table<ResumeVisitHistoryInfo> columns={tableColumn} dataSource={tableVal}
                                       pagination={{pageSize: 5, showQuickJumper: true, position: ["topRight"]}}
        />
    </div>;
}