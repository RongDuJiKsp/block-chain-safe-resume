import "./login.css"
import {Form, Input, Select} from "antd"
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {DefaultOptionType} from "rc-select/lib/Select";
import {componentUtils} from "../../../controller/util/component.tsx";
import {createFromIconfontCN} from "@ant-design/icons";
import {Link} from "react-router-dom";

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
    return <Form>
        <Form.Item<LoginFormType> name={"keyword"} label={"钥匙"}>
            <Input/>
        </Form.Item>
        <Form.Item<LoginFormType> name={"identity"} label={"身份"}>
            <Select placeholder={"请选择你的身份"} options={identityOption}/>
        </Form.Item>
        <div className={"flex justify-center"}>
            <button className={"my-auto button button-primary button-3d"}>点击登录</button>
        </div>
    </Form>
}

function LoginPage() {
    return <div>
        <div
            className={"login-container-anima login-locations hover:flex-shadow flex flex-col justify-between container-shadow"}>
            <div className={"text-center text-2xl my-2 font-bold "}>欢迎来到安全简历登录系统</div>
            <div className={"mx-7"}>
                <LoginComponent/>
            </div>
            <div className={"my-8 text-center text-sm"}>没有账号？<Link to={"/register"}>点我注册</Link></div>
        </div>
    </div>
}

export default LoginPage;