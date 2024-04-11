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
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<AccessibleSubKeyInfo[]>([]);
    useEffect(() => {
        kkUserServer.getAccessibleSubKeyListAsync().then(r => {
            if (r.status) {
                setTableVal(r.list);
                message.success("获取信息成功！").then();
            } else {
                message.error("获取信息失败，原因是:" + r.message).then();
            }
        });
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center gap-14 basic-window h-full-screen"}>
        <div className={"work-window-color basis-3/4 px-8 py-4 basic-shadow-box"}>
            <TableHeader title={"可保管子密钥"} onFresh={changeAction}/>
            <AccessibleSubKeyTableComponent tableVal={tableVal}/>
        </div>
    </div>;
}

function AccessibleSubKeyTableComponent({tableVal}: { tableVal: AccessibleSubKeyInfo[] }) {
    const {message} = App.useApp();
    const [selectedInfo, setSelectedInfo] = useState<AccessibleSubKeyInfo | null>(null);
    const [withoutPermission, setWithoutPermission] = useBoolean();
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
            render(_, item, index): ReactNode {
                return <div className={"justify-around flex"} key={"of" + index}>
                    <Popconfirm title={`确认获取保管该用户(${item.userName.substring(0, 8) + ".."})的子密钥？`}
                                onConfirm={() => onAccept(item)}>
                        <Button type={"primary"}>获取</Button>
                    </Popconfirm>
                </div>;
            }
        }
    ];
    return <div className={"mx-28 my-3"}>
        <GetPermissionToBeKK clear={setWithoutPermission.setFalse} data={withoutPermission}/>
        <GetAccessibleSubKey data={selectedInfo} clear={onClearSelected}/>
        <Table<AccessibleSubKeyInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                     pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
        <div className={"mt-7"}>提示未成为合法的密钥保管人？
            <span onClick={setWithoutPermission.setTrue} className={"text-gray-400 underline underline-offset-4"}>点击这里申请成为保管人</span>
        </div>
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

function GetPermissionToBeKK({data, clear}: ModelPropsWithInfoAndClear<boolean>) {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const [isLoading, setLoading] = useBoolean();
    const {message} = App.useApp();
    const onGetPermission: CallBackWithSideEffect = () => {
        setLoading.setTrue();
        kkUserServer.getPermissionToBeKK().then(r => {
            console.log(r);
            if (r.status) {
                message.success("操作成功！").then();
                clear();
            } else {
                message.error("发生错误:" + r.message).then();
            }
        }).catch(e => {
            message.error("发生错误:" + e.toString()).then();
        }).finally(() => {
            setLoading.setFalse();
        });
    };
    return <Modal open={!!data} footer={null} onCancel={clear}>
        <div className={"my-3"}>
            <p className={"my-3"}>
                请点击按钮获取保管子密钥权限
                系统将自动质押积分以获取权限
            </p>
            <Button type={"primary"} onClick={onGetPermission}>{isLoading ?
                <span><LoadingOutlined/>&thinsp;获取中&thinsp;... </span> :
                <span>&ensp;获取权限&ensp;</span>
            }</Button>
        </div>
    </Modal>;
}