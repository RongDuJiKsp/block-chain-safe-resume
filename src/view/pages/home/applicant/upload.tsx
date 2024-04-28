import {LoadingOutlined} from "@ant-design/icons";
import React, {useRef, useState} from "react";
import {App as APP, Form, Input, InputRef, Popconfirm} from "antd";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {useBoolean} from "ahooks";
import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import FileUploaderComponent from "../../../components/comp/fileUploader.tsx";

export default function ApplicantUpload() {
    return <MainContainerProvider>
        <FileUploader/>
    </MainContainerProvider>;
}


function FileUploader() {
    const userServerMethod = ApplicantWorkHooks.useMethod();
    const {message} = APP.useApp();
    const [selectedFiles, setSelectFiles] = useState<File[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    const SKeyInputRef = useRef<InputRef>(null);


    const onUploadFile = (): void => {
        if (!SKeyInputRef.current?.input?.value) {
            message.error("Safe Key 不能为空！").then();
            return;
        }
        const inputSKey = SKeyInputRef.current?.input?.value;
        if (!selectedFiles.length) {
            message.error("请选择需要上传的文件！").then();
            return;
        }
        loadingAction.setTrue();
        const file = selectedFiles[0];
        userServerMethod.encryptedAndUpdateResumeAsync(file, inputSKey).then(r => {
            loadingAction.setFalse();
            if (r.status) {
                message.success("文件上传成功！").then();
            } else {
                message.error("文件上传失败！原因：" + r.message).then();
            }
        }, e => {
            message.error(e.toString()).then();
        });

    };
    return <div className={" p-7 flex justify-around h-full"}>
        <div className={"basis-1/3 h-5/6 my-auto border-[3px] border-dotted bg-gray-50"}>
            <FileUploaderComponent onSelect={files => setSelectFiles(files)}/>
        </div>
        <div className={"h-5/6 basis-3/5 my-auto flex-col gap-12 flex justify-center px-[15%]"}>
            <Form.Item label={"安全密钥"}>
                <Input ref={SKeyInputRef} placeholder={"请在此黏贴文件内分发的SafeKey"}/>
            </Form.Item>
            <Form.Item label={"选择文件"}>
                <Input readOnly={true} onFocus={e => e.target.blur()}
                       value={(selectedFiles.length && selectedFiles[0].type !== "") ? selectedFiles[0].name : "未选择文件"}/>
            </Form.Item>
            <div>
                <Popconfirm
                    title={"请检查上传的文件和SafeKey是否选择正确！错误的SafeKey将使得简历无法解密！"}
                    onConfirm={onUploadFile}>
                    <button className={"button-primary button button-raised button-rounded button-glow"}>
                        {isLoading ?
                            <span><LoadingOutlined/>&emsp;上传中&emsp;</span> :
                            <span>&emsp;点击上传&emsp;</span>
                        }
                    </button>
                </Popconfirm>
            </div>
        </div>
    </div>;
}

