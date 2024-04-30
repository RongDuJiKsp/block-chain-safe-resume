import React from "react";
import {FileAddOutlined} from "@ant-design/icons";

interface FileUploaderComponentProps {
    onSelect(files: File[]): void;
}

export default function FileUploaderComponent({onSelect}: FileUploaderComponentProps) {
    const onDropFile = (event: React.DragEvent<HTMLInputElement>): void => {
        event.preventDefault();
        onSelect(Array.from(event.dataTransfer.files));
    };
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files === null) return;
        onSelect(Array.from(event.target.files));
        event.target.value = "";
    };
    return <div className={"h-full flex flex-col gap-12 justify-center relative"}>
        <div className={"mx-auto"}><FileAddOutlined style={{fontSize: 77}}/></div>
        <div className={"text-center"}>点击或将文件拖动到此处上传文件</div>
        <input type={"file"} className={"absolute h-full w-full opacity-0"} onDrop={onDropFile} title={""}
               onChange={onSelectFile}/>
    </div>;
}