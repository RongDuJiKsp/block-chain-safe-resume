import React, {useState} from "react";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import {App, Form, Input, Table, TableProps} from "antd";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import {UserWithNoneStatusWork} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {useBoolean} from "ahooks";

interface FindNameForm {
    address: string;
    name: string
}

export default function SearchPage() {
    const {message} = App.useApp();
    const searchServer = UserWithNoneStatusWork.useMethod();
    const [formRef] = Form.useForm<FindNameForm>();
    const [searchedData, setSearchedData] = useState<FindNameForm[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    const onSearch = (data: FindNameForm) => {
        if (isLoading) return;
        loadingAction.setTrue();
        searchServer.findUserNameByAddress(data.address).then(r => {
            if (r.success) {
                message.success("查找成功！").then();
                setSearchedData(pre => [...pre, {address: data.address, name: r.data}]);
            } else message.error("查找失败，原因：" + r.message).then();
            formRef.setFieldValue("name", r.data);

        }).catch(e => {
            message.error("发送错误：" + e).then();
        }).finally(loadingAction.setFalse);
    };
    const onCopy = () => {
        if (formRef.getFieldValue("name").length <= 0) return;
        FileSystemImpl.writeTextToClipboard(formRef.getFieldValue("name"));
        message.success("复制成功！").then();
    };
    return <MainContainerProvider>
        <div className={"mt-5 mx-[25%]"}>
            <Form<FindNameForm> onFinish={onSearch} form={formRef}>
                <Form.Item<FindNameForm> name={"address"} label={"用户地址"} labelCol={{span: 6}}
                                         rules={[{required: true}]}>
                    <Input allowClear/>
                </Form.Item>
                <Form.Item className={"flex flex-row justify-center"}>
                    <button
                        className={"button-primary button-raised button button-rounded button-pill button-small"}>查找
                    </button>
                </Form.Item>
                <Form.Item<FindNameForm> name={"name"} label={"查找结果"} labelCol={{span: 6}}>
                    <Input readOnly onClick={onCopy}/>
                </Form.Item>
            </Form>
            <div className={"font-sans font-bold my-3"}>查找记录</div>
            <SearchedTable data={searchedData}/>
        </div>

    </MainContainerProvider>;
}
const columns: TableProps<FindNameForm>['columns'] = [
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        width: "60%"
    },
    {
        title: '用户昵称',
        dataIndex: 'name',
        key: 'name',
    }
];

function SearchedTable({data}: { data: FindNameForm[] }) {
    return <Table columns={columns} dataSource={data} bordered={true} size={"small"}
                  pagination={{pageSize: 4, showQuickJumper: true, hideOnSinglePage: true}}/>;
}