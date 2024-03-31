import {useCallback, useState} from "react";

type UseSwapBoolean = [boolean, () => void];

export function useSwapBoolean(): UseSwapBoolean {
    const [bool, setBool] = useState<boolean>(false);
    return [bool, useCallback(() => {
        setBool(prevState => !prevState);
    }, [])];
}