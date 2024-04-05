import {App, Button, Modal, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ReactNode, useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {UploadSubKeyRequestInfo} from "../../../../model/entity/keykeeper.ts";
import {KeyKeeperWorkHook} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import dayjs from "dayjs";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {useBoolean} from "ahooks";


export default function KeyKeeperNotice() {
    const kkServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [isLoading, loadingAction] = useBoolean();
    const [tableVal, setTableVal] = useState<UploadSubKeyRequestInfo[]>([]);
    useEffect(() => {
        loadingAction.setTrue();
        kkServer.getRequestListAsync().then(r => {
            if (r.status) {
                setTableVal(r.list);
                message.success("信息获取成功").then();
            } else {
                message.error("发生错误：" + r.message).then();
            }
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        }).finally(loadingAction.setFalse);
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-3/4 px-8 py-4"}>
            <TableHeader title={"待上传请求"} onFresh={changeAction}/>
            <Spin spinning={isLoading} delay={500}>
                <RequestTableComponent tableVal={tableVal}/>
            </Spin>
        </div>
    </div>;
}

function RequestTableComponent({tableVal}: { tableVal: UploadSubKeyRequestInfo[] }) {
    const [selectedResume, setSelectResume] = useState<UploadSubKeyRequestInfo | null>(null);
    const onClear: CallBackWithSideEffect = () => {
        setSelectResume(null);
    };
    const tableColumn: ColumnsType<UploadSubKeyRequestInfo> = [
        {
            title: "用户名",
            dataIndex: "ApUserName",
            width: "36%",
            align: "center",
        },
        {
            title: "时间",
            dataIndex: "time",
            align: "center",
            render(val: number): ReactNode {
                return <span>
                   {dayjs.unix(val).format("YYYY-MM-DD HH:mm:ss dddd")}
                </span>;
            }
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    <Button onClick={() => setSelectResume(item)} type={"primary"}>上传</Button>
                </div>;
            }
        }
    ];
    return <div>
        <UploadSubKeyModel data={selectedResume} clear={onClear}/>
        <Table<UploadSubKeyRequestInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                        pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

function UploadSubKeyModel({data}: ModelPropsWithInfoAndClear<UploadSubKeyRequestInfo>) {
    return <Modal open={data !== null}>

    </Modal>;
}