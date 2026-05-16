import {AxiosResponse} from "axios";

export interface ApiResponse<T = any, C = any, H = any> {
  data: T;
  message: string;
}

export type HttpResponse<T = any, C = any, H = any> = AxiosResponse<ApiResponse<T>, C, H>
