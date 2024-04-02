import {App, Form, Input, Modal, Table} from "antd";
import {RecAuthorizeReq} from "../../../../model/http-bodys/user/recruiter/req.ts";
import {useBoolean} from "ahooks";
import {SearchOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {useState} from "react";
import {ColumnsType} from "antd/es/table";
import {RecruiterWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";

export default function RecruiterRequire() {

    return <div className={"flex flex-col gap-14 justify-center basic-window h-full-screen"}>
        <div className={"basis-3/5  mx-44 px-24 py-16  work-window-color"}>
            <SendRequire/>
        </div>
    </div>;
}

function SendRequire() {
    const reService = RecruiterWorkHooks.useMethod();
    const {message} = App.useApp();
    const onSubmit = (val: RecAuthorizeReq) => {
        reService.requestResumeLicensingAsync(val.ApUserName, val.ApAddress).then(r => {
            console.log(r);
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
    return <div className={"px-36"}>
        <FindLikeInfo/>
        <Form<RecAuthorizeReq> onFinish={onSubmit}>
            <Form.Item<RecAuthorizeReq> label={"请求用户的名称"} name={"ApUserName"}
                                        rules={[{min: 4, max: 12, message: "名称不合法"},
                                            {required: true, message: "请填写昵称"}]}>
                <Input/>
            </Form.Item>
            <Form.Item<RecAuthorizeReq> label={"请求用户的地址"} name={"ApAddress"}
                                        rules={[{required: true, message: "请填写地址"}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <div className={"flex justify-center"}>
                    <button className={"button-3d button button-pill button-primary "}>发送请求</button>
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

type AAAAa = {
    address: string;
    name: string;
}
const tableColumn: ColumnsType<AAAAa> = [
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
];

function FindLikeInfoModel({vis, close}: { vis: boolean, close: CallBackWithSideEffect }) {
    const {message} = App.useApp();
    const [tableVal, setTableVal] = useState<AAAAa[]>([]);
    const onSearch = (val: string) => {
        if (val === "") {
            message.error("搜索内容不能为空").then();
            return;
        }
        console.log(val);
        message.success("搜索成功！共找到0个结果").then();
    };
    return <Modal open={vis} footer={null} onCancel={close}>
        <div className={"my-8"}>
            <Search onSearch={onSearch}/>
            <Table columns={tableColumn} dataSource={tableVal}/>
        </div>
    </Modal>;
}