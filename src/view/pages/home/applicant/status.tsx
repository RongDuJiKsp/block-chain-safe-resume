import {Table} from "antd";
import {ApplicantStatusTuple} from "../../../../model/entity/user.ts";
import {ColumnsType} from "antd/es/table";

const tableColumn: ColumnsType<ApplicantStatusTuple> = [{

}];
export default function ApplicantStatus() {
    return <div className={"flex flex-col justify-center h-full-screen px-24"}>
        <div className={"shadow-lg"}>
            <Table columns={tableColumn}/>
        </div>
    </div>;
}