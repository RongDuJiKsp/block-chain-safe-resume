import {createAlova} from "alova";
import ReactHook from 'alova/react';
import GlobalFetch from 'alova/GlobalFetch';
import {serverConfig} from "../../config/net.config.ts";

export const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: serverConfig.backendUrl
})
