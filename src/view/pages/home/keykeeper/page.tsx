import LayOutProvider, {ItemsAndPic} from "../../../components/provider/layOutProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {KEYKEEPER_THIS_PATH, KeyKeeperRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "KeyKeeper",
    userHeader: componentUtils.getIcon("icon-key", {fontSize: 26})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-money-finance-buyer", {fontSize: 26}),
        routerPath: KEYKEEPER_THIS_PATH + "/notice",
        text: "上传请求"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 26}),
        routerPath: KEYKEEPER_THIS_PATH + "/get",
        text: "获取份额"
    },
    {
        logo: componentUtils.getIcon("icon-iconrequirement", {fontSize: 26}),
        routerPath: KEYKEEPER_THIS_PATH + "/audit",
        text: "审核简历"
    }
];
export default function KeyKeeperPage() {

    return <LayOutProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <KeyKeeperRoutes/>
        </div>
    </LayOutProvider>;
}