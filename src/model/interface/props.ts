export interface ModelPropsWithInfoAndClear<Data, Prop = unknown> {
    clear: CallBackWithSideEffect;
    data: Data | null;
    prop?: Prop;
}