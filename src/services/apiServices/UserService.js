import { get, post } from "~/utils/request";

export const changePassword = async (data) => {
    const res = await post("user/change-password", data);
    return res;
}

export const getUser = async () => {
    const res = await get("user");
    return res;
}

export const updateUser = async (data) => {
    const headers = {
        'Content-Type': 'multipart/form-data'
      };
    const res = await post("user/update", data, headers);
    return res;
}