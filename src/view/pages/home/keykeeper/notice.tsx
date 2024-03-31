import {Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {KeyKeeperReceivedRequestStatusTableTuple} from "../../../../model/entity/user.ts";
import {useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";

const tableColumn: ColumnsType<KeyKeeperReceivedRequestStatusTableTuple> = [{}];
export default function KeyKeeperNotice() {
    const [flashFlag, changeAction] = useSwapBoolean();
    useEffect(() => {
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-2/3 px-8 py-4"}>
            <TableHeader title={"待上传请求"} onFresh={changeAction}/>
            <RequestTableComponent/>
        </div>
    </div>;
}

function RequestTableComponent() {
    const [selectedResume, setSelectResume] = useState<KeyKeeperReceivedRequestStatusTableTuple | null>(null);
    return <div>
        <UploadSubKeyComponent resume={selectedResume}/>
        <Table columns={tableColumn}/>
    </div>;
}

function UploadSubKeyComponent({resume}: { resume: KeyKeeperReceivedRequestStatusTableTuple | null }) {
    return <Modal open={resume !== null}>

    </Modal>;
}