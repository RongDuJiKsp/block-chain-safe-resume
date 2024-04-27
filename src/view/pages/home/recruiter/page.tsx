import LayOutProvider, {ItemsAndPic} from "../../../components/provider/layOutProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, RECRUITER_THIS_PATH, RecruiterRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "Recruiter",
    userHeader: componentUtils.getIcon("icon-search", {fontSize: 18})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-keyhole", {fontSize: 18}),
        routerPath: RECRUITER_THIS_PATH + "/notice",
        text: "授权状态"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 18}),
        routerPath: RECRUITER_THIS_PATH + "/require",
        text: "请求授权"
    }, {
        logo: componentUtils.getIcon('icon-transfer1',{fontSize: 18}),
        routerPath: RECRUITER_THIS_PATH + '/search',
        text: "用户查找"
    }
];
export default function RecruiterPage() {


    return <LayOutProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <RecruiterRoutes/>
        </div>
    </LayOutProvider>;
}