import HeaderBarProvider, {ItemsAndPic} from "../../../components/provider/headerBarProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {KEYKEEPER_THIS_PATH, KeyKeeperRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "KeyKeeper",
    userHeader: componentUtils.getIcon("icon-key", {fontSize: 28})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-money-finance-buyer", {fontSize: 32}),
        routerPath: KEYKEEPER_THIS_PATH + "/notice",
        text: "上传请求"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 32}),
        routerPath: KEYKEEPER_THIS_PATH + "/get",
        text: "获取秘密份额"
    }
];
export default function KeyKeeperPage() {

    return <HeaderBarProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <KeyKeeperRoutes/>
        </div>
    </HeaderBarProvider>;
}