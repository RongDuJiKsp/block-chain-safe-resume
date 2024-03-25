import "./provider.css";
import logo from "../../../assets/logo-p.png";
import title from "../../../assets/title.png";
import {PropsWithChildren, ReactNode} from "react";
import {Dropdown, Modal} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {componentUtils} from "../../../controller/util/component.tsx";
import {NavLink} from "react-router-dom";
import {UserGroup} from "../../../model/entity/user.ts";
import {UserWorkHooks} from "../../../controller/Hooks/Atom/WorkHooks.ts";
import {useBoolean} from "ahooks";

export interface ItemsAndPic {
    logo: ReactNode;
    routerPath: string;
    text: string
}


export interface UserShownInfo {
    userGroup: UserGroup;
    userName: string;
    userToken: number;
}

export interface HeaderBarProps {
    items: ItemsAndPic[];
    info: UserShownInfo;
}


export default function HeaderBarProvider({children, items, info}: PropsWithChildren<HeaderBarProps>) {
    const loginServer = UserWorkHooks.useMethod();
    const [isChangeNickOpen, changeNickOpenAction] = useBoolean();
    const [isLogoutOpen, logoutOpenAction] = useBoolean();
    const onChangeNick = (): void => {

    };
    const onLogout = (): void => {

    };
    const dropDownItems: ItemType[] = [
        {
            key: "nick",
            label: componentUtils.getIconVal("icon-nick", info.userName)
        },
        {
            key: "identity",
            label: componentUtils.getIconVal("icon-identity", info.userGroup.userIdentity)
        },
        {
            key: "token",
            label: componentUtils.getIconVal("icon-token", info.userToken),
        },
        {
            key: "nick-cng",
            label: componentUtils.getIconLabel("更改昵称", "icon-setting"),
            onClick: changeNickOpenAction.setTrue,
        },
        {
            key: "logout",
            label: componentUtils.getIconLabel("退出登录", "icon-out"),
            onClick: logoutOpenAction.setTrue,
        }
    ];
    return <div>
        <Modal open={isChangeNickOpen}>
            <p>sss</p>
        </Modal>
        <Modal open={isLogoutOpen}>
            <p>sss</p>
        </Modal>
        <div>
            <div className={"header-bar-height bg-gray-50 header-bar-shadow flex justify-between"}>
                <div className={"item-container ml-10 flex px-3 basis-[12.5%] justify-around"}>
                    <img draggable={false} src={logo} alt={"LOGO"} className={"h-full"}/>
                    <img draggable={false} src={title} alt={"LOGO"} className={"h-2/3 my-auto"}/>
                </div>
                <div className={"flex justify-end  basis-2/3 gap-8"}>
                    {items.map((value, index) => {
                        return <NavLink to={value.routerPath} draggable={false}
                                        className={({isActive}) => isActive ? "active-nav" : "basis-nav"}
                                        key={"item-map" + index}>
                            {value.logo}
                            <div className={"text-center my-auto font-mono font-bold text-lg"}>{value.text}</div>
                        </NavLink>;
                    })}
                </div>
                <div className={"basis-[10.5%] item-container mr-11 items-col-center-flex"}>
                    <Dropdown menu={{items: dropDownItems}}>
                        <div className={"flex"}>
                            <span>{info.userGroup.userHeader}</span>
                            <span className={"text-lg align-middle"}>&ensp;About Me</span>
                        </div>
                    </Dropdown>
                </div>
            </div>
            {children}
        </div>
    </div>;
}