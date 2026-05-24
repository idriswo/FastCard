import { axiosRequest } from "../utils/token";

export const getCategories = async () => {
  try {
    const {data} = await axiosRequest.get("/Category/get-categories");
    return data?.data || []; 
  } catch (error) {
    console.error("Хатогӣ ҳангоми гирифтани категорияҳо:", error);
    return [];
  }
};