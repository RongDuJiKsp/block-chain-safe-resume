import "./register.css";
import {App, Form, Input, Result, Steps} from "antd";
import React, {createContext, ReactNode, useContext, useReducer} from "react";
import {StepProps} from "antd/es/steps";
import {CheckCircleOutlined, ContactsOutlined, IdcardOutlined, LoadingOutlined,} from "@ant-design/icons";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {StepInformation} from "../../../model/interface/util.ts";
import {useNavigate} from "react-router-dom";
import {useBoolean} from "ahooks";
import {motion} from "framer-motion";
import {UserRegisterHook} from "../../../controller/Hooks/Store/RegisterHooks.ts";
import {StepCounterAction} from "../../../model/interface/reduces.ts";
import {StepCounterReducerImpl} from "../../../controller/Hooks/Reducer/Counter.ts";


function getDescriptionWithStep(targetStep: number, currentStep: number, description: string): string {
    if (currentStep < targetStep) return "等待中";
    else if (currentStep === targetStep) return description;
    else return "已完成";
}


const StepElements: StepInformation[] = [
    {
        title: "Select Identity",
        focusDescription: "选择您的注册身份",
        noFocusIcon: <IdcardOutlined/>,
        element: <SelectIdentityComponent/>
    },
    {
        title: "Input Information",
        focusDescription: "输入用户名和密码",
        noFocusIcon: <ContactsOutlined/>,
        element: <InputInformationComponent/>
    },
    {
        title: "Check Result",
        focusDescription: "注册完成，请查看注册结果",
        noFocusIcon: <CheckCircleOutlined/>,
        element: <GetResultComponent/>
    }
];
const RegisterStepCountContext = createContext<React.Dispatch<StepCounterAction>>(() => 0);

function RegisterPage() {
    const [currentStep, currentStepDispatch] = useReducer(StepCounterReducerImpl, 0);
    const stepItems: StepProps[] = StepElements.map((val, index): StepProps => {
        return {
            title: val.title,
            description: getDescriptionWithStep(index, currentStep, val.focusDescription),
            icon: currentStep === index ? <LoadingOutlined/> : val.noFocusIcon,
        };
    });

    return <div className={"overflow-hidden register-page-bg-color login-full-anima"}>
        <div className={"login-full-context-anima login-full-container flex justify-around"}>
            <div className={"basis-1/5"}>
                <div className={"mt-[35%] bg-better-write py-8 px-6 basic-shadow-box"}>
                    <Steps direction="vertical" items={stepItems} current={currentStep}/>
                </div>
            </div>
            <div className={"basis-2/3"}>
                <RegisterStepCountContext.Provider value={currentStepDispatch}>
                    {StepElements.map((val, index) => currentStep === index &&
                        <div key={"register-page-" + index} className={"h-full"}>{val.element}</div>)}
                </RegisterStepCountContext.Provider>
            </div>
        </div>
    </div>;
}

export default RegisterPage;
type InfoContext = {
    title: string,
    message: string,
    key: UserIdentityEnum,
}
const texts: InfoContext[] = [
    {
        key: UserIdentityEnum.Applicant,
        title: "Applicant",
        message: "Applicant是简历所有者 提供：上传简历、简历授权、简历溯源、简历记录等功能 "
    },
    {
        key: UserIdentityEnum.Recruiter,
        title: "Recruiter",
        message: "Recruiter是企业HR用户 提供： 上传简历、简历授权、简历溯源、简历记录等功能"
    }
];

function SelectIdentityComponent() {
    const {message} = App.useApp();
    const {selectedIdentity} = UserRegisterHook.useValue();
    const registerServer = UserRegisterHook.useMethod();
    const stepDispatch = useContext(RegisterStepCountContext);
    const onNextClick = (): void => {
        if (selectedIdentity === UserIdentityEnum.None) {
            message.error("You can't continue with None").then();
            return;
        }
        stepDispatch("next");
    };

    return <div className={"h-full flex flex-col justify-center"}>
        <div className={"basis-2/5"}>
            <div className={"pt-8 flex flex-row gap-12 justify-around"}>
                {texts.map((unit, index) => (
                    <div key={"text-info-of" + index}
                         className={unit.key === selectedIdentity ? "basic-green-shadow-box bg-better-write max-w-[42%] h-fit " : "basic-shadow-box bg-better-write max-w-[42%] h-fit"}>
                        <ShowIdentityAndSelect onClick={() => registerServer.selectUserIdentity(unit.key)}
                                               isSelected={unit.key === selectedIdentity} info={unit}/>
                    </div>
                ))}
            </div>
        </div>
        <div className={"basis-1/12"}>
            <div className={"justify-center flex"}>
                <button className={"button button-raised button-primary "}
                        onClick={onNextClick}>以身份 : {selectedIdentity} 继续
                </button>
            </div>
        </div>
    </div>;
}

interface ShowingIdentityParam {
    onClick: CallBackWithSideEffect;
    info: InfoContext;
    isSelected: boolean
}

function ShowIdentityAndSelect({onClick, info}: ShowingIdentityParam) {
    const [isHovered, setHoveredAction] = useBoolean();
    return <motion.div onClick={onClick} onMouseOver={setHoveredAction.setTrue} onMouseOut={setHoveredAction.setFalse}
                       className={"px-8 py-3"}>
        <motion.p className={"font-sans text-lg text-center"}>{info.title}</motion.p>
        <motion.p className={"overflow-hidden"} transition={{duration: 0.8, ease: "easeInOut"}} animate={{
            height: isHovered ? "auto" : 0,
            width: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? "1.4rem" : 0,
            marginBottom: isHovered ? "1.1rem" : 0,
        }}> {info.message}</motion.p>
    </motion.div>;
}

interface FormInput {
    name: string;
    pwd: string;
    pwdAgain: string;
}

function InputInformationComponent(): ReactNode {
    const registerServer = UserRegisterHook.useMethod();
    const {message} = App.useApp();
    const stepDispatch = useContext(RegisterStepCountContext);
    const onClickNext = (value: FormInput) => {
        registerServer.registerWithDataAndStoreAsync(value.name, value.pwd).then(r => {
            if (r.status) {
                message.success("注册成功").then();
                stepDispatch("next");
            } else {
                message.error(r.message).then();
            }
        }).catch(e => {
            message.error(e.message).then();
        });
    };


    return <div className={"h-full flex flex-col justify-around showing-in"}>
        <div className={"border-2 border-purple-300 bg-better-write basis-2/3"}>
            <Form<FormInput> className={"mx-[27%] mt-[14%]"} onFinish={onClickNext}>
                <Form.Item<FormInput> name={"name"} label={"用户名"} labelCol={{span: 6}}
                                      rules={[{min: 3, max: 12}, {required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item<FormInput> name={"pwd"} label={"密码"} labelCol={{span: 6}}
                                      rules={[{min: 4, max: 12}, {required: true}, {pattern: /[0-9a-zA-Z]+/}]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item<FormInput> name={"pwdAgain"} label={"确认密码"} labelCol={{span: 6}} dependencies={['pwd']}
                                      rules={[{required: true}, ({getFieldValue}) => ({
                                          async validator(_, value: string) {
                                              if (getFieldValue("pwd") === value) return;
                                              else throw Error("两次输入的密码不一致！");
                                          }
                                      })]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <button type="submit"
                            className={"button button-primary button-pill button-raised ml-[40%]"}>下一步
                    </button>
                </Form.Item>
            </Form>
        </div>
    </div>;
}

function GetResultComponent() {
    const {message} = App.useApp();
    const {registered, message: msg} = UserRegisterHook.useValue();
    const registerServer = UserRegisterHook.useMethod();
    const [canClose, setCanClose] = useBoolean();
    const navigate = useNavigate();
    const onDownload = () => {
        registerServer.callFileDownloadWithData().then(() => {
            message.success("文件下载成功！").then();
            setCanClose.setTrue();
        }).catch(e => {
            message.error("文件下载失败，原因" + e).then();
        });
    };
    const onReturnPage = () => {
        if (!canClose) {
            message.warning("请保存注册回执").then();
            return;
        }
        registerServer.reset();
        navigate("/", {replace: true});
    };
    return <div className={"h-full flex flex-col justify-around showing-in"}>
        <div className={"border-2 border-purple-300 bg-better-write basis-2/3"}>
            <Result status={registered ? "success" : "error"}
                    title={registered ? "注册成功" : "注册失败，请重试"}
                    extra={<span className={"flex justify-center gap-14"}>
                             <button className={"button button-3d button-action"} onClick={onDownload}
                                     style={{display: registered ? "inline-block" : "none"}}>
                                 保存回执
                             </button>
                             <button className={"button button-3d button-primary"} onClick={onReturnPage}>
                              返回登录
                            </button>
                             </span>}
                    subTitle={registered ? "按下下载按钮获取注册回执" : "原因：" + msg}/>
        </div>
    </div>;
}


