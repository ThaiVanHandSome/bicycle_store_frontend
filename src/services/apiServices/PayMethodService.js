import { get } from "~/utils/request"

export const getAllPayMethods = async () => {
    const res = get("pay-methods");
    return res;
}