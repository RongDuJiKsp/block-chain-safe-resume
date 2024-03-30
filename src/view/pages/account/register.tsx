import "./register.css";
import {App, Result, Steps} from "antd";
import React, {createContext, Dispatch, SetStateAction, useContext, useState} from "react";
import {StepProps} from "antd/es/steps";
import {CheckCircleOutlined, IdcardOutlined, LoadingOutlined,} from "@ant-design/icons";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {StepInformation} from "../../../model/interface/util.ts";
import {RegisterRes} from "../../../model/http-bodys/ress.ts";
import {FileSystemImpl} from "../../../controller/util/InteractiveSystem.ts";
import {useNavigate} from "react-router-dom";
import {UserWorkHooks} from "../../../controller/Hooks/Atom/WorkHooks.ts";


function getDescriptionWithStep(targetStep: number, currentStep: number, description: string): string {
    if (currentStep < targetStep) return "Waiting here";
    else if (currentStep === targetStep) return description;
    else return "Well done";
}


interface StateManager {
    nextStep?: () => void;
    lastStep?: () => void;
    reStart?: () => void;
    resSetter?: Dispatch<SetStateAction<RegisterResult | undefined>>
    res?: RegisterResult
}

interface RegisterResult {
    res: RegisterRes;
    identity: UserIdentityEnum
}

const RegisterInfoSetterContext = createContext<StateManager>({});


const StepElements: StepInformation[] = [
    {
        title: "Select Identity",
        focusDescription: "选择您的注册身份",
        noFocusIcon: <IdcardOutlined/>,
        element: <SelectIdentityComponent/>
    },
    {
        title: "Check Result",
        focusDescription: "注册完成，请查看注册结果",
        noFocusIcon: <CheckCircleOutlined/>,
        element: <GetResultComponent/>
    }
];

function RegisterPage() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [registerRes, setRegisterRes] = useState<RegisterResult>();
    const stepItems: StepProps[] = StepElements.map((val, index): StepProps => {
        return {
            title: val.title,
            description: getDescriptionWithStep(index, currentStep, val.focusDescription),
            icon: currentStep === index ? <LoadingOutlined/> : val.noFocusIcon,
        };
    });
    const setNextStep = () => {
        setCurrentStep(r => r + 1);
    };
    const setLastStep = () => {
        setCurrentStep(r => r - 1);
    };
    const reStart = () => {
        setCurrentStep(0);
    };
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
    </div>;
}

export default RegisterPage;

function SelectIdentityComponent() {
    const registerInfoHandle = useContext(RegisterInfoSetterContext);
    const registerServer = UserWorkHooks.useMethod();
    const {message} = App.useApp();
    const keys = Object.keys(UserIdentityEnum);
    const [selectedIdentity, setSelectedIdentity] = useState<UserIdentityEnum>(UserIdentityEnum.None);
    const onNextClick = (): void => {
        if (selectedIdentity === UserIdentityEnum.None) {
            message.error("You can't continue with None").then();
            return;
        }
        registerServer.registerAsync(selectedIdentity).then(r => {
            if (r.status) {
                registerInfoHandle.resSetter?.call(null, {identity: selectedIdentity, res: r});
                message.success("注册成功").then();
                registerInfoHandle.nextStep?.call(null);
            } else {
                message.error(r.message).then();
            }
        }).catch(e => {
            console.log(e);
            message.error(e.message).then();
        });
    };

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
                    Key keeper可以通过提供以下方式从Recruiter获得部分token:<br/>
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
    </div>;
}


function GetResultComponent() {
    const {res} = useContext(RegisterInfoSetterContext);
    const {message} = App.useApp();
    const navigate = useNavigate();
    const onDownload = () => {
        console.log(res, res?.res.privateKeys);
        const fileContext = `Please keep your  key, once lost, you can't get it back!
        PrivateValue : ${res?.res.privateKeys}
        address : ${res?.res.address}
        SafeKey:${res?.res.S}
        SubSafeKeyPair[M,X] :${res?.res.M.map((val, index) => {
            return `\n        [${val},${res?.res.X[index]}]`;
        })}
        You can login with PrivateValue and verify with SafeKey and Find SafeKey with SubSafeKey
        Please give the SubKey to the key holder who has been granted the right to pledge
        `;
        FileSystemImpl.downloadToFileFromSuffix(new Blob([fileContext]), `${res?.res.address?.substring(0, 7)}... of ${res?.identity}`, "key").then(() => message.success("下载成功！"));
    };
    const onReturnPage = () => {
        navigate("/", {replace: true});
    };
    return <div className={"h-full  flex flex-col justify-around "}>
        <div className={"border-2 border-purple-300 bg-half-write basis-2/3"}>
            <Result status={res?.res.status ? "success" : "error"}
                    title={res?.res.status ? "注册成功" : "注册失败，请重试"}
                    extra={<span className={"flex justify-center gap-14"}>
                             <button className={"button button-3d button-action"} onClick={onDownload}
                                     style={{display: res?.res.status ? "inline-block" : "none"}}>
                                 保存key
                             </button>
                             <button className={"button button-3d button-primary"} onClick={onReturnPage}>
                              返回登录
                            </button>
                             </span>}
                    subTitle={res?.res.status ? "请牢记你的key，此key无法找回！请按下下载按钮保存key" : "原因：" + res?.res.message}/>
        </div>
    </div>;
}


