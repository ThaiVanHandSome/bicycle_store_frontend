import get from "~/utils/request";

export const getAllCategories = async () => {
  try {
    const res = await get("categories", {});
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
