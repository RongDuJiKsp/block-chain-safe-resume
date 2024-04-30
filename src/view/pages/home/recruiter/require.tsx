import {App, Button, Form, Input, Modal, Table} from "antd";
import {RecAuthorizeReq} from "../../../../model/http-bodys/user/recruiter/req.ts";
import {useBoolean} from "ahooks";
import {LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {ReactNode, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {RecruiterWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {ApSearchInfo} from "../../../../model/entity/recruiter.ts";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import {FileTempleHandleImpl} from "../../../../controller/util/output.ts";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";

export default function RecruiterRequire() {

    return <MainContainerProvider>
        <SendRequire/>
    </MainContainerProvider>;
}

function SendRequire() {
    const reService = RecruiterWorkHooks.useMethod();
    const {message} = App.useApp();
    const [isLoading, loadingAction] = useBoolean();
    const onSubmit = (val: RecAuthorizeReq) => {
        loadingAction.setTrue();
        reService.requestResumeLicensingAsync(val.ApUserName, val.ApAddress).then(r => {
            loadingAction.setFalse();
            if (r.status) {
                message.success("操作成功！").then();
            } else {
                message.error("发生错误，错误为" + r.message).then();
            }
        }).catch(e => {
            console.error(e);
            message.error("发生错误，错误为" + e).then();
        });
    };
    return <div className={"px-64 py-16"}>
        <FindLikeInfo/>
        <Form<RecAuthorizeReq> onFinish={onSubmit}>
            <Form.Item<RecAuthorizeReq> label={"请求用户的名称"} name={"ApUserName"}
                                        rules={[{min: 3, max: 12, message: "名称不合法"},
                                            {required: true, message: "请填写昵称"}]}>
                <Input/>
            </Form.Item>
            <Form.Item<RecAuthorizeReq> label={"请求用户的地址"} name={"ApAddress"}
                                        rules={[{required: true, message: "请填写地址"}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <div className={"flex justify-center mt-5"}>
                    <button className={"button-3d button button-pill button-primary "}>
                        {isLoading ?
                            <span><LoadingOutlined/>&emsp;正在发送</span> :
                            <span>点击发送请求</span>
                        }
                    </button>
                </div>
            </Form.Item>
        </Form>
    </div>;
}

function FindLikeInfo() {
    const [isModelVis, setModelAction] = useBoolean();
    return <div className={"mb-8 mx-12"}>
        <div className={"bg-gray-200 py-6 text-center border-dotted border-gray-300 border-[3px]"}
             onClick={setModelAction.setTrue}>
            <SearchOutlined/> 点击模糊查找用户
        </div>
        <FindLikeInfoModel vis={isModelVis} close={setModelAction.setFalse}/>
    </div>;
}


function FindLikeInfoModel({vis, close}: { vis: boolean, close: CallBackWithSideEffect }) {
    const reService = RecruiterWorkHooks.useMethod();
    const {message} = App.useApp();
    const [tableVal, setTableVal] = useState<ApSearchInfo[]>([]);
    const onSearch = (val: string) => {
        if (val === "") {
            message.error("搜索内容不能为空").then();
            return;
        }
        reService.getFuzzyLookupListAsync(val).then(r => {
            if (r.status) {
                message.success(`搜索成功，共搜索到${r.list.length}个结果`).then();
                setTableVal(r.list);
            }
        });

    };
    const onDownload = (info: ApSearchInfo) => {
        FileSystemImpl.downloadToFileAsNameAsync(new Blob([FileTempleHandleImpl.getApInfo(info.ApUserName, info.ApAddress)]), info.ApUserName + " 's info.key")
            .then(() => message.success("保存成功！"))
            .then();
    };
    const tableColumn: ColumnsType<ApSearchInfo> = [
        {
            title: "用户名",
            dataIndex: "ApUserName",
            width: "28%",
            align: "center",
            ellipsis: true
        },
        {
            title: "地址",
            dataIndex: "ApAddress",
            align: "center",
            ellipsis: true
        },
        {
            title: "操作",
            width: "16%",
            render(_, item): ReactNode {
                return <div className={"flex justify-center"}>
                    <Button type={"primary"} onClick={() => onDownload(item)}>保存</Button>
                </div>;
            }
        }
    ];
    return <Modal open={vis} footer={null} onCancel={close}>
        <div className={"my-8"}>
            <Search onSearch={onSearch}/>
            <Table columns={tableColumn} dataSource={tableVal}/>
        </div>
    </Modal>;
}