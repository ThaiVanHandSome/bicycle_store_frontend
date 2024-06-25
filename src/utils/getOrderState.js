export const getOrderState = (state) => {
    switch (state) {
        case "WAITING":
            return "Chờ xác nhận";
        case "DELIVER":
            return "Đang chuẩn bị hàng";
        case "SHIP":
            return "Đang giao hàng";
        case "COMPLETE":
            return "Giao hàng thành công";
        case "CANCEL":
            return "Đã hủy đơn hàng";
    }
}