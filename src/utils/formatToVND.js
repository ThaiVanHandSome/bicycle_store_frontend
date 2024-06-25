const formatToVND = (amount) => {
  if(!amount) return "";
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default formatToVND;
