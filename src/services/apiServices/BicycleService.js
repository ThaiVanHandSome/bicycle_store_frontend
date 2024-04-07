import { get, post } from "~/utils/request";

export const getImagesByIdBicycle = async (idBicycle) => {
  const res = await get(`bicycle/${idBicycle}/images`, {});
  return res.data;
};

export const getAllSizes = async () => {
  const res = await get("bicycle/sizes", {});
  return res.data;
};

export const getAllColors = async () => {
  const res = await get("bicycle/colors", {});
  return res.data;
};

export const getBicyclesWithPagination = async (offset, pageSize) => {
  const res = await get(`bicycles/pagination/${offset}/${pageSize}`, {});
  return res.data.content;
};

export const getBicyclesWithPaginationAndSorting = async (
  type,
  offset,
  pageSize,
  field,
) => {
  const res = await get(
    `bicycles/paginationAndSort/${type}/${offset}/${pageSize}/${field}`,
    {},
  );
  return res.data.content;
};

export const getAllBicycles = async () => {
  const res = await get("bicycles", {});
  return res.data;
};

export const postFilterBicycles = async (data) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await post("bicycles/filter", data);
  return res.data.data;
};
