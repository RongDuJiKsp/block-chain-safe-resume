import icp from "../../../assets/icp.png";

type Prop={
    textColor:string;
}
export default function BeiAnComponent({textColor}:Prop) {
    return <div className={"flex justify-center gap-6"}>
        <a href="https://beian.miit.gov.cn/" target="_blank" style={{color:textColor}}>湘 ICP 备 2024057058 号 - 1</a>

        <span><img src={icp} alt={"icp"} draggable={false}
                   className={"h-[3vh] inline"}/> 湘公网安备 43130202000311 号</span>
    </div>;
}