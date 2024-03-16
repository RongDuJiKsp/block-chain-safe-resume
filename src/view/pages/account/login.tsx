import "./login.css"
import {Form, Input, Select} from "antd"
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {DefaultOptionType} from "rc-select/lib/Select";
import {componentUtils} from "../../../controller/util/component.tsx";
import {createFromIconfontCN} from "@ant-design/icons";
import {Link, NavLink, Route, Routes} from "react-router-dom";

const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js',
    ],
});

type LoginFormType = {
    keyword: string,
    identity: UserIdentityEnum
    remember: boolean,
}

const identityOption: DefaultOptionType[] = [
    {value: "Applicant", label: componentUtils.getIconLabel("Applicant", "icon-python")},
    {value: "Recruiter", label: componentUtils.getIconLabel("Recruiter", "icon-python")},
    {value: "KeyKeeper", label: componentUtils.getIconLabel("KeyKeeper", "icon-python")}
];

function LoginComponent() {

    return <div className={"flex flex-col justify-around h-full"}>
        <div className={"text-center text-2xl font-bold"}>欢迎来到安全简历登录系统</div>
        <Form>
            <Form.Item<LoginFormType> name={"keyword"} label={"钥匙"}>
                <Input/>
            </Form.Item>
            <Form.Item<LoginFormType> name={"identity"} label={"身份"}>
                <Select placeholder={"请选择你的身份"} options={identityOption}/>
            </Form.Item>
        </Form>
        <div className={"flex justify-center"}>
            <button className={"button button-raised button-primary button-3d"}>点击登录</button>
        </div>
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


function LoginPage() {
    return <div>
        <div
            className={"login-container-anima login-locations hover:flex-shadow flex flex-col justify-around container-shadow"}>
            <div className={"text-right pr-5 basis-1/6 pt-2"}>
                切换
                {[["管理端", "./admin"], ["用户端", "./user"]].map(r =>
                    <NavLink to={r[1]} className={({isActive}) => isActive ? "hidden" : ""}>{r[0]}</NavLink>)}
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