import React, {PropsWithChildren} from "react";

export default function MainContainerProvider({children}: PropsWithChildren<{}>) {
    return <div className={"flex flex-col justify-center h-full-screen basic-window gap-4 "}>
        <div className={"bg-white  px-6 py-4 basis-3/4 basic-shadow-box"}>
            {children}
        </div>
    </div>;
}