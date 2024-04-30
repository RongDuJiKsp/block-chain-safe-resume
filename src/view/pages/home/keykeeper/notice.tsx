import {App, Button, Form, Input, InputNumber, Modal, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ReactNode, useEffect, useState} from "react";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {UploadSubKeyRequestInfo} from "../../../../model/entity/keykeeper.ts";
import {KeyKeeperWorkHook} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import dayjs from "dayjs";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";
import {useBoolean} from "ahooks";
import {UploadKeyReq} from "../../../../model/http-bodys/user/keykeeper/req.ts";
import {useForm} from "antd/es/form/Form";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";


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
    return <MainContainerProvider>
        <TableHeader title={"待上传请求"} onFresh={changeAction}/>
        <Spin spinning={isLoading} delay={500}>
            <RequestTableComponent tableVal={tableVal}/>
        </Spin>
    </MainContainerProvider>;
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
    return <div className={"mx-28 my-3"}>
        <UploadSubKeyModel data={selectedResume} clear={onClear}/>
        <Table<UploadSubKeyRequestInfo> columns={tableColumn} dataSource={tableVal} bordered={true} size={"small"}
                                        pagination={{pageSize: 5, showQuickJumper: true, hideOnSinglePage: true}}
        />
    </div>;
}

function UploadSubKeyModel({data, clear}: ModelPropsWithInfoAndClear<UploadSubKeyRequestInfo>) {
    const kkServer = KeyKeeperWorkHook.useMethod();
    const {message} = App.useApp();
    const [conformLoading, conformLoadingAction] = useBoolean();
    const [formRef] = useForm<UploadKeyReq>();
    const onConform = (val: UploadKeyReq): void => {
        if (data === null) return;
        conformLoadingAction.setTrue();
        kkServer.uploadSubKeyAsync(data.ApUserName, val.i, val.x, val.m).then(r => {
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
            <div className={"flex flex-col gap-6 my-3"}>
                <p>请在此为指定用户上传密钥</p>
                <p>请确认当前选择的用户 用户名 : {data?.ApUserName}</p>
                <p>请确认上传的密钥是否正确，上传错误的密钥将会导致积分惩罚！</p>
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