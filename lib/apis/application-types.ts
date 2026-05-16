import {RegisterClientRequest} from "@/lib/auth-types";

export interface ApplicationRequest {
  productId: number,
  requestAmount: string,
  requestedTenureMonths: number,
  purpose: string,
  hasCollateral: boolean,
  hasGuarantor: boolean,
  dateOfBirth: string
  user: Omit<RegisterClientRequest, "password">
}