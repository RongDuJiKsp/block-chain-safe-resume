import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";

interface RecruiterHandledResumeStatusTableTuple {

}

const tableColumn: ColumnsType<RecruiterHandledResumeStatusTableTuple> = [{}];
export default function RecruiterNotice() {
    const [flashFlag, changeAction] = useSwapBoolean();
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window"}>
        <div className={"basis-2/3  mx-11  pt-6 px-6 work-window-color"}>
            <TableHeader title={"申请简历状态"} onFresh={changeAction}/>
            <RecruiterHavingHandlesStatusTableComponent/>
        </div>
    </div>;
}

function RecruiterHavingHandlesStatusTableComponent() {
    return <div>
        <Table columns={tableColumn}/>
    </div>;
}