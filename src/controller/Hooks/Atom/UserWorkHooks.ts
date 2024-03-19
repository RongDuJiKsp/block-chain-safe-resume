import {atom} from "jotai/vanilla/atom";
import {BasicUserInfo} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {useAtomValue} from "jotai/react/useAtomValue";

const userInfoAtom=atom<BasicUserInfo|null>(null);
interface UserWorkProvider{
    userInfo:BasicUserInfo|null;
}
interface UserWorkCustomer{

}
const userWorkHooks:AtomHooks<UserWorkProvider, UserWorkCustomer>={
    useValue(): UserWorkProvider {
        const value=useAtomValue(userInfoAtom);
        return {
            userInfo:value
        }
    },
    useMethod(): UserWorkCustomer {
        return {

        }
    }
}