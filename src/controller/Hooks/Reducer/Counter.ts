import {StepCounterAction, StepCounterReducer} from "../../../model/interface/reduces.ts";

export const StepCounterReducerImpl: StepCounterReducer = (prev: number, action: StepCounterAction): number => {
    if (action === "next") return prev + 1;
    if (action === "last") return prev <= 0 ? 0 : prev - 1;
    if (action === "reset") return 0;
    throw Error("未知操作");
};
