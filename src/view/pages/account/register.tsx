import "./register.css"
import {App, Steps} from "antd";
import React, {createContext, Dispatch, ReactElement, SetStateAction, useContext, useState} from "react";
import {StepProps} from "antd/es/steps";
import {
    CheckCircleOutlined,
    ContainerOutlined,
    FileSearchOutlined,
    IdcardOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";

function getDescriptionWithStep(targetStep: number, currentStep: number, description: string): string {
    if (currentStep < targetStep) return "Waiting here";
    else if (currentStep === targetStep) return description;
    else return "Well done";
}

interface UserRegisterInfo {
    userIdentity: UserIdentityEnum;
    userName: string;
    userIDCard: string;
    userAnoKey: string;
}

const userRegisterInfoDefaultValue: UserRegisterInfo = {
    userAnoKey: "", userIDCard: "", userIdentity: UserIdentityEnum.None, userName: ""
}

interface StateManager {
    nextStep?: () => void;
    infoSetter?: Dispatch<SetStateAction<UserRegisterInfo>>
    info: UserRegisterInfo

}

const RegisterInfoSetterContext = createContext<StateManager>({info: userRegisterInfoDefaultValue});


interface StepInformation {
    title: string;
    focusDescription: string;
    noFocusIcon: ReactElement;
    element: ReactElement
}

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
    const [userInfo, setUSerInfo] = useState<UserRegisterInfo>(userRegisterInfoDefaultValue);
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
                    infoSetter: setUSerInfo
                }}>
                    {StepElements.map((val, index) => currentStep === index && val.element)}
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
        registerInfo.infoSetter?.call(null, v => ({...v, userIdentity: selectedIdentity}));
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
                {keys.map(val => val !== UserIdentityEnum.None &&
                    <button className={"button button-3d button-pill"}
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
    return <div className={"login-full-context-anima"}>
        Fill it
        <button className={"button-3d button"} onClick={registerInfo.nextStep}></button>
    </div>
}

function CheckInformationComponent() {
    const registerInfo = useContext(RegisterInfoSetterContext);
    return <div>
        Chick it
        <button className={"button-3d button"} onClick={registerInfo.nextStep}></button>
    </div>
}

function GetResultComponent() {
    return <div>
        Well done
    </div>
}
