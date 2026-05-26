import {CategoryItem} from "@/lib/apis/category-types";

export interface StaffResponse {
  active: boolean;
  fullName: string;
  departments: string[];
  id: number;
  phone: string;
  roles: CategoryItem[];
  username: string;
  national: string;
  nationalId: string;
}
