import get from "~/utils/request";

export const getAllCategories = async () => {
  try {
    const res = await get("categories", {});
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllBicyclesByCategory = async (idCategory) => {
  try {
    const res = await get(`category/${idCategory}/bicycles`, {});
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
