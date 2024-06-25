import { post } from "~/utils/request"

export const addComment = async (data) => {
    const res = await post("/comment/add", data);
    return res;
}