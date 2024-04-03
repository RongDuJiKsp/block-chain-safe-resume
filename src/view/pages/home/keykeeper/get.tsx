import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {ReactNode, useEffect, useState} from "react";
import {AccessibleSubKeyInfo} from "../../../../model/entity/keykeeper.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {App, Button, Modal, Popconfirm, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {KeyKeeperWorkHook, UserWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {DownloadSubKeysRes} from "../../../../model/http-bodys/user/keykeeper/res.ts";
import {LoadingOutlined} from "@ant-design/icons";
import {useBoolean} from "ahooks";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import {FileTempleHandleImpl} from "../../../../controller/util/output.ts";


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
            width: "17%",
            align: "center"
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    <Popconfirm title={`确认获取保管该用户(${item.userName.substring(0, 8) + ".."})的子密钥？`}
                                onConfirm={() => onAccept(item)}>
                        <Button type={"primary"}>获取</Button>
                    </Popconfirm>
                </div>;
            }
        }
    ];
    return <div>
        <GetAccessibleSubKey data={selectedInfo} clear={onClearSelected}/>
        <Table<AccessibleSubKeyInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                     pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

function GetAccessibleSubKey({data, clear}: ModelPropsWithInfoAndClear<AccessibleSubKeyInfo>) {
    const {message} = App.useApp();
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {userInfo} = UserWorkHooks.useValue();
    const [keyPair, setKeyPair] = useState<DownloadSubKeysRes | null>(null);
    const [canBeClose, canBeCloseAction] = useBoolean();
    const onDownloadSubKey: CallBackWithSideEffect = () => {
        if (!keyPair || !data) {
            message.error("未获取到子密钥，请关闭浮窗后重试").then();
            return;
        }
        if (!userInfo) {
            message.error("登录状态异常，请退出后重试！").then();
            return;
        }
        FileSystemImpl.downloadToFileFromSuffixAsync(new Blob([FileTempleHandleImpl.getKeyKeeperSubKey(String(keyPair.x), String(keyPair.m), String(keyPair.p), String(keyPair.i), data.userName, userInfo.nick,)]), `${data.userName} hand by ${userInfo.address.substring(0, 6)}...`, "key").then(() => {
            message.success("下载成功！").then();
            canBeCloseAction.setTrue();
        });

    };
    useEffect(() => {
        if (data === null) return;
        canBeCloseAction.setFalse();
        kkUserServer.downloadSubKeyAsync(data.userName, data.address).then(r => {
            console.log(r);
            if (r.status) {
                message.success("获取子密钥成功，请下载子密钥").then();
                setKeyPair(r);
            } else {
                message.error("获取子密钥失败，原因为" + r.message).then();
                setKeyPair(null);
                clear();
            }
        });

    }, [data]);
    return <Modal open={data !== null}
                  onCancel={canBeClose ? clear : () => message.warning("不保存子密钥是不准退出的喵~").then()}
                  footer={null}>
        <div className={"my-5"}>
            {keyPair === null ?
                <div>
                    <LoadingOutlined/> 正在下载子密钥，请稍后，请不要关闭该页面.....
                </div> :
                <div className={"py-8"}>
                    <p>请下载子密钥并且妥善保管，在需要上传子密钥时及时上传子密钥可以获得奖励，未妥善保管或上传错误将会获得处罚！</p>
                    <div className={"flex justify-center my-3"}>
                        <button className={"button button-3d button-caution "} onClick={onDownloadSubKey}>下载子密钥
                        </button>
                    </div>
                </div>}
        </div>
    </Modal>;
}