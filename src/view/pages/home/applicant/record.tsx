import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ApplicantResumeVisitStatusTableTuple} from "../../../../model/entity/user.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect} from "react";

const tableColumn: ColumnsType<ApplicantResumeVisitStatusTableTuple> = [{}];
export default function ApplicantRecord() {
    const [flashFlag, changeAction] = useSwapBoolean();
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <div className={"flex justify-between pb-4 border-b-2"}>
                <div className={"font-sans font-bold my-auto"}>访问记录</div>
                <button className={"button button-primary "} onClick={changeAction}>刷新</button>
            </div>
            <ResumeHistoryComponent/>
        </div>
    </div>;
}

function ResumeHistoryComponent() {
    return <div>
        <Table columns={tableColumn}/>
    </div>;
}