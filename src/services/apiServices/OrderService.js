import { get, post } from "~/utils/request"

export const checkout = async (data) => {
    const res = await post("checkout", data);
    return res;
}

export const checkoutProcessor = async (idBicycle, idBicycleColor, idBicycleSize, quantity) => {
    const params = {
        idBicycle,
        idBicycleColor,
        idBicycleSize,
        quantity
    }
    const res = await get(`checkout-processor`, params);
    return res;
}

export const getAllOrders = async (page, size) => {
    const params = {
        page,
        size
    }
    const res = await get("purchases", params);
    return res;
}

export const getOrderById = async (idOrder) => {
    const res = await get(`purchase/${idOrder}`);
    return res;
}