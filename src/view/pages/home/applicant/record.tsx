import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ApplicantResumeVisitStatusTuple} from "../../../../model/entity/user.ts";

const tableColumn: ColumnsType<ApplicantResumeVisitStatusTuple> = [{}];
export default function ApplicantRecord() {
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <ResumeHistoryComponent/>
        </div>
    </div>;
}

function ResumeHistoryComponent() {
    return <div>
        <div className={"font-sans font-bold border-b-2 mb-2"}>累计下载记录</div>
        <Table columns={tableColumn}/>
    </div>;
}