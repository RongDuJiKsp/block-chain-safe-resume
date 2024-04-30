import React, {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {KeyKeeperWorkHook} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {App, Button, Form, Input, Modal, Table} from "antd";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {ColumnsType} from "antd/es/table";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {useBoolean} from "ahooks";
import {LoadingOutlined} from "@ant-design/icons";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import {ToBeAuditedResume} from "../../../../model/http-bodys/user/keykeeper/res.ts";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";

export default function KeyKeeperAuditPage(): ReactNode {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [tableVal, setTableVal] = useState<ToBeAuditedResume[]>([]);
    useEffect(() => {
        kkUserServer.getToBeAuditedListAsync().then(r => {
            if (r.success) {
                setTableVal(r.data);
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

function AuditTableComponent({tableVal}: { tableVal: ToBeAuditedResume[] }) {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [selectedToDelay, setSelectedToDelay] = useState<ToBeAuditedResume | null>(null);
    const onAccept = (item: ToBeAuditedResume) => {
        kkUserServer.acceptOrDelayResumeAsync(true, "", item.username).then(r => {
            if (r.success) message.success("操作成功！").then();
            else message.error("操作失败，原因" + r.message).then();
        }).catch(e => {
            message.error("操作失败，原因" + e).then();
        });

    };
    const onDelay = (item: ToBeAuditedResume) => {
        console.log(item);
        setSelectedToDelay(item);
    };
    const onClear = () => {
        setSelectedToDelay(null);
    };
    const onDownload = (item: ToBeAuditedResume) => {
        console.log(item);
        kkUserServer.downloadToBeAuthoredResume(item.username).then(r => {
            FileSystemImpl.downloadMetaFileAsync(r).then();
        });

    };
    const tableColumn: ColumnsType<ToBeAuditedResume> = [
        {
            title: "用户名",
            dataIndex: "username",
            width: "26%",
            align: "center",
        },
        {
            title: "用户地址",
            dataIndex: "address",
            width: "43%",
            align: "center",
            ellipsis: true
        },
        {
            title: "操作",
            align: "center",
            render(_, item): ReactNode {
                return <div className={"justify-around flex gap-5"}>
                    <Button onClick={() => onAccept(item)} type={"primary"}>许可</Button>
                    <Button onClick={() => onDelay(item)} type={"primary"} danger={true}>打回</Button>
                    <Button onClick={() => onDownload(item)}>下载</Button>
                </div>;
            }
        }
    ];
    return <div className={"mx-28 my-3"}>
        <DelayWithResultModel clear={onClear} data={selectedToDelay}/>
        <Table<ToBeAuditedResume> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                  pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

interface ResultForm {
    msg: string;
}

function DelayWithResultModel({data, clear}: ModelPropsWithInfoAndClear<ToBeAuditedResume>): ReactNode {
    const kkUserServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [isLoading, setLoading] = useBoolean();
    const onConformDelay = (msg: string) => {
        console.log("打回");
        if (data === null) throw Error("怪了");
        if (isLoading) return;
        setLoading.setTrue();
        kkUserServer.acceptOrDelayResumeAsync(false, msg, data.username).then(r => {
            if (r.success) {
                message.success("打回成功！").then();
                clear();
            } else message.error("打回失败，原因：" + r.message).then();
        }).catch(e => {
            message.error("打回失败，原因：" + e).then();
        }).finally(()=>{
            setLoading.setFalse();
            clear();
        });
    };
    return <Modal open={data!==null} onCancel={clear} footer={null}>
        <div className={"my-3"}>
            <p className={"my-3"}>
                请填写原因
            </p>
            <Form<ResultForm> onFinish={(values) => onConformDelay(values.msg)}>
                <Form.Item<ResultForm> name={"msg"}>
                    <Input.TextArea autoSize={{minRows: 5, maxRows: 5}}/>
                </Form.Item>
                <Form.Item>
                    <button className={"button button-pill button-primary button-rounded button-raised"}>{isLoading ?
                        <span><LoadingOutlined/>&thinsp;上传中&thinsp;... </span> :
                        <span>&ensp;打回简历&ensp;</span>
                    }</button>
                </Form.Item>
            </Form>

        </div>
    </Modal>;
}
