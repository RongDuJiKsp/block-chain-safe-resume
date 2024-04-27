import React, {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {KeyKeeperWorkHook} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {App, Button, Form, Input, Modal, Table} from "antd";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {AuditResumeInfo} from "../../../../model/entity/keykeeper.ts";
import {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {useBoolean} from "ahooks";
import {LoadingOutlined} from "@ant-design/icons";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";

export default function KeyKeeperAuditPage(): ReactNode {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<AuditResumeInfo[]>([]);
    useEffect(() => {
        kkUserServer.getToBeAuditedListAsync().then(r => {
            if (r.status) {
                setTableVal(r.list);
                message.success("获取信息成功！").then();
            } else {
                message.error("获取信息失败，原因是:" + r.message).then();
            }
        });
    }, [flashFlag]);
    return <MainContainerProvider>
        <TableHeader title={"待审核简历"} onFresh={changeAction}/>
        <AuditTableComponent tableVal={tableVal}/>
    </MainContainerProvider>;
}

function AuditTableComponent({tableVal}: { tableVal: AuditResumeInfo[] }) {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [selectedToDelay, setSelectedToDelay] = useState<AuditResumeInfo | null>(null);
    const onAccept = (item: AuditResumeInfo) => {
        kkUserServer.acceptOrDelayResumeAsync(1, "", item.userName).then(r => {
            if (r.status) message.success("操作成功！").then();
            else message.error("操作失败，原因" + r.message).then();
        }).catch(e => {
            message.error("操作失败，原因" + e).then();
        });

    };
    const onDelay = (item: AuditResumeInfo) => {
        setSelectedToDelay(item);
    };
    const onClear = () => {
        setSelectedToDelay(null);
    };
    const onDownload = (item: AuditResumeInfo) => {
        FileSystemImpl.downloadToFileAsNameAsync(FileSystemImpl.readBase64AsBlob(item.fileBase64, "filetype"), "the resume of " + item.userName + "").then(
            () => {
                message.success("下载成功").then();
            }
        ).catch(e => {
            message.error("下载失败，原因" + e).then();
        });
    };
    const tableColumn: ColumnsType<AuditResumeInfo> = [
        {
            title: "用户名",
            dataIndex: "userName",
            width: "36%",
            align: "center",
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex"}>
                    <Button onClick={() => onAccept(item)} type={"primary"}>许可</Button>
                    <Button onClick={() => onDelay(item)} type={"primary"} danger={true}>打回</Button>
                    <Button onClick={() => onDownload(item)}>下载</Button>
                </div>;
            }
        }
    ];
    return <div className={"mx-28 my-3"}>
        <DelayWithResultModel clear={onClear} data={selectedToDelay}/>
        <Table<AuditResumeInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

interface ResultForm {
    msg: string;
}

function DelayWithResultModel({data, clear}: ModelPropsWithInfoAndClear<AuditResumeInfo>): ReactNode {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [isLoading, setLoading] = useBoolean();
    const onConformDelay = (msg: string) => {
        if (data === null) throw Error("怪了");
        if (isLoading) return;
        setLoading.setTrue();
        kkUserServer.acceptOrDelayResumeAsync(0, msg, data.userName).then(r => {
            if (r.status) {
                message.success("打回成功！").then();
                clear();
            } else message.error("打回失败，原因：" + r.message).then();
        }).catch(e => {
            message.error("打回失败，原因：" + e).then();
        }).finally(setLoading.setFalse);
    };
    return <Modal>
        <div className={"my-3"}>
            <p className={"my-3"}>
                请填写原因
            </p>
            <Form<ResultForm> onFinish={(values) => onConformDelay(values.msg)}>
                <Form.Item<ResultForm> name={"msg"}>
                    <Input.TextArea autoSize={{minRows: 5, maxRows: 5}}/>
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"}>{isLoading ?
                        <span><LoadingOutlined/>&thinsp;上传中&thinsp;... </span> :
                        <span>&ensp;打回简历&ensp;</span>
                    }</Button>
                </Form.Item>
            </Form>

        </div>
    </Modal>;
}
