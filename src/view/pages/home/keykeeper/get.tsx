import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useEffect, useState} from "react";
import {AccessibleSubKeyInfo} from "../../../../model/entity/keykeeper.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {Table} from "antd";
import {ColumnsType} from "antd/es/table";

const tableColumn: ColumnsType<AccessibleSubKeyInfo> = [];
export default function KeyKeeperGetSubKey() {
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<AccessibleSubKeyInfo[]>([]);
    useEffect(() => {

        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-3/4 px-8 py-4"}>
            <TableHeader title={"可保管子密钥"} onFresh={changeAction}/>
            <AccessibleSubKeyTableComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function AccessibleSubKeyTableComponent({tableVal}: { tableVal: AccessibleSubKeyInfo[] }) {
    return <div>
        <Table<AccessibleSubKeyInfo> columns={tableColumn} dataSource={tableVal}  bordered={true} size={"small"}
                                     pagination={{pageSize: 5, showQuickJumper: true, position: ["topRight"]}}
        />
    </div>;
}
