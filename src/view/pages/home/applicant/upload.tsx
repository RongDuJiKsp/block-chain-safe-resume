import {FileAddOutlined} from "@ant-design/icons";
import React, {useRef, useState} from "react";
import {App as APP, Form, Input, InputRef, Popconfirm} from "antd";
import {ApplicantWorkHooks, UserWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";

export default function ApplicantUpload() {
    return <div className={"h-full-screen flex flex-col justify-center basic-window"}>
        <div className={"basis-3/5"}><FileUploader/></div>
    </div>;
}


function FileUploader() {
    const userServerMethod = ApplicantWorkHooks.useMethod();
    const App = APP.useApp();
    const [selectedFiles, setSelectFiles] = useState<File[]>([]);
    const SKeyInputRef = useRef<InputRef>(null);
    const onDropFile = (event: React.DragEvent<HTMLInputElement>): void => {
        event.preventDefault();
        setSelectFiles(Array.from(event.dataTransfer.files));
        console.log(Array.from(event.dataTransfer.files));
    };
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files === null) return;
        setSelectFiles(Array.from(event.target.files));
        event.target.value = "";
    };
    const onUploadFile = (): void => {
        if (!SKeyInputRef.current?.input?.value) {
            App.message.error("S Key 不能为空！").then();
            return;
        }
        const inputSKey = SKeyInputRef.current?.input?.value;
        if (!selectedFiles.length) {
            App.message.error("请选择需要上传的文件！").then();
            return;
        }
        const file = selectedFiles[0];
        userServerMethod.updateResumeAsync(file, inputSKey).then(r => console.log(r), e => console.log(e));

    };
    return <div className={"bg-white border-[0.2px] border-gray-300 p-7 flex justify-around h-full"}>
        <div className={"basis-1/3 h-5/6 my-auto border-[3px] border-dotted bg-gray-50"}>
            <div className={"h-full flex flex-col gap-12 justify-center relative"}>
                <div className={"mx-auto"}><FileAddOutlined style={{fontSize: 77}}/></div>
                <div className={"text-center"}>点击或将文件拖动到此处上传文件</div>
                <input type={"file"} className={"absolute h-full w-full opacity-0"} onDrop={onDropFile} title={""}
                       onChange={onSelectFile}/>
            </div>
        </div>
        <div className={"h-5/6 basis-3/5 my-auto flex-col gap-12 flex justify-center px-[15%]"}>
            <Form.Item label={"S Key"}>
                <Input ref={SKeyInputRef} placeholder={"The Val of S"}/>
            </Form.Item>
            <Form.Item label={"Selected File Name"}>
                <Input readOnly={true} onFocus={e => e.target.blur()}
                       value={(selectedFiles.length && selectedFiles[0].type !== "") ? selectedFiles[0].name : "未选择文件"}/>
            </Form.Item>
            <div>
                <Popconfirm title={"请检查上传的文件是否选择正确！以避免额外的token消耗"} onConfirm={onUploadFile}>
                    <button className={"button button-primary"}>Upload</button>
                </Popconfirm>
            </div>
        </div>
    </div>;
}