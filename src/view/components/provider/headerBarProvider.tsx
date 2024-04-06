import "./provider.css";
import logo from "../../../assets/logo-p.png";
import title from "../../../assets/title.png";
import {PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {App, Dropdown, Form, Input, Modal} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {componentUtils} from "../../../controller/util/component.tsx";
import {NavLink} from "react-router-dom";
import {UserWorkHooks} from "../../../controller/Hooks/Atom/WorkHooks.ts";
import {useBoolean} from "ahooks";
import {CancelableOperateHooks} from "../../../model/interface/hooks.ts";
import {useForm} from "antd/es/form/Form";
import {UserGroup} from "../../../model/entity/user.ts";
import {useSwapBoolean} from "../../../controller/Hooks/state/changeRender.ts";

export interface ItemsAndPic {
    logo: ReactNode;
    routerPath: string;
    text: string
}


interface HeaderBarProps {
    items: ItemsAndPic[];
    group: UserGroup
}

interface ChangeNickFormProps {
    nick: string;
    privateKey: string;
}

export default function HeaderBarProvider({children, items, group}: PropsWithChildren<HeaderBarProps>) {

    return <div>
        <div className={"header-bar-height bg-gray-50 flex justify-between py-2"}>
            <div className={"item-container ml-10 flex px-3 basis-[12.5%] justify-around"}>
                <img draggable={false} src={logo} alt={"LOGO"} className={"h-full"}/>
                <img draggable={false} src={title} alt={"LOGO"} className={"h-2/3 my-auto"}/>
            </div>
            <div className={"basis-2/3"}>
                <FunctionItems items={items}/>
            </div>
            <div className={"basis-[10.5%] item-container mr-11 items-col-center-flex"}>
                <DropDownOperations group={group}/>
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

function DropDownOperations({group}: { group: UserGroup }) {
    const {message} = App.useApp();
    const loginServer = UserWorkHooks.useMethod();
    const {userInfo} = UserWorkHooks.useValue();
    const [tokenVal, setTokenVal] = useState(0);
    const [freshToken, freshAction] = useSwapBoolean();
    const [isChangeNickOpen, changeNickOpenAction] = useBoolean();
    const [isLogoutOpen, logoutOpenAction] = useBoolean();
    const [form] = useForm<ChangeNickFormProps>();
    if (userInfo === null) throw "在用户未登录时展示用户信息";

    const onSubmit = (val: ChangeNickFormProps) => {
        loginServer.changeUserNameAsync(val.nick, val.privateKey).then(r => {
            if (r.status) {
                message.success("修改昵称成功").then();
                changeNickOpenAction.setFalse();
            } else message.error(r.message).then();
        }).catch(e => {
            message.error(e.message).then();

        });
    };
    const onChangeNick: CancelableOperateHooks = {
        onCancel: changeNickOpenAction.setFalse,
        onConform: () => form.submit()
    };
    const onLogout: CancelableOperateHooks = {
        onCancel: logoutOpenAction.setFalse,
        onConform(): void {
            logoutOpenAction.setFalse();
            loginServer.logout();
        }
    };
    useEffect(() => {
        loginServer.getTokenNumberAsync().then(r => {
            if (r.status) {
                message.success("刷新成功！").then();
                setTokenVal(r.token);
            } else message.error("刷新失败！原因：" + r.message).then();
        }).catch(e => {
            message.error("刷新失败！原因：" + e).then();
        });
    }, [freshToken]);
    const dropDownItems: ItemType[] = [
        {
            key: "nick",
            label: componentUtils.getIconVal("icon-nick", userInfo.nick)
        },
        {
            key: "identity",
            label: componentUtils.getIconVal("icon-identity", userInfo.identity)
        },
        {
            key: "token",
            label: componentUtils.getIconVal("icon-token", tokenVal),
            onClick: freshAction
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
                <Form<ChangeNickFormProps> form={form} onFinish={onSubmit}>
                    <Form.Item<ChangeNickFormProps> name={"privateKey"} label={"私钥"} rules={[{required: true}]}>
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item<ChangeNickFormProps> name={"nick"} label={"目标昵称"}
                                                    rules={[{min: 4, max: 12}, {required: true}]}>
                        <Input allowClear/>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
        <Modal open={isLogoutOpen} onCancel={onLogout.onCancel} onOk={onLogout.onConform} title={"确认退出登录"}>
            <p className={"py-3"}>请确认你要退出登录？</p>
        </Modal>
        <Dropdown menu={{items: dropDownItems}}>
            <div className={"flex"}>
                <span>{group.userHeader}</span>
                <span className={"text-lg align-middle"}>&ensp;About Me</span>
            </div>
        </Dropdown>
    </>;
}