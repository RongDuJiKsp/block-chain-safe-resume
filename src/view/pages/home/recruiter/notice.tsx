import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ConnectingResumeInfo} from "../../../../model/entity/user.ts";
import {RecruiterWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";


const tableColumn: ColumnsType<ConnectingResumeInfo> = [{}];
export default function RecruiterNotice() {
    const userService = RecruiterWorkHooks.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ConnectingResumeInfo[]>([]);
    useEffect(() => {
        userService.getResumeStatusListAsync().then(r => setTableVal(r.list));
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window"}>
        <div className={"basis-3/4  mx-11  pt-6 px-6 work-window-color"}>
            <TableHeader title={"申请简历状态"} onFresh={changeAction}/>
            <RecruiterHavingHandlesStatusTableComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function RecruiterHavingHandlesStatusTableComponent({tableVal}: { tableVal: ConnectingResumeInfo[] }) {
    return <div>
        <Table<ConnectingResumeInfo> columns={tableColumn} dataSource={tableVal}
                                     pagination={{pageSize: 5, showQuickJumper: true, position: ["topRight"]}}
        />
    </div>;
}