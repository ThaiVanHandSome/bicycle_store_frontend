import { post } from "~/utils/request"

export const addToCart = async (data) => {
    const res = await post("/cart/add", data);
    return {
        check: res.data.data,
        message: res.data.message
    }
}