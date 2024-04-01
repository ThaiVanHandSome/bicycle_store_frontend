const formatToVND = (amount) => {
  // Sử dụng hàm toLocaleString() với locale là 'vi-VN' (Việt Nam) và style là 'currency' để định dạng số tiền thành đơn vị VND
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default formatToVND;
