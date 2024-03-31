import {Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {UploadSubKeyRequestInfo} from "../../../../model/entity/keykeeper.ts";


const tableColumn: ColumnsType<UploadSubKeyRequestInfo> = [{}];
export default function KeyKeeperNotice() {
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<UploadSubKeyRequestInfo[]>([]);
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-3/4 px-8 py-4"}>
            <TableHeader title={"待上传请求"} onFresh={changeAction}/>
            <RequestTableComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function RequestTableComponent({tableVal}:{tableVal:UploadSubKeyRequestInfo[]}) {
    const [selectedResume, setSelectResume] = useState<UploadSubKeyRequestInfo | null>(null);
    return <div>
        <UploadSubKeyModel resume={selectedResume}/>
        <Table columns={tableColumn} dataSource={tableVal}/>
    </div>;
}

function UploadSubKeyModel({resume}: { resume: UploadSubKeyRequestInfo | null }) {
    return <Modal open={resume !== null}>

    </Modal>;
}