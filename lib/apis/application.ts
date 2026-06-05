import http from "@/lib/http";
import {
  ApplicationRequest,
  ApplicationUpdateResponse,
  LoanApplication,
  UpdateApplicationRequest,
} from "@/lib/apis/application-types";
import { ApiResponse, PaginatedResponse, UnderwritingListItem, UnderwritingQueueParams } from "@/lib/apis/underwriting-types";

const Application = {
  createApplication: (payload: ApplicationRequest) =>
    http.post("/loan-application/create", payload),

  listApplications: (params?: UnderwritingQueueParams) =>
    http.get<ApiResponse<PaginatedResponse<UnderwritingListItem>>>(
      "/loan-application/underwriting/queue",
      { params }
    ),

  getApplicationDetail: (id: number) =>
    http.get<ApiResponse<LoanApplication>>(
      `/loan-application/${id}`
    ),

  updateApplication: (id: number, payload: UpdateApplicationRequest) =>
    http.post<ApiResponse<ApplicationUpdateResponse>>(
      `/loan-application/${id}/update`,
      payload
    ),
};

export default Application;
