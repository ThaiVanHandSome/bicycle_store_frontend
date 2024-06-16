import { get, post } from "~/utils/request"

export const register = async (data) => {
    const res = await post("auth/register", data);
    return res.data;
}

export const authenticate = async (data) => {
    const res = await post("auth/authenticate", data);
    return res.data;
}

export const confirmToken = async (token) => {
    const res = await get(`auth/register/confirm?token=${token}`);
    return res;
}

export const sendOtp = async (email) => {
    const res = await post(`auth/send-otp?email=${email}`);
    return res.data;
}

export const refreshToken = async (token) => {
    const data = {
        token
    };
    const res = await post("auth/refresh-token", data);
    return res.data;
}