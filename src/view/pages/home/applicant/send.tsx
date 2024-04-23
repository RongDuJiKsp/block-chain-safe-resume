import {ApplicantWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {App, Button, Form, Input, InputNumber, Modal, Spin, Table} from "antd";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import {useBoolean} from "ahooks";
import {ReactNode, useEffect, useState} from "react";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ColumnsType} from "antd/es/table";
import {BasicEncryptInfo} from "../../../../model/entity/user.ts";
import {ColumnFilterItem} from "antd/es/table/interface";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {useForm} from "antd/es/form/Form";
import {UploadKeyReq} from "../../../../model/http-bodys/user/keykeeper/req.ts";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";

export default function ApplicationSend() {
    const userService = ApplicantWorkHooks.useMethod();
    const {message} = App.useApp();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [isLoading, loadingAction] = useBoolean();
    const [tableVal, setTableVal] = useState<BasicEncryptInfo[]>([]);
    useEffect(() => {
        loadingAction.setTrue();
        userService.getKKInfoForSendListAsync().then(r => {
            if (r.status) setTableVal(r.list);
            else message.error("获取更新时发生失败，原因:" + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error(e.toString()).then();
        }).finally(loadingAction.setFalse);
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12 "}>
        <div className={"bg-white  px-6 py-4 basis-3/4 basic-shadow-box"}>
            <TableHeader title={"可分发kk"} onFresh={changeAction}/>
            <Spin spinning={isLoading} delay={500}>
                <ResumeHistoryTable tableVal={tableVal}/>
            </Spin>
        </div>
    </div>;
}

function ResumeHistoryTable({tableVal}: { tableVal: BasicEncryptInfo[] }) {
    const {message}=App.useApp();
    const [selectedInfo, setSelectInfo] = useState<BasicEncryptInfo | null>(null);
    const clear: CallBackWithSideEffect = () => {
        setSelectInfo(null);
    };
    const onDownloadPEM = (val: string, username: string) => {
        message.success("正在下载公钥证书！").then();
        FileSystemImpl.downloadToFileAsNameAsync(new Blob([val]), "public Key of " + username + ".pem").then();
    };
    const tableColumn: ColumnsType<BasicEncryptInfo> = [
        {
            title: "用户名",
            dataIndex: "name",
            width: "16%",
            align: "center",
            filterSearch(input: string, item: ColumnFilterItem): boolean {
                return input === item.value;
            }
        },
        {
            title: "地址",
            dataIndex: "address",
            align: "center"
        },
        {
            dataIndex: "publicKey",
            align: "center",
            width: "18%",
            title: "公钥",
            render(val: string, item: BasicEncryptInfo) {
                return <div onClick={() => onDownloadPEM(val, item.name)}>{val.substring(30, 46) + "..."}</div>;
            }
        },
        {
            title: "操作",
            width: "17%",
            align: "center",
            render(_, item: BasicEncryptInfo): ReactNode {
                return <span>
                    <Button onClick={() => setSelectInfo(item)}>授予份额</Button>
                </span>;
            }
        }
    ];

    return <div className={"mx-28 my-3"}>
        <UploadSubKeyModel clear={clear} data={selectedInfo}/>
        <Table<BasicEncryptInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                 pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

function UploadSubKeyModel({data, clear}: ModelPropsWithInfoAndClear<BasicEncryptInfo | null>) {
    const {message} = App.useApp();
    const apServer = ApplicantWorkHooks.useMethod();
    const [conformLoading, conformLoadingAction] = useBoolean();
    const [formRef] = useForm<UploadKeyReq>();
    const onConform = (val: UploadKeyReq): void => {
        if (data === null) return;
        conformLoadingAction.setTrue();
        apServer.sendSubKeyToKKAsync(String(val.x), String(val.m), String(val.i), data.publicKey, data.address).then(r => {
            if (r.status) {
                message.success("上传成功").then();
                clear();
            } else message.error("上传失败，原因为 " + r.message).then();
        }).catch(e => {
            console.error(e);
            message.error("发生错误，错误为：" + e).then();
        }).finally(conformLoadingAction.setFalse);
    };


    return <Modal open={data !== null} onCancel={clear} onOk={formRef.submit} destroyOnClose={true}
                  confirmLoading={conformLoading}>
        <div className={"my-6"}>
            <div className={"flex flex-col gap-4 my-3"}>
                <p>请确认当前选择的用户</p>
                <p>用户名 : {data?.name}</p>
                <p>公钥 : {data?.publicKey?.substring(30, 62) + "..."}</p>
                <p>请在此为指定用户分发密钥</p>
            </div>
            <div>
                <Form<UploadKeyReq> form={formRef} onFinish={onConform} labelCol={{span: 6}} preserve={false}>
                    <Form.Item<UploadKeyReq> label={"密钥位次"} name={"i"} rules={[{required: true}]}>
                        <InputNumber min={0} max={4}/>
                    </Form.Item>
                    <div className={"w-2/3"}>
                        <Form.Item<UploadKeyReq> label={"X Key"} name={"x"} rules={[{
                            pattern: /[1-9]+/,
                            message: "密钥未填写或不规范！",
                            required: true
                        }]}>
                            <Input allowClear/>
                        </Form.Item>
                        <Form.Item<UploadKeyReq> label={"M Key"} name={"m"} rules={[{
                            pattern: /[1-9]+/,
                            message: "密钥未填写或不规范！",
                            required: true
                        }]}>
                            <Input allowClear/>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    </Modal>;
}