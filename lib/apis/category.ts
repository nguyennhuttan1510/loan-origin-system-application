import http from "@/lib/http";
import {ProductPropertiesRequest} from "@/lib/apis/category-types";

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
}

export default Category;