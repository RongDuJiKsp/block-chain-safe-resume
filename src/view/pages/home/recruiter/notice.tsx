import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {RecruiterHandledResumeStatusTableTuple} from "../../../../model/entity/user.ts";

const tableColumn: ColumnsType<RecruiterHandledResumeStatusTableTuple> = [{}];
export default function RecruiterNotice() {
    return <div className={"flex flex-col justify-center h-full-screen basic-window"}>
        <div className={"basis-2/3  mx-11  pt-6 px-6 work-window-color"}>
            <RecruiterHavingHandlesStatusTableComponent/>
        </div>
    </div>;
}

function RecruiterHavingHandlesStatusTableComponent() {
    return <div>
        <div className={"font-sans font-bold border-b-2 mb-2"}>累计下载记录</div>
        <Table columns={tableColumn}/>
    </div>;
}