import { get } from "~/utils/request"

export const getCart = async () => {
    const res =  await get("cart");
    return res;
}