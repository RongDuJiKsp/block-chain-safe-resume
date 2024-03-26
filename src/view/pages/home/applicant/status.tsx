import {Statistic, Table} from "antd";
import {ApplicantResumeRequestStatusTuple} from "../../../../model/entity/user.ts";
import {ColumnsType} from "antd/es/table";
import {componentUtils} from "../../../../controller/util/component.tsx";
import CountUp from "react-countup";

const numberCountUpFormatter = (value: string | number) => <CountUp end={Number(value)} separator=","/>;

const tableColumn: ColumnsType<ApplicantResumeRequestStatusTuple> = [{}];
export default function ApplicantStatus() {
    return <div className={"flex flex-col justify-center h-full-screen px-24 gap-12"}>
        <div className={"flex justify-around bg-white py-8"}>
            <Statistic title={"简历下载次数"} prefix={componentUtils.getIcon("icon-visitor-authorization")}
                       value={113} suffix={"次"} formatter={numberCountUpFormatter}/>
            <Statistic title={"简历更新时间"} prefix={componentUtils.getIcon("icon-iconrequirement")}
                       value={"2024-3-4 17:56"}/>
            <Statistic title={"待处理请求"} prefix={componentUtils.getIcon("icon-money-finance-buyer")}
                       value={0} suffix={"条"}/>
        </div>
        <div className={"bg-white border-[0.1px] border-gray-300 px-6 py-4"}>
            <div className={"font-sans font-bold border-b-2 mb-2"}>访问请求</div>
            <Table columns={tableColumn}/>
        </div>
    </div>;
}