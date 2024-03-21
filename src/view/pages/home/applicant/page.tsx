import HeaderBarProvider, {
    ItemsAndPic,
    UserOperatorHook,
    UserShownInfo
} from "../../../components/provider/headerBarProvider.tsx";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, ApplicantRoutes} from "../../../routes/home.tsx";


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
    },
    {
        logo: componentUtils.getIcon("icon-key1", {fontSize: 32}),
        routerPath: APPLICANT_THIS_PATH + "/author",
        text: "简历授权"
    },
];


export default function ApplicantPage() {
    const userOpHook: UserOperatorHook = {
        onChangeNickName(): void {
        }, onLogout(): void {

        }
    };
    const info: UserShownInfo = {
        userHeader: componentUtils.getIcon("icon-Owner-1", {fontSize: 28}),
        userName: "AUSERKING",
        userToken: 110,
        userIdentity: "Applicant"
    };
    return <HeaderBarProvider items={headBarItems} operator={userOpHook} info={info}>
        <ApplicantRoutes/>
    </HeaderBarProvider>;
}