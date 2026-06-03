import http from '@/lib/http';
import {
  ApiResponse,
  ApproveRequest,
  ApproveResponse,
  PaginatedResponse,
  RejectRequest,
  RejectResponse,
  UnderwritingDetailResponse,
  UnderwritingListItem,
  UnderwritingQueueParams,
} from '@/lib/apis/underwriting-types';

const UnderwritingApi = {
  listQueue: (params?: UnderwritingQueueParams) =>
    http.get<ApiResponse<PaginatedResponse<UnderwritingListItem>>>(
      '/loan-application/underwriting/queue',
      { params }
    ),

  getDetail: (id: number) =>
    http.get<ApiResponse<UnderwritingDetailResponse>>(
      `/loan-application/${id}/underwriting-detail`
    ),

  approve: (id: number, body: ApproveRequest) =>
    http.post<ApiResponse<ApproveResponse>>(
      `/loan-application/${id}/underwriting/approve`,
      body
    ),

  reject: (id: number, body: RejectRequest) =>
    http.post<ApiResponse<RejectResponse>>(
      `/loan-application/${id}/underwriting/reject`,
      body
    ),
};

export default UnderwritingApi;
