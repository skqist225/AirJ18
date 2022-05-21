import { IUser } from "../types/user/type_User";

export function setUserToLocalStorage(user: IUser) {
    if (user) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
    }
}
