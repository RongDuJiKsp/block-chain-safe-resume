import {Table} from "antd";
import {ApplicantStatusTuple} from "../../../../model/entity/user.ts";
import {ColumnsType} from "antd/es/table";

const tableColumn: ColumnsType<ApplicantStatusTuple> = [];
export default function ApplicantStatus() {
    return <div>
        <Table columns={tableColumn}/>
    </div>;
}