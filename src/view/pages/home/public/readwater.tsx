import MainContainerProvider from "../../../components/provider/mainContainerProvider.tsx";
import FileUploaderComponent from "../../../components/comp/fileUploader.tsx";
import {ReactNode, useState} from "react";
import {useBoolean} from "ahooks";
import {LoadingOutlined} from "@ant-design/icons";
import {App, Input, Modal} from "antd";
import {UserWithNoneStatusWork} from "../../../../controller/Hooks/Store/WorkHooks.ts";
import {DocumentTraceabilityInformation} from "../../../../model/entity/user.ts";
import {ModelPropsWithInfoAndClear} from "../../../../model/interface/props.ts";


export default function ReadWaterPage() {
    const {message} = App.useApp();
    const noStatusServer = UserWithNoneStatusWork.useMethod();
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, loadingAction] = useBoolean();
    const [showingTraceData, setShowingTraceData] = useState<DocumentTraceabilityInformation | null>(null);
    const onSearch = () => {
        if (isLoading) return;
        if (files.length === 0) {
            message.error("请选择文件！").then();
            return;
        }
        loadingAction.setTrue();
        noStatusServer.trackFileInformation(files[0]).then(r => {
            console.log(r);
            message.success("读取成功！").then();
            setShowingTraceData(r);
        }).catch(e => {
            message.error("发生错误：" + e).then();
        }).finally(loadingAction.setFalse);

    };
    const onClear = () => {
        setShowingTraceData(null);
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
        <TraceDataShowerModel clear={onClear} data={showingTraceData}/>
    </MainContainerProvider>;
}

function TraceDataShowerModel({data, clear}: ModelPropsWithInfoAndClear<DocumentTraceabilityInformation>): ReactNode {
    return <Modal open={data !== null} footer={null} onCancel={clear}>
        <div className={"my-8 font-bold font-sans gap-1 flex-col flex"}>
            <div>上传文件名: {data?.fileName}</div>
            <div>水印内容: {data?.waterMaskContext}</div>
            <div>下载者信息：{data?.fromName}<br/>({data?.fromAddress})</div>
            <div>拥有者信息：{data?.toName}<br/>({data?.toAddress})</div>
            <div>区块链信息：</div>
            <Input.TextArea autoSize={{maxRows: 7}} value={JSON.stringify(data?.blockCharinData)}/>
        </div>
    </Modal>;
}