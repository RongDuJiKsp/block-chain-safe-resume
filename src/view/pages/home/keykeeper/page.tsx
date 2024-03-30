import HeaderBarProvider, {ItemsAndPic} from "../../../components/provider/headerBarProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {KeyKeeperRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "KeyKeeper",
    userHeader: componentUtils.getIcon("icon-key", {fontSize: 28})
};

const headBarItems: ItemsAndPic[] = [];
export default function KeyKeeperPage() {
    return <HeaderBarProvider items={headBarItems} group={ThisUserGroup}>
        <KeyKeeperRoutes/>
    </HeaderBarProvider>;
}