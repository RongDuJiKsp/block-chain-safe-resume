import {createFromIconfontCN, QuestionCircleTwoTone} from "@ant-design/icons";
import {ComponentUtils} from "../../model/interface/util.ts";
import React from "react";
import {Tooltip} from "antd";

// eslint-disable-next-line react-refresh/only-export-components
const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js',
    ],
});
export const componentUtils: ComponentUtils = {
    getIconLabel(value: string, element: string): React.ReactNode {
        return <span><IconFont type={element}/>&nbsp;{value}</span>
    },
    getQuestionLabel(labelValue: string, tipsValue: string): React.ReactNode {
        return <span> {labelValue} <Tooltip title={tipsValue} color={"blue-inverse"}><QuestionCircleTwoTone twoToneColor={"#919191"}/></Tooltip> </span>
    }
}