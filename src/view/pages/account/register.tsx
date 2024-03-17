import "./register.css"
import {App, Form, Input, Result, Steps} from "antd";
import React, {
    createContext,
    Dispatch,
    ReactElement,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import {StepProps} from "antd/es/steps";
import {
    CheckCircleOutlined,
    ContainerOutlined,
    FileSearchOutlined,
    IdcardOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {componentUtils} from "../../../controller/util/component.tsx";
import {cryptoOfHash} from "../../../controller/crypto/hash.ts";
import {ruleConfig} from "../../../config/backendrule.config.ts";
import {BasicUserInfo, HashedUserRegisterInformation} from "../../../model/entity/user.ts";
import {StepInformation} from "../../../model/interface/util.ts";
import {alovaClientImpl} from "../../../controller/net/netClientImpl.ts";
import {RegisterReq, RegisterRes} from "../../../model/http-bodys/reqs.ts";
import {useBoolean} from "ahooks";
import {ResultStatusType} from "antd/es/result";
import {FileSystemImpl} from "../../../controller/util/InteractiveSystem.ts";
import {useNavigate} from "react-router-dom";


function getDescriptionWithStep(targetStep: number, currentStep: number, description: string): string {
    if (currentStep < targetStep) return "Waiting here";
    else if (currentStep === targetStep) return description;
    else return "Well done";
}


interface RegisterUserInfo extends BasicUserInfo {
    inputInfo: HashedUserRegisterInformation
}

const userRegisterInfoDefaultValue: RegisterUserInfo = {
    inputInfo: {userAnoKey: "", userIDCard: "", userIdentity: UserIdentityEnum.None, userName: ""},
    hash: "",
    privateKey: "",
    identity: UserIdentityEnum.None,
    nick: ""
}


interface StateManager {
    nextStep?: () => void;
    lastStep?: () => void;
    reStart?: () => void;
    infoSetter?: Dispatch<SetStateAction<RegisterUserInfo>>
    info: RegisterUserInfo,
    resSetter?: Dispatch<SetStateAction<RegisterRes | undefined>>
    res?: RegisterRes

}

const RegisterInfoSetterContext = createContext<StateManager>({info: userRegisterInfoDefaultValue});


const StepElements: StepInformation[] = [
    {
        title: "Select Identity",
        focusDescription: "选择您的注册身份",
        noFocusIcon: <IdcardOutlined/>,
        element: <SelectIdentityComponent/>
    },
    {
        title: "Fill in information",
        focusDescription: "填写您的个人信息",
        noFocusIcon: <ContainerOutlined/>,
        element: <FillInInformationComponent/>
    },
    {
        title: "Check Your Information",
        focusDescription: "核对您的个人信息",
        noFocusIcon: <FileSearchOutlined/>,
        element: <CheckInformationComponent/>
    }, {
        title: "Check Result",
        focusDescription: "注册完成，请查看注册结果",
        noFocusIcon: <CheckCircleOutlined/>,
        element: <GetResultComponent/>
    }
];

function RegisterPage() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [userInfo, setUSerInfo] = useState<RegisterUserInfo>(userRegisterInfoDefaultValue);
    const [registerRes, setRegisterRes] = useState<RegisterRes>();
    const stepItems: StepProps[] = StepElements.map((val, index): StepProps => {
        return {
            title: val.title,
            description: getDescriptionWithStep(index, currentStep, val.focusDescription),
            icon: currentStep === index ? <LoadingOutlined/> : val.noFocusIcon,
        }
    })
    const setNextStep = () => {
        setCurrentStep(r => r + 1);
    }
    const setLastStep = () => {
        setCurrentStep(r => r - 1);
    }
    const reStart = () => {
        setCurrentStep(0);
        setUSerInfo(userRegisterInfoDefaultValue);
    }
    return <div className={"overflow-hidden  register-page-bg-color login-full-anima"}>
        <div className={"login-full-context-anima login-full-container flex justify-around"}>
            <div className={"basis-1/5"}>
                <div className={"mt-[35%]"}>
                    <Steps direction="vertical" items={stepItems} current={currentStep}/>
                </div>
            </div>
            <div className={"basis-2/3"}>
                <RegisterInfoSetterContext.Provider value={{
                    nextStep: setNextStep,
                    info: userInfo,
                    infoSetter: setUSerInfo,
                    lastStep: setLastStep,
                    reStart: reStart,
                    res: registerRes,
                    resSetter: setRegisterRes
                }}>
                    {StepElements.map((val, index) => currentStep === index &&
                        <div key={"register-page-" + index} className={"h-full"}>{val.element}</div>)}
                </RegisterInfoSetterContext.Provider>
            </div>
        </div>
    </div>
}

export default RegisterPage;

function SelectIdentityComponent() {
    const registerInfo = useContext(RegisterInfoSetterContext);
    const {message} = App.useApp();
    const keys = Object.keys(UserIdentityEnum);
    const [selectedIdentity, setSelectedIdentity] = useState<UserIdentityEnum>(UserIdentityEnum.None);
    const onNextClick = (): void => {
        if (selectedIdentity === UserIdentityEnum.None) {
            message.error("You can't continue with None").then();
            return;
        }
        registerInfo.infoSetter?.call(null, (v): RegisterUserInfo => ({
            ...v,
            inputInfo: {...v.inputInfo, userIdentity: selectedIdentity},
            identity: selectedIdentity
        }));
        registerInfo.nextStep?.call(null);
    }

    return <div className={"h-full flex flex-col justify-around"}>
        <div className={"basis-3/5"}>
            <div className={"pt-8 flex flex-col gap-12"}>
                <p className={"text-center text-2xl font-sans"}>系统身份介绍</p>
                <p className={"text-lg"}>
                    Applicant: <br/>
                    Applicant是简历所有者，拥有持有该文件的绝对权利。Applicant对简历进行加密，同时将加密后的简历对应的搜索索引上传到云服务器。任何人都不能查看Applicant的简历，除非Applicant授权
                </p>
                <p className={"text-lg"}>
                    Recruiter: <br/>
                    用户要求下载完整的简历信息。请求
                    授权后，通过智能合约合成完整的密钥。Recruiter 输入地址后
                    加密恢复客户端并调用合约接收解密密钥，完成
                    可以获取明文简历。同时，Recruiter 可以使用合约生成搜索
                    用于搜索包含关键字的简历的令牌。
                </p>
                <p className={"text-lg"}>
                    Key keeper:<br/>
                    Key keeper 通过安全通道接收 Applicant 的子密钥，并可以接收保管人
                    Key keeper可以通过提供以下方式从Recruiter获得部分资金用于下载简历:<br/>
                    子项通过智能合约正确执行，并协助恢复对称密钥。
                </p>
            </div>
        </div>
        <div className={"basis-1/12"}>
            <p className={"text-center text-2xl my-7"}>请选择你需要注册的身份</p>
        </div>
        <div className={"basis-1/12"}>
            <div className={"h-full flex justify-center gap-14"}>
                {keys.map((val, index) => val !== UserIdentityEnum.None &&
                    <button key={"select-id-button" + index} className={"button button-3d button-pill"}
                            onClick={() => setSelectedIdentity(val as UserIdentityEnum)}>{val}</button>)}
            </div>
        </div>
        <div className={"basis-1/12"}>
            <div className={"justify-center flex"}>
                <button className={"button button-raised button-primary "}
                        onClick={onNextClick}>Continue With {selectedIdentity}</button>
            </div>
        </div>
    </div>
}


function FillInInformationComponent() {
    const registerInfo = useContext(RegisterInfoSetterContext);
    const [formRef] = Form.useForm<HashedUserRegisterInformation>();
    const onConformAndNext = () => {
        registerInfo.infoSetter?.call(null, (prevState): RegisterUserInfo => {
            const infoVal: HashedUserRegisterInformation = {
                ...formRef.getFieldsValue(), userIdentity: prevState.identity
            }
            return {
                ...prevState,
                inputInfo: infoVal,
                hash: cryptoOfHash.hashData(JSON.stringify(infoVal)),
                nick: formRef.getFieldValue("nick")
            }
        });

        registerInfo.nextStep?.call(null);
    }
    const onFirstLoad = useCallback(() => {
        formRef.setFieldsValue(registerInfo.info.inputInfo);
        formRef.setFieldValue("nick", registerInfo.info.nick);

    }, [formRef, registerInfo.info])
    useEffect(() => {
        onFirstLoad();
    }, [onFirstLoad]);
    return <div className={"h-full login-full-context-anima flex flex-col justify-around"}>
        <div className={"basis-1/12 text-center py-2 text-lg font-sans"}>
            请在此填写用户信息
        </div>
        <div className={"basis-3/5 pl-12"}>
            <Form className={"flex flex-col gap-12 w-2/3 my-auto"} form={formRef} labelCol={{span: 8}}
                  wrapperCol={{span: 16}} onFinish={onConformAndNext}>
                <Form.Item<HashedUserRegisterInformation> name={"userName"}
                                                          rules={[{required: true, message: "姓名不能为空"}, {
                                                              min: 2,
                                                              max: 30,
                                                              message: "姓名不符合要求"
                                                          }]}
                                                          label={componentUtils.getQuestionLabel("姓名", "您的姓名用于计算您的身份hash，我们承诺您的姓名只在本地参与运算，不会上传到服务器。")}>
                    <Input/>
                </Form.Item>
                <Form.Item<HashedUserRegisterInformation> name={"userIDCard"}
                                                          rules={[{required: true, message: "身份证或数字id不能为空"}, {
                                                              pattern: ruleConfig.identityCardRegexp,
                                                              len: 18,
                                                              message: "身份证号不符合要求"
                                                          }]}
                                                          label={componentUtils.getQuestionLabel("身份证号或数字id", "您的身份证号码仅和您的姓名用于计算您的身份hash，我们承诺您的身份证号码只在本地参与运算，不会上传到服务器。")}>
                    <Input/>
                </Form.Item>
                <Form.Item<RegisterUserInfo> name={"nick"} rules={[{required: true, message: "昵称不能为空！"}]}
                                             label={"昵称"}>
                    <Input/>
                </Form.Item>
                <Form.Item<HashedUserRegisterInformation> name={"userAnoKey"}
                                                          rules={[{required: true, message: "请填写安全语句"}]}
                                                          label={componentUtils.getQuestionLabel("安全语句", "您的安全语句用于混淆计算出来的hash，以防止恶意分子获取到您的信息后恶意注册影响您的正常使用，安全语句可以是任意内容，但请记住已便于找回hash")}>
                    <Input.TextArea autoSize={{minRows: 5, maxRows: 5}}/>
                </Form.Item>
                <Form.Item className={"flex justify-center"}>
                    <button className={"button button-3d button-pill button-primary-flat"}>
                        Conform
                    </button>
                </Form.Item>
            </Form>
        </div>
    </div>
}

function CheckInformationComponent() {
    const {message} = App.useApp();
    const [isLoading, setLoading] = useBoolean();
    const registerInfo = useContext(RegisterInfoSetterContext);
    const operateHooks = {
        onRestart() {
            registerInfo.reStart?.call(null);
        },
        onLastStep() {
            registerInfo.lastStep?.call(null);
        },
        onFinish() {
            if (isLoading) return;
            setLoading.setTrue();
            onUploadServer().then(() => {
                setLoading.setFalse();
                registerInfo.nextStep?.call(null);
            }).catch(err => {
                message.error("发生了错误:" + err).then();
                setLoading.setFalse();
            });
        }
    }
    const onUploadServer = async () => {
        const reqBody: RegisterReq = {
            identity: registerInfo.info.identity,
            hashID: registerInfo.info.hash,
            nickname: registerInfo.info.nick
        }
        registerInfo.resSetter?.call(null, await alovaClientImpl.Post<RegisterRes>("/register", reqBody));
    }

    return <div className={"login-full-context-anima h-full flex flex-col justify-around"}>
        <div className={"basis-1/12 text-xl text-center "}>
            <div className={"mt-5"}> 请核对您的个人信息是否正确，一经注册，无法修改！</div>
        </div>
        <div className={"basis-3/5 border-2 border-purple-300 bg-pale"}>
            <div className={"px-[22%] flex flex-col justify-around h-full"}>
                <p>
                    您的姓名 : {registerInfo.info.inputInfo.userName}
                </p>
                <p>
                    您的身份证号 : {registerInfo.info.inputInfo.userIDCard}
                </p>
                <p>
                    您的注册身份 : {registerInfo.info.inputInfo.userIdentity}
                </p>
                <p>
                    您的安全语句 : {registerInfo.info.inputInfo.userAnoKey}
                </p>
                <p>
                    您的昵称 : {registerInfo.info.nick}
                </p>
                <p>
                    系统计算的hash:<br/>
                    {registerInfo.info.hash}
                </p>

            </div>
        </div>
        <div className={"basis-1/5"}>
            <div className={"w-2/3 flex justify-around mx-auto"}>
                <button className={"button button-3d button-caution"} onClick={operateHooks.onRestart}>重新填写</button>
                <button className={"button button-3d button-primary"} onClick={operateHooks.onFinish}>
                    {isLoading ? <span><LoadingOutlined/>提交中</span> : "确认提交"}
                </button>
                <button className={"button button-3d button-royal"} onClick={operateHooks.onLastStep}>上一步</button>
            </div>
        </div>
    </div>
}

function GetResultComponent() {
    const {res} = useContext(RegisterInfoSetterContext);
    const {message} = App.useApp();
    const navigate = useNavigate();
    const onDownload = () => {
        FileSystemImpl.downloadToFile(new Blob(["PrivateKeyValue : " + res?.PrivateKeys]), `${res?.ETHAccounts} of ${res?.hashID}`, "key").then(() => message.success("下载成功！"))
    }
    const onReturnPage = () => {
        navigate("/", {replace: true});
    }
    return <div className={"h-full  flex flex-col justify-around "}>
        <div className={"border-2 border-purple-300 bg-half-write basis-2/3"}>
            <Result status={res ? "success" : "error"} title={res?.status ? "注册成功" : "注册失败，请重试"}
                    extra={[res?.status && <button className={"button button-3d button-action"} key={"btn-01"}
                                                   onClick={onDownload}>保存key</button>,
                        <button className={"button button-3d button-primary"} key={"btn-02"}
                                onClick={onReturnPage}>返回登录</button>]}
                    subTitle={res?.status ? "请牢记你的key，此key无法找回！请按下下载按钮保存key" : "原因：" + res?.message}/>
        </div>
    </div>
}
