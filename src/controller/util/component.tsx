import {createFromIconfontCN, QuestionCircleTwoTone} from "@ant-design/icons";
import {ComponentUtils} from "../../model/interface/util.ts";
import React, {CSSProperties} from "react";
import {Tooltip} from "antd";
import {IconFontProps} from "@ant-design/icons/es/components/IconFont";

// eslint-disable-next-line react-refresh/only-export-components
const IconFont = createFromIconfontCN({
    scriptUrl: [
       '//at.alicdn.com/t/c/font_4471939_8xygwxh3wxb.js'
    ],
});
export const componentUtils: ComponentUtils = {
    getIconLabel(value: string, element: string, config?: CSSProperties): React.ReactNode {
        return <span><IconFont style={config} type={element}/>&nbsp;{value}</span>;
    },
    getQuestionLabel(labelValue: string, tipsValue: string): React.ReactNode {
        return <span> {labelValue} <Tooltip title={tipsValue} color={"blue-inverse"}><QuestionCircleTwoTone
            twoToneColor={"#919191"}/></Tooltip> </span>;
    },
    getIcon(element: string, config?: CSSProperties): React.ReactNode {
        return <IconFont style={config} type={element}/>;
    },
    getIconVal(element: string, val: string | number, config?: CSSProperties): React.ReactNode {
        return <span><IconFont style={config} type={element}/>&nbsp;:&nbsp;{val}</span>;
    }
};