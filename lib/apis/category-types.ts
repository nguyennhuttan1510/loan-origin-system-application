export type CategoryItem = {
  name: string;
  value: string;
}

export type ProductPropertiesResponse = {
  id: number;
  name: string;
  amounts: CategoryItem[];
  tenures: CategoryItem[];
}

export interface ProductPropertiesRequest {
  type: "amount" | "tenure";
}

export interface LoanProductResponse {
  loanAmountMultiple: number,
  maxInterestRate: number,
  maxLoanAmount: number,
  minInterestRate: number,
  minLoanAmount: number,
  productCode: string,
  productName: string,
  type: string,
}

export interface CategoryOptionDto {
  title: string
  code: string
  description: string | null
}