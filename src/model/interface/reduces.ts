export type StepCounterAction = "next" | "last" | "reset";
export type StepCounterReducer = (prev: number, action: StepCounterAction) => number;