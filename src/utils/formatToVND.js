const formatToVND = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default formatToVND;
