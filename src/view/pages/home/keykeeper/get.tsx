import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import React, {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {App, Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {KeyKeeperWorkHook, UserWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {KKDownloadKeyRes} from "../../../../model/http-bodys/user/keykeeper/res.ts";
import {useBoolean} from "ahooks";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import {FileTempleHandleImpl} from "../../../../controller/util/output.ts";
import {BasicInfo} from "../../../../model/entity/user.ts";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";


export default function KeyKeeperGetSubKey() {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<BasicInfo[]>([]);
    useEffect(() => {
        kkUserServer.getSavedSubKeyListAsync().then(r => {
            if (r.status) {
                setTableVal(r.list);
                message.success("获取信息成功！").then();
            } else {
                message.error("获取信息失败，原因是:" + r.message).then();
            }
        });
    }, [flashFlag]);
    return <MainContainerProvider>
        <TableHeader title={"可保管秘密份额"} onFresh={changeAction}/>
        <AccessibleSubKeyTableComponent tableVal={tableVal}/>
    </MainContainerProvider>;
}

function AccessibleSubKeyTableComponent({tableVal}: { tableVal: BasicInfo[] }) {
    const [selectedInfo, setSelectedInfo] = useState<BasicInfo | null>(null);
    const onAccept = (info: BasicInfo) => {
        setSelectedInfo(info);
    };
    const onClearSelected: CallBackWithSideEffect = () => {
        setSelectedInfo(null);
    };
    const tableColumn: ColumnsType<BasicInfo> = [
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
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item, index): ReactNode {
                return <div className={"justify-around flex"} key={"of" + index}>
                    <Button type={"primary"} onClick={() => onAccept(item)}>获取</Button>
                </div>;
            }
        }
    ];
    return <div className={"mx-28 my-3"}>
        <GetAccessibleSubKey data={selectedInfo} clear={onClearSelected}/>
        <Table<BasicInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                          pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}


function GetAccessibleSubKey({data, clear}: ModelPropsWithInfoAndClear<BasicInfo>) {
    const {message} = App.useApp();
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {userInfo} = UserWorkHooks.useValue();
    const [keyPair, setKeyPair] = useState<KKDownloadKeyRes | null>(null);
    const [canBeClose, canBeCloseAction] = useBoolean();
    const [selectedFiles, setSelectFiles] = useState<File[]>([]);
    const onDownloadSubKey: CallBackWithSideEffect = () => {
        if (!keyPair || !data) {
            message.error("未获取到秘密份额，请关闭浮窗后重试").then();
            return;
        }
        if (!userInfo) {
            message.error("登录状态异常，请退出后重试！").then();
            return;
        }
        FileSystemImpl.downloadToFileFromSuffixAsync(new Blob([FileTempleHandleImpl.getKeyKeeperSubKey(String(keyPair.x), String(keyPair.m), String(keyPair.i), data.userName, userInfo.nick)]), `${data.userName} hand by ${userInfo.address.substring(0, 6)}...`, "key").then(() => {
            message.success("下载成功！").then();
            canBeCloseAction.setTrue();
        });

    };
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files === null) return;
        setSelectFiles(Array.from(event.target.files));
    };
    const onFinish = () => {
        if (data === null) {
            message.error("登录状态异常，请退出后重试！").then();
            return;
        }
        kkUserServer.downloadSubKeyAsync(selectedFiles[0], data.address).then(r => {
            if (r.status) {
                setKeyPair(r);
            } else {
                message.error(r.message).then();
            }
        }).catch(e => {
            message.error(e.toString()).then();
        });
    };
    return <Modal open={data !== null}
                  onCancel={canBeClose || keyPair === null ? clear : () => message.warning("不保存秘密份额是不准退出的喵~").then()}
                  footer={null}>
        <div className={"my-5"}>
            {keyPair === null ?
                <div>
                    <div className={"flex justify-center my-3"}>
                        <input type="file" onChange={onSelectFile}/>
                    </div>
                    <div className={"flex justify-center"} onClick={onFinish}>
                        <button className={"button button-3d button-primary "}>解析秘密份额</button>
                    </div>
                </div> :
                <div className={"py-8"}>
                    <p>请下载秘密份额并且妥善保管，在需要上传秘密份额时及时上传秘密份额可以获得奖励，未妥善保管或上传错误将会获得处罚！</p>
                    <div className={"flex justify-center my-3"}>
                        <button className={"button button-3d button-caution "} onClick={onDownloadSubKey}>下载秘密份额
                        </button>
                    </div>
                </div>}
        </div>
    </Modal>;
}

