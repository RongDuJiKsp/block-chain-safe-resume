import "./login.css";
import {App, Form, Input, Select} from "antd";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {DefaultOptionType} from "rc-select/lib/Select";
import {componentUtils} from "../../../controller/util/component.tsx";
import {Link, NavLink, Route, Routes, useNavigate} from "react-router-dom";
import {UserWorkHooks} from "../../../controller/Hooks/Store/WorkHooks.ts";
import {useBoolean} from "ahooks";
import {IdcardOutlined, KeyOutlined, LoadingOutlined, SendOutlined, UserOutlined} from "@ant-design/icons";
import {useEffect} from "react";
import {ArrayPointerInButton} from "../../components/comp/element-uis.tsx";


type LoginFormType = {
    username: string;
    pwd: string,
    identity: UserIdentityEnum,
    remember: boolean,
}

const identityOption: DefaultOptionType[] = [
    {value: "Applicant", label: componentUtils.getIconLabel("Applicant", "icon-Owner-1")},
    {value: "Recruiter", label: componentUtils.getIconLabel("Recruiter", "icon-search")},
    {value: "KeyKeeper", label: componentUtils.getIconLabel("KeyKeeper", "icon-key")}
];


function LoginPage() {
    return <div>
        <div
            className={"login-container-anima login-locations hover:flex-shadow flex flex-col justify-around  basic-shadow-box"}>
            <div className={"text-right pr-5 basis-1/6 pt-2 dark-mode-text"}>
                切换
                {[["管理端", "./admin"], ["用户端", "./user"]].map(r =>
                    <NavLink key={r[0]} to={r[1]}
                             className={({isActive}) => isActive ? "hidden" : ""}>{r[0]}</NavLink>)}
            </div>
            <div className={"mx-7 basis-4/5"}>
                <Routes>
                    <Route path={"/user"} element={<LoginComponent/>}/>
                    <Route path={"/admin"} element={<AdminLoginComponent/>}/>
                </Routes>
            </div>
        </div>
    </div>;
}

export default LoginPage;

function LoginComponent() {
    const navigate = useNavigate();
    const workMethod = UserWorkHooks.useMethod();
    const [isLoading, loadingAction] = useBoolean();
    const {message} = App.useApp();

    const onLogin = (val: LoginFormType) => {
        if (isLoading) return;
        if (val.identity === UserIdentityEnum.None) {
            message.error("身份不能为None！").then();
            return;
        }
        if (!val.pwd || !val.identity || !val.username) {
            message.error("请填写完整！！").then();
            return;
        }
        loadingAction.setTrue();
        workMethod.loginAsync(val.username, val.pwd, val.identity).then(r => {
            if (r.status) {
                message.success("登录成功,正在跳转！").then();
                navigate("/home/login");
            } else message.error("登录失败").then();
            loadingAction.setFalse();
        }).catch(e => {
            message.error("登录失败，原因：" + e.toString()).then();
            loadingAction.setFalse();
        });
    };
    const cleanData = () => {
        workMethod.logout();
    };
    useEffect(() => {
        cleanData();
    }, []);
    return <div className={"flex flex-col justify-around h-full dark-mode-text"}>
        <div className={"text-center text-2xl font-bold"}>欢迎来到SafeCV Zone平台</div>
        <Form<LoginFormType> onFinish={onLogin} className={"px-8"}>
            <Form.Item<LoginFormType> name={"username"} colon={false}
                                      rules={[{min: 4, max: 12},]}
                                      label={<UserOutlined className={"text-white"} style={{fontSize: 26}}/>}>
                <Input allowClear size={"middle"} style={{borderRadius: 30}}/>
            </Form.Item>
            <Form.Item<LoginFormType> name={"pwd"} colon={false}
                                      rules={[{min: 4, max: 12}, {pattern: /[0-9a-zA-Z]+/}]}
                                      label={<KeyOutlined className={"text-white"} style={{fontSize: 26}}/>}>
                <Input allowClear size={"middle"} style={{borderRadius: 30}}/>
            </Form.Item>
            <Form.Item<LoginFormType> name={"identity"} colon={false}
                                      label={<IdcardOutlined className={"text-white"} style={{fontSize: 26}}/>}>
                <Select placeholder={"请选择你的身份"} options={identityOption} size={"middle"}/>
            </Form.Item>
            <div className={"flex justify-center"}>
                <ArrayPointerInButton title={
                    isLoading ?
                        <span><LoadingOutlined/> 正在登录</span> :
                        <span><SendOutlined/> 点击登录</span>
                }/>
            </div>
        </Form>
        <div className={"text-center text-sm"}>
            <div>
                没有账号？<Link to={"/register"}>点我注册</Link>
            </div>
        </div>
    </div>;
}

function AdminLoginComponent() {
    return <div className={"flex flex-col justify-around h-full"}>
        <div className={"text-center text-2xl  font-bold "}>欢迎来到安全简历部署管理系统</div>
        <Form>
            <Form.Item<LoginFormType> name={"pwd"} label={"钥匙"}>
                <Input/>
            </Form.Item>
        </Form>
        <div className={"flex justify-center"}>
            <button className={"button button-raised button-pill button-action button-3d"}>进入管理系统</button>
        </div>
    </div>;
}
