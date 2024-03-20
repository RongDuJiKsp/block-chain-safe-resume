import "./provider.css";
import logo from "../../../assets/logo-p.png";
import {PropsWithChildren, ReactNode} from "react";
import {Dropdown} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {IdcardOutlined} from "@ant-design/icons";
import {componentUtils} from "../../../controller/util/component.tsx";

export interface ItemsAndPic {
    logo: ReactNode;
    routerPath: string;
    text: string
}

export interface UserOperatorHook {
    onLogout(): void;

    onChangeNickName(): void;
}

export interface UserShownInfo {
    userHeader: ReactNode;
    userName: string;
    userToken: number;
    userIdentity:string;
}

export interface HeaderBarProps {
    items: ItemsAndPic[];
    operator: UserOperatorHook;
    info: UserShownInfo;
}


export default function HeaderBarProvider({children, items, operator, info}: PropsWithChildren<HeaderBarProps>) {
    const dropDownItems: ItemType[] = [
        {
            key: "nick",
            label:componentUtils.getIconVal("icon-nick",info.userName)
        },
        {
            key: "identity",
            label:componentUtils.getIconVal("icon-identity",info.userIdentity)
        },
        {
            key: "token",
            label:componentUtils.getIconVal("icon-token",info.userToken),
        },
        {
            key: "nick-cng",
            label:componentUtils.getIconLabel("更改昵称","icon-setting"),
            onClick:operator.onChangeNickName,
        },
        {
            key: "logout",
            label:componentUtils.getIconLabel("退出登录","icon-out"),
            onClick:operator.onLogout,
        }
    ];
    return <div>
        <div className={"h-16 header-bar-bg-color header-bar-shadow flex justify-between"}>
            <div className={"item-container ml-10 flex px-3 basis-[12.5%] justify-around"}>
                <img draggable={false} src={logo} alt={"LOGO"} className={"h-full"}/>
                <div className={"my-auto logo-text"}>
                    <span className={"font-bold font-sans"}>SAFE </span>
                    <span className={"font-bold font-mono text-2xl"}>CCV</span>
                </div>
            </div>
            <div className={"flex justify-around basis-1/2"}>
                {items.map((value, index) => {
                    return <div className={"item-container item-shadow basis-1/6 flex justify-around"}
                                key={"item-map" + index}>
                        {value.logo}
                        <div className={"text-center my-auto text-lg"}>{value.text}</div>
                    </div>;
                })}
            </div>
            <div className={"basis-[10.5%] item-container mr-11 items-col-center-flex"}>
                <Dropdown menu={{items: dropDownItems}}>
                    <span>{info.userHeader}&emsp;About Me</span>
                </Dropdown>
            </div>
        </div>
        {children}
    </div>;
}