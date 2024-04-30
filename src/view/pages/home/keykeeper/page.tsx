import LayOutProvider, {ItemsAndPic} from "../../../components/provider/layOutProvider.tsx";
import {UserGroup} from "../../../../model/entity/user.ts";
import {componentUtils} from "../../../../controller/util/component.tsx";
import {APPLICANT_THIS_PATH, KEYKEEPER_THIS_PATH, KeyKeeperRoutes} from "../../../routes/home.tsx";

const ThisUserGroup: UserGroup = {
    userIdentity: "KeyKeeper",
    userHeader: componentUtils.getIcon("icon-key", {fontSize: 18})
};

const headBarItems: ItemsAndPic[] = [
    {
        logo: componentUtils.getIcon("icon-money-finance-buyer", {fontSize: 18}),
        routerPath: KEYKEEPER_THIS_PATH + "/notice",
        text: "上传请求"
    },
    {
        logo: componentUtils.getIcon("icon-visitor-authorization", {fontSize: 18}),
        routerPath: KEYKEEPER_THIS_PATH + "/get",
        text: "获取份额"
    },
    {
        logo: componentUtils.getIcon("icon-iconrequirement", {fontSize: 18}),
        routerPath: KEYKEEPER_THIS_PATH + "/audit",
        text: "审核简历"
    }, {
        logo: componentUtils.getIcon('icon-transfer1',{fontSize: 18}),
        routerPath: KEYKEEPER_THIS_PATH + '/search',
        text: "用户追溯"
    }, {
        logo: componentUtils.getIcon('icon-suyuan', {fontSize: 18}),
        routerPath: KEYKEEPER_THIS_PATH + '/readwater',
        text: "水印溯源"
    }
];
export default function KeyKeeperPage() {

    return <LayOutProvider items={headBarItems} group={ThisUserGroup}>
        <div className={"window-color-back"}>
            <KeyKeeperRoutes/>
        </div>
    </LayOutProvider>;
}