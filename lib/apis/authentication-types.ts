export interface RegisterStaffRequest {
  customerName: string;
  phoneNumber: string;
  national: string;
  nationalId: string;
  type: string
  roles: string[];
}