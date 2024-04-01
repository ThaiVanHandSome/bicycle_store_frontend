import get from "~/utils/request";

export const getImagesByIdBicycle = async (idBicycle) => {
  const res = await get(`bicycle/${idBicycle}/images`, {});
  return res.data;
};
