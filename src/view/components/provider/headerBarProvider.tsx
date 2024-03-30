import "./provider.css";
import logo from "../../../assets/logo-p.png";
import title from "../../../assets/title.png";
import {PropsWithChildren, ReactNode, useRef} from "react";
import {Dropdown, Form, Input, InputRef, Modal} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {componentUtils} from "../../../controller/util/component.tsx";
import {NavLink} from "react-router-dom";
import {UserGroup} from "../../../model/entity/user.ts";
import {UserWorkHooks} from "../../../controller/Hooks/Atom/WorkHooks.ts";
import {useBoolean} from "ahooks";
import {CancelableOperateHooks} from "../../../model/interface/hooks.ts";

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

    return <div>
        <div className={"header-bar-height bg-gray-50 header-bar-shadow flex justify-between py-2"}>
            <div className={"item-container ml-10 flex px-3 basis-[12.5%] justify-around"}>
                <img draggable={false} src={logo} alt={"LOGO"} className={"h-full"}/>
                <img draggable={false} src={title} alt={"LOGO"} className={"h-2/3 my-auto"}/>
            </div>
            <div className={"basis-2/3"}>
                <FunctionItems items={items}/>
            </div>
            <div className={"basis-[10.5%] item-container mr-11 items-col-center-flex"}>
                <DropDownOperations info={info}/>
            </div>
        </div>
        {children}
    </div>;
}

function FunctionItems({items}: { items: ItemsAndPic[] }) {
    return <div className={"flex justify-end h-full gap-8"}>
        {items.map((value, index) => {
            return <NavLink to={value.routerPath} draggable={false}
                            className={({isActive}) => isActive ? "active-nav" : "basis-nav"}
                            key={"item-map" + index}>
                {value.logo}
                <div className={"text-center my-auto font-mono font-bold text-lg"}>{value.text}</div>
            </NavLink>;
        })}
    </div>;
}

function DropDownOperations({info}: { info: UserShownInfo }) {
    const loginServer = UserWorkHooks.useMethod();
    const [isChangeNickOpen, changeNickOpenAction] = useBoolean();
    const [isLogoutOpen, logoutOpenAction] = useBoolean();
    const nickNameInputRef = useRef<InputRef>(null);
    const onChangeName = async (): Promise<void> => {
        if (!nickNameInputRef.current?.input?.value) return;
        const toChangeNick = nickNameInputRef.current.input.value;
        nickNameInputRef.current.input.value="";
        
        changeNickOpenAction.setFalse();
    };
    const onChangeNick: CancelableOperateHooks = {
        onCancel: changeNickOpenAction.setFalse,
        onConform: onChangeName
    };
    const onLogout: CancelableOperateHooks = {
        onCancel: logoutOpenAction.setFalse,
        onConform(): void {
            logoutOpenAction.setFalse();
            loginServer.logout();
        }
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
    return <>
        <Modal open={isChangeNickOpen} onCancel={onChangeNick.onCancel} onOk={onChangeNick.onConform}
               title={"更改用户昵称"}>
            <div className={"m-8"}>
                <Form.Item label={"目标昵称"}>
                    <Input ref={nickNameInputRef} allowClear/>
                </Form.Item>
            </div>
        </Modal>
        <Modal open={isLogoutOpen} onCancel={onLogout.onCancel} onOk={onLogout.onConform} title={"确认退出登录"}>
            <p className={"py-3"}>请确认你要退出登录？</p>
        </Modal>
        <Dropdown menu={{items: dropDownItems}}>
            <div className={"flex"}>
                <span>{info.userGroup.userHeader}</span>
                <span className={"text-lg align-middle"}>&ensp;About Me</span>
            </div>
        </Dropdown>
    </>;
}