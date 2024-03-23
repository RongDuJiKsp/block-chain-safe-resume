import HeaderBarProvider, {
    ItemsAndPic,
    UserOperatorHook,
    UserShownInfo
} from "../../../components/provider/headerBarProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, KEYKEEPER_THIS_PATH} from "../../../routes/home.tsx";

const ThisUserGroup:UserGroup={
    userIdentity: "KeyKeeper",
    userHeader: componentUtils.getIcon("icon-key", {fontSize: 28})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-keyhole", {fontSize: 32}),
        routerPath: KEYKEEPER_THIS_PATH + "/notice",
        text: "上传申请"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 32}),
        routerPath: KEYKEEPER_THIS_PATH + "/upload",
        text: "保管密钥"
    },
];
export default function KeyKeeperPage(){
    const userOpHook: UserOperatorHook = {
        onChangeNickName(): void {

        },
        onLogout(): void {

        }
    };
    const info: UserShownInfo = {
        userName: "AUSERKING",
        userToken: 110,
        userGroup:ThisUserGroup
    };
    return <HeaderBarProvider items={headBarItems} operator={userOpHook} info={info}>
        <div>sss</div>
    </HeaderBarProvider>;
}