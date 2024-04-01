interface TableHeaderProp {
    title: string;

    onFresh(): void;
}

export default function TableHeader({title, onFresh}: TableHeaderProp) {
    return <div className={"flex justify-between pb-4 border-b-[1px]"}>
        <div className={"font-sans font-bold my-auto"}>{title}</div>
        <button className={"button button-primary button-pill"} onClick={onFresh}>刷新</button>
    </div>;
}