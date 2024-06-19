import { post } from "~/utils/request"

export const checkout = async (data) => {
    const res = await post("checkout", data);
    return res.data;
}