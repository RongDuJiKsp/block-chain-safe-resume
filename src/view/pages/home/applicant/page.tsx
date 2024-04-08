import HeaderBarProvider, {ItemsAndPic} from "../../../components/provider/headerBarProvider.tsx";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, ApplicantRoutes} from "../../../routes/home.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";


const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-status", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/status",
        text: "授权请求"
    },
    {
        logo: componentUtils.getIcon("icon-cloudupload-fill", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/upload",
        text: "简历上传"
    },
    {
        logo: componentUtils.getIcon("icon-key1", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/record",
        text: "简历记录"
    }
];
const ThisUserGroup: UserGroup = {
    userIdentity: "Applicant",
    userHeader: componentUtils.getIcon("icon-Owner-1", {fontSize: 28})
};

export default function ApplicantPage() {
    return <HeaderBarProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <ApplicantRoutes/>
        </div>
    </HeaderBarProvider>;
}