import { get, post } from "~/utils/request"

export const register = async (data) => {
    const res = await post("auth/register", data);
    return res.data;
}

export const authenticate = async (data) => {
    const res = await post("auth/authenticate", data);
    return res.data;
}

export const registerConfirm = async (token) => {
    const res = await get(`auth/register/confirm?token=${token}`);
    return res;
}