import http from "@/lib/http";
import {HttpResponse} from "@/lib/http-types";
import {StaffResponse} from "@/lib/apis/staff-types";
import {RegisterStaffRequest} from "@/lib/apis/authentication-types";

const Staff = {
  getStaffs: async (): Promise<HttpResponse<StaffResponse[]>> => http.get(`/user/staffs`),

  getStaff: async (id: number): Promise<HttpResponse<StaffResponse>> => http.get(`/user/staff/${id}`),

  updateStaff: async (id: number, payload: RegisterStaffRequest): Promise<HttpResponse<StaffResponse>> => http.patch(`/user/staff/${id}`, payload),

  deleteStaff: async (id: number): Promise<HttpResponse<StaffResponse>> => http.delete(`/user/staff/${id}`),
}

export default Staff