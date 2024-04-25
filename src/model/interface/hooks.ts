

export interface AtomHooks<Values, Methods> {
    /**
     *  调用后提供状态
     *  @template Values
     *  @return {Values} 提供的状态组
     */
    useValue(): Values;

    /**
     * 调用后提供改变状态的钩子
     * @template Methods
     * @return {Methods} 提供的改变状态的钩子
     */
    useMethod(): Methods;
}


export interface CancelableOperateHooks {
    onConform(): void;

    onCancel(): void;
}
