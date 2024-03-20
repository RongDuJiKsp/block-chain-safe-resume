import "./login.css"
import {App, Form, Input, Select} from "antd"
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {DefaultOptionType} from "rc-select/lib/Select";
import {componentUtils} from "../../../controller/util/component.tsx";
import {Link, NavLink, Route, Routes, useNavigate} from "react-router-dom";
import {UserWorkHooks} from "../../../controller/Hooks/Atom/WorkHooks.ts";
import {useBoolean} from "ahooks";
import {LoadingOutlined} from "@ant-design/icons";
import {useEffect} from "react";


type LoginFormType = {
    keyword: string,
    identity: UserIdentityEnum
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
            className={"login-container-anima login-locations hover:flex-shadow flex flex-col justify-around container-shadow"}>
            <div className={"text-right pr-5 basis-1/6 pt-2"}>
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
    </div>
}

export default LoginPage;

function LoginComponent() {
    const nativate = useNavigate();
    const workMethod = UserWorkHooks.useMethod();
    const [isLoading, loadingAction] = useBoolean();
    const {message} = App.useApp();

    const onLogin = (val: LoginFormType) => {
        if (isLoading) return;
        loadingAction.setTrue();
        workMethod.loginAsync(val.keyword, val.identity).then(r => {
            if (r.status) {
                message.success("登录成功,正在跳转！").then();
                nativate("/home/login")
            } else message.error("登录失败").then();
            loadingAction.setFalse();
        }).catch(e => {
            console.error(e);
            loadingAction.setFalse();
        })
    };
    const cleanData = () => {
        workMethod.logout();
    }
    useEffect(() => {
        cleanData()
    }, []);
    return <div className={"flex flex-col justify-around h-full"}>
        <div className={"text-center text-2xl font-bold"}>欢迎来到安全简历登录系统</div>
        <Form<LoginFormType> onFinish={onLogin}>
            <Form.Item<LoginFormType> name={"keyword"} label={"钥匙"}>
                <Input/>
            </Form.Item>
            <Form.Item<LoginFormType> name={"identity"} label={"身份"}>
                <Select placeholder={"请选择你的身份"} options={identityOption}/>
            </Form.Item>
            <div className={"flex justify-center"}>
                <button className={"button button-raised button-primary button-3d"}>
                    <div className={"w-24"}>{isLoading ? <span><LoadingOutlined/> 正在登录</span> :
                        <span>点击登录</span>}</div>
                </button>
            </div>
        </Form>
        <div className={"text-center text-sm"}>
            <div>
                没有账号？<Link to={"/register"}>点我注册</Link>
            </div>
        </div>
    </div>
}

function AdminLoginComponent() {
    return <div className={"flex flex-col justify-around h-full"}>
        <div className={"text-center text-2xl  font-bold "}>欢迎来到安全简历部署管理系统</div>
        <Form>
            <Form.Item<LoginFormType> name={"keyword"} label={"钥匙"}>
                <Input/>
            </Form.Item>
        </Form>
        <div className={"flex justify-center"}>
            <button className={"button button-raised button-pill button-action button-3d"}>进入管理系统</button>
        </div>
    </div>
}
