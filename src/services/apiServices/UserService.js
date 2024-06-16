import { post } from "~/utils/request";

export const changePassword = async (data) => {
    const res = await post("user/change-password", data);
    return res.data;
}