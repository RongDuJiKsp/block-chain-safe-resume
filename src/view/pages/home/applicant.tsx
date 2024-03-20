import HeaderBarProvider, {
    ItemsAndPic,
    UserOperatorHook,
    UserShownInfo
} from "../../components/provider/headerBarProvider.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import {componentUtils} from "../../../controller/util/component.tsx";

const headBarItems: ItemsAndPic[] = [
    {
        logo: <LoadingOutlined/>,
        routerPath: "",
        text: "Status"
    },
    {
        logo: <LoadingOutlined/>,
        routerPath: "",
        text: "Author"
    },
];
export default function ApplicantPage() {
    const userOpHook: UserOperatorHook = {
        onChangeNickName(): void {
        }, onLogout(): void {

        }
    };
    const info: UserShownInfo = {
        userHeader: componentUtils.getIcon("icon-Owner-1"), userName: "AUSERKING", userToken: 110,userIdentity:"Applicant"
    };
    return <HeaderBarProvider items={headBarItems} operator={userOpHook} info={info}>
        <div>
            Hello applicant
        </div>
    </HeaderBarProvider>;
}