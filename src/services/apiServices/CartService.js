import { deleteReq, get } from "~/utils/request"

export const getCart = async () => {
    const res =  await get("cart");
    return res;
}

export const deleteProducInCart = async (data) => {
    const res = await deleteReq("cart", data);
    return res;
}