import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {ReactNode, useEffect, useState} from "react";
import {AccessibleSubKeyInfo} from "../../../../model/entity/keykeeper.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {App, Button, Modal, Popconfirm, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {KeyKeeperWorkHook} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";


export default function KeyKeeperGetSubKey() {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<AccessibleSubKeyInfo[]>([]);
    useEffect(() => {
        kkUserServer.getAccessibleSubKeyListAsync().then(r => setTableVal(r.list));
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-3/4 px-8 py-4"}>
            <TableHeader title={"可保管子密钥"} onFresh={changeAction}/>
            <AccessibleSubKeyTableComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function AccessibleSubKeyTableComponent({tableVal}: { tableVal: AccessibleSubKeyInfo[] }) {
    const {message} = App.useApp();
    const [selectedInfo, setSelectedInfo] = useState<AccessibleSubKeyInfo | null>(null);
    const onAccept = (info: AccessibleSubKeyInfo) => {
        message.info("正在发起请求，请稍后...").then();
        setSelectedInfo(info);
    };
    const onClearSelected: CallBackWithSideEffect = () => {
        setSelectedInfo(null);
    };
    const tableColumn: ColumnsType<AccessibleSubKeyInfo> = [
        {
            title: "用户名",
            dataIndex: "userName",
            width: "16%",
            align: "center",
        },
        {
            title: "地址",
            dataIndex: "address",
            align: "center"
        },
        {
            title: "剩余份额",
            dataIndex: "amount",
            align: "center"
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    <Popconfirm title={"确认获取该用户子密钥？"} onConfirm={() => onAccept(item)}>
                        <Button type={"primary"}>获取</Button>
                    </Popconfirm>
                </div>;
            }
        }
    ];
    return <div>
        <GetAccessibleSubKey data={selectedInfo} clear={onClearSelected}/>
        <Table<AccessibleSubKeyInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                     pagination={{pageSize: 5, showQuickJumper: true, position: ["topRight"]}}
        />
    </div>;
}

function GetAccessibleSubKey({data, clear}: ModelPropsWithInfoAndClear<AccessibleSubKeyInfo>) {

    useEffect(() => {

    }, [data]);
    return <Modal open={data !== null} onCancel={clear} footer={null}>
        <div className={"my-5"}>

        </div>
    </Modal>;
}