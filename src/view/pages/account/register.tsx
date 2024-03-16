import "./register.css"
import {Steps} from "antd";
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
            <div className={"basis-1/5 my-auto"}>
                <Steps direction="vertical" items={stepItems} current={currentStep}/>
            </div>
            <div className={"basis-[66.6%] my-auto"}>
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
    const keys = Object.keys(UserIdentityEnum);
    const onSelect = (type: string): void => {
        registerInfo.infoSetter?.call(null, val => ({...val, userIdentity: type as UserIdentityEnum}));
    }
    return <div>
        <div className={"flex justify-center gap-14"}>
            {keys.map(val => val !== UserIdentityEnum.None &&
                <button className={"button button-3d button-pill"}
                        onClick={() => onSelect(val)}>{val}</button>)}
        </div>
    </div>
}


function FillInInformationComponent() {
    const registerInfo = useContext(RegisterInfoSetterContext);
    return <div>
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
    const registerInfo = useContext(RegisterInfoSetterContext);
    return <div>
        Well done
    </div>
}
