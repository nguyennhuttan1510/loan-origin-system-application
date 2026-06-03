import http from "@/lib/http";
import { ApplicationRequest, ApplicationUpdateResponse, UpdateApplicationRequest } from "@/lib/apis/application-types";
import { ApiResponse, PaginatedResponse, UnderwritingListItem, UnderwritingQueueParams } from "@/lib/apis/underwriting-types";
import type { LoanApplicationSeed } from "@/lib/apis/seeder-types";

const Application = {
  createApplication: (payload: ApplicationRequest) =>
    http.post("/loan-application/create", payload),

  listApplications: (params?: UnderwritingQueueParams) =>
    http.get<ApiResponse<PaginatedResponse<UnderwritingListItem>>>(
      "/loan-application/underwriting/queue",
      { params }
    ),

  getApplicationDetail: (id: number) =>
    http.get<ApiResponse<LoanApplicationSeed>>(
      `/loan-application/${id}`
    ),

  updateApplication: (id: number, payload: UpdateApplicationRequest) =>
    http.post<ApiResponse<ApplicationUpdateResponse>>(
      `/loan-application/${id}/update`,
      payload
    ),
};

export default Application;
