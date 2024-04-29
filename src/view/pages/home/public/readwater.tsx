import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import FileUploaderComponent from "../../../components/comp/fileUploader.tsx";
import {useState} from "react";
import {useBoolean} from "ahooks";
import {LoadingOutlined} from "@ant-design/icons";
import {App} from "antd";

export default function ReadWaterPage() {
    const {message} = App.useApp();
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    const onSearch = () => {
        if (isLoading) return;
        if (files.length === 0) {
            message.error("请选择文件！").then();
        }
        loadingAction.setTrue();

    };
    return <MainContainerProvider>
        <div className={"px-[25%]"}>
            <div className={"my-4 h-[40vh] border-[3px] border-dotted bg-gray-50"}>
                <FileUploaderComponent onSelect={(files) => setFiles(files)}/>
            </div>
            <div className={"text-center my-4 font-sans font-bold"}>
                文件选择状态：{files.length ? files[0].name : "未选择文件！"}
            </div>
            <div className={"flex justify-center"}>
                <button onClick={onSearch} className={"button button-primary button-rounded button-raised"}>
                    {isLoading ? <span>&emsp;&emsp;查询信息中&emsp;<LoadingOutlined/>&emsp;&emsp;</span> :
                        <span>上传简历以查询溯源信息</span>}
                </button>
            </div>
        </div>
    </MainContainerProvider>;
}