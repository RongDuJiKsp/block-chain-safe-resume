import {Table} from "antd";

export default function RecruiterNotice() {
    return <div className={"flex flex-col justify-center h-full-screen basic-window"}>
        <div className={"basis-2/3 bg-white mx-11 border-[2px]  border-gray-300 pt-6 px-6"}>
            <RecruiterHavingHandlesStatusTableComponent/>
        </div>
    </div>;
}

function RecruiterHavingHandlesStatusTableComponent() {
    return <div>
        <div className={"font-sans font-bold border-b-2 mb-2"}>累计下载记录</div>
        <Table/>
    </div>;
}