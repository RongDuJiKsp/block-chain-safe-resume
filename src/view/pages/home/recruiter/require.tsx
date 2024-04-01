import {Form, Input} from "antd";
import {RecAuthorizeReq} from "../../../../model/http-bodys/user/recruiter/req.ts";

export default function RecruiterRequire() {
    const onSubmit = (val: RecAuthorizeReq) => {
        console.log(val);
    };
    return <div className={"flex flex-col gap-14 justify-center basic-window h-full-screen"}>
        <div className={"basis-3/5  mx-44 px-24 py-16  work-window-color"}>
            <div className={"px-36"}>
                <Form<RecAuthorizeReq> onFinish={onSubmit}>
                    <Form.Item<RecAuthorizeReq> label={"请求用户的名称"} name={"ApUserName"}
                                                rules={[{min: 4, max: 12, message: "名称不合法"},
                                                    {required: true, message: "请填写昵称"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item<RecAuthorizeReq> label={"请求用户的地址"} name={"ApAddress"}
                                                rules={[{required: true, message: "请填写地址"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <div className={"flex justify-center"}>
                            <button className={"button-3d button button-pill button-primary "}>发送请求</button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>;
}