import React from "react";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import {App, Form, Input} from "antd";
import {FileSystemImpl} from "../../../../controller/util/InteractiveSystem.ts";
import {UserWithNoneStatusWork} from "../../../../controller/Hooks/Store/WorkHooks.ts";

interface FindNameForm {
    address: string;
    name: string
}

export default function SearchPage() {
    const {message} = App.useApp();
    const searchServer = UserWithNoneStatusWork.useMethod();
    const [formRef] = Form.useForm<FindNameForm>();
    const onSearch = (data: FindNameForm) => {
        searchServer.findUserNameByAddress(data.address).then(r => {
            if (r.success) message.success("查找成功！").then();
            else message.error("查找失败，原因：" + r.message).then();
            formRef.setFieldValue("name", r.data);
        });
    };
    const onCopy = () => {
        FileSystemImpl.writeTextToClipboard(formRef.getFieldValue("name"));
        message.success("复制成功！").then();
    };
    return <MainContainerProvider>
        <div className={"mt-20 mx-[25%]"}>
            <Form<FindNameForm> onFinish={onSearch} form={formRef}>
                <Form.Item<FindNameForm> name={"address"} label={"用户地址"} labelCol={{span: 6}}>
                    <Input allowClear/>
                </Form.Item>
                <Form.Item className={"flex flex-row justify-center"}>
                    <button className={"button button-raised button-primary"}>查找</button>
                </Form.Item>
                <Form.Item<FindNameForm> name={"name"} label={"查找到的用户昵称"} labelCol={{span: 6}}>
                    <Input readOnly onClick={onCopy}/>
                </Form.Item>
            </Form>
        </div>
    </MainContainerProvider>;
}