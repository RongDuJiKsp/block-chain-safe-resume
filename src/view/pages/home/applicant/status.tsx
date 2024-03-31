import {Button, Popconfirm, Statistic, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {componentUtils} from "../../../../controller/util/component.tsx";
import CountUp from "react-countup";
import {ReactNode, useEffect, useState} from "react";
import {ResumeInfoRes} from "../../../../model/http-bodys/ress.ts";
import {useSwapBoolean} from "../../../../controller/Hooks/state/changeRender.ts";
import TableHeader from "../../../components/comp/tableHeader.tsx";
import {ApplicantWorkHooks} from "../../../../controller/Hooks/Atom/WorkHooks.ts";


export default function ApplicantStatus() {
    const userService = ApplicantWorkHooks.useMethod();
    const [flashFlag, changeAction] = useSwapBoolean();
    const [resumeInfo, setResumeInfo] = useState<ResumeInfoRes | null>(null);
    useEffect(() => {
        userService.getResumeInfoAsync().then(r => setResumeInfo(r));
        //TODO: flash render
    }, [flashFlag]);
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-12"}>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <TableHeader title={"访问请求"} onFresh={changeAction}/>
            <ResumeRequestComponent/>
        </div>
        <div className={" bg-white py-8"}>
            <ResumeInfoComponent info={resumeInfo}/>
        </div>

    </div>;
}
const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

function ResumeInfoComponent({info}: { info: ResumeInfoRes | null }) {

    return <div className={"flex justify-around"}>
        <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                   value={info?.downloadtimes} suffix={"次"} formatter={numberCountUpFormatter}/>
        <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")}
                   value={info?.putTime}/>
        <Statistic title={"待处理请求"} prefix={componentUtils.getIcon("icon-money-finance-buyer")}
                   value={0} suffix={"条"}/>
    </div>;
}


interface ApplicantResumeRequestStatusTableTuple {
    username: string;
    address: string;
}


function ResumeRequestComponent() {
    const onAccept = (data: ApplicantResumeRequestStatusTableTuple) => {
        console.log(data);
    };
    const onDelay = (data: ApplicantResumeRequestStatusTableTuple) => {
        console.log(data);

    };
    const tableColumn: ColumnsType<ApplicantResumeRequestStatusTableTuple> = [
        {
            title: "用户名",
            dataIndex: "username"
        },
        {
            title: "地址",
            dataIndex: "address",
        },
        {
            title: "操作",
            render(_, rec): ReactNode {
                return <div className={"justify-around flex"}>
                    <Popconfirm title={"确认对用户进行授权？"} onConfirm={() => onAccept(rec)}>
                        <Button type={"primary"}>授权</Button>
                    </Popconfirm>
                    <Popconfirm title={"确认拒绝用户授权？"} onConfirm={() => onDelay(rec)}>
                        <Button type={"primary"} danger={true}>拒绝</Button>
                    </Popconfirm>
                </div>;
            }
        },


    ];
    const tableVal: ApplicantResumeRequestStatusTableTuple[] = [
        {address: "0x9bf591a009ecd917e234f94e22e671042cb58e55", username: "ssss"}
    ];
    return <div>
        <div className={"mx-28 my-3"}>
            <Table columns={tableColumn} dataSource={tableVal} bordered={true}/>
        </div>
    </div>;
}

