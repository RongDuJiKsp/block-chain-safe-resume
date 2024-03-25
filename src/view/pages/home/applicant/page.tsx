import HeaderBarProvider, {ItemsAndPic, UserShownInfo} from "../../../components/provider/headerBarProvider.tsx";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, ApplicantRoutes} from "../../../routes/home.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";


const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-status", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/status",
        text: "简历状态"
    },
    {
        logo: componentUtils.getIcon("icon-cloudupload-fill", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/upload",
        text: "简历上传"
    }
];
const ThisUserGroup: UserGroup = {
    userIdentity: "Applicant",
    userHeader: componentUtils.getIcon("icon-Owner-1", {fontSize: 28})
};

export default function ApplicantPage() {
    const info: UserShownInfo = {
        userName: "AUSERKING",
        userToken: 110,
        userGroup: ThisUserGroup
    };
    return <HeaderBarProvider items={headBarItems} info={info}>
        <ApplicantRoutes/>
    </HeaderBarProvider>;
}