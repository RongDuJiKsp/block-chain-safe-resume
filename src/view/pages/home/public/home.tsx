import "./public.css";
import logo from "../../../../assets/logo-p.png";
import title from "../../../../assets/title.png";

export default function HomePage() {
    return <div className={"h-full-screen flex flex-col justify-center  bg-gray-700"}>
        <Instruction/>
    </div>;
}

function Instruction() {
    return <div className={"h-full px-3 py-2 text-white"}>
        <div>
            <span className={"font-sans font-bold text-3xl"}>关于我们</span>
        </div>
        <div className={"mt-[15vh] flex px-[11vw] justify-center"}>
            <div className={"rotate-45 bg-blue-half p-10 rounded-2xl"}>
                <div className={" h-[250px] w-[250px] flex-col justify-center border-4 border-blue-300 rounded-2xl"}>
                    <div className={"p-12"}>
                        <div className={"flex flex-col justify-center -rotate-45 pl-3 border-gray-300"}>
                            <img className={"h-fit w-fit"} src={logo} alt={"logo"}/>
                            <img className={"h-fit w-fit"} src={title} alt={"title"}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-[68vw] -mx-12 flex-col flex justify-between pl-20 pr-6  py-8 font-bold font-sans"}>
                <div className={"border-skew show-window-border pl-6 py-1"}>
                    <div className={"border-de-skew"}>
                        本平台响应"十四五规划"中提出的建设数字中国的战略目标，打造一套基于区块链的简历安全共享全流程管理平台，旨在打造一个安全、共享、互信的在线招聘环境。
                    </div>
                </div>
                <div className={"ml-14 show-window-border pl-3 py-1" }>
                    本平台以"安全、共享、互信"作为核心理念，利用Fisco Bcos区块链框架、WeBase中间件、IPFS(星际文件系统)构建其基础架构，并采用智能合约、秘密共享等核心技术，开发去中心化Web应用程序。
                </div>
                <div className={"border-de-skew show-window-border pl-11 pb-1 pt-2"}>
                    <div className={"border-skew"}>
                        本平台围绕求职者、企业雇主两大主体用户，并引入秘密份额托管人，实现高度去中心化的简历安全存储和密钥管理，为求职者提供安全可控的简历在线共享服务，为企业雇主提供真实完整、未经篡改的简历在线查看服务，旨在解决传统在线招聘行业中存在的信任危机，为双方提供一个更加透明、可靠的在线招聘环境
                    </div>
                </div>
            </div>
        </div>
    </div>;
}