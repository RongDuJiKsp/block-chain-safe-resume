import LayOutProvider, {ItemsAndPic} from "../../../components/provider/layOutProvider.tsx";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, ApplicantRoutes} from "../../../routes/home.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";


const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-status", {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + "/status",
        text: "授权请求"
    },
    {
        logo: componentUtils.getIcon("icon-cloudupload-fill", {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + "/upload",
        text: "简历上传"
    },
    {
        logo: componentUtils.getIcon("icon-key1", {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + "/record",
        text: "简历记录"
    }, {
        logo: componentUtils.getIcon('icon-trust', {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + '/checking',
        text: "审核状态"
    }, {
        logo: componentUtils.getIcon('icon-transfer1', {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + '/search',
        text: "用户查找"
    }, {
        logo: componentUtils.getIcon('icon-suyuan', {fontSize: 18}),
        routerPath: APPLICANT_THIS_PATH + '/readwater',
        text: "水印溯源"
    }
];
const ThisUserGroup: UserGroup = {
    userIdentity: "Applicant",
    userHeader: componentUtils.getIcon("icon-Owner-1", {fontSize: 18})
};

export default function ApplicantPage() {
    return <LayOutProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <ApplicantRoutes/>
        </div>
    </LayOutProvider>;
}