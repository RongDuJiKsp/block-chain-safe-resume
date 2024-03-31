import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ApplicantResumeVisitStatusTableTuple} from "../../../../model/entity/user.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";

const tableColumn: ColumnsType<ApplicantResumeVisitStatusTableTuple> = [{}];
export default function ApplicantRecord() {
    const [flashFlag, changeAction] = useSwapBoolean();
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <TableHeader title={"访问记录"} onFresh={changeAction}/>
            <ResumeHistoryComponent/>
        </div>
    </div>;
}

function ResumeHistoryComponent() {
    return <div>
        <Table columns={tableColumn}/>
    </div>;
}