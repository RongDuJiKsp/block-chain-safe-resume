import HeaderBarProvider, {ItemsAndPic, UserShownInfo} from "../../../components/provider/headerBarProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {RECRUITER_THIS_PATH, RecruiterRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "Recruiter",
    userHeader: componentUtils.getIcon("icon-search", {fontSize: 28})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-keyhole", {fontSize: 32}),
        routerPath: RECRUITER_THIS_PATH + "/notice",
        text: "授权状态"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 32}),
        routerPath: RECRUITER_THIS_PATH + "/require",
        text: "请求授权"
    }
];
export default function RecruiterPage() {

    const info: UserShownInfo = {
        userName: "AUSERKING",
        userToken: 110,
        userGroup: ThisUserGroup
    };
    return <HeaderBarProvider items={headBarItems} info={info}>
        <RecruiterRoutes/>
    </HeaderBarProvider>;
}