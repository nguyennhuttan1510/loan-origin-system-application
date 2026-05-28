import http from "@/lib/http";
import { CategoryOptionDto, ProductPropertiesRequest } from "@/lib/apis/category-types";

const Category = {
  /*
  *  PRODUCT
  * */
  getProducts: () => http.get("/categories/products"),

  getProductById: (id: string) => http.get(`/categories/product/${id}`),

  getProductPropertiesById: (id: string) => http.get(`/categories/product/${id}/properties?type=amount&type=tenure`),

  /*
  *  ROLE
  * */

  getRolesByAuth: () => http.get(`/categories/roles`),

  getCategoryOptions: (categoryId: string) =>
    http.get<{ success: boolean; data: CategoryOptionDto[] }>(`/categories/options/${categoryId}`),
}

export default Category;