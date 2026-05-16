import { z } from "zod"

// Initial application
export const initialApplication = z.object({
  productId: z.string().min(1, "ProductId is required"),
  requestAmount: z.string().min(1, "Request amount is required"),
  requestedTenureMonths: z.string().min(1, "Tenure months is required"),
  purpose: z.string().min(1, "Purpose is required"),
  customerName: z.string().min(1, "Fullname is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  national: z.string().min(1, "National is required"),
  nationalId: z.string().min(1, "NationalId is required"),
  dateOfBirth: z.string().min(1, "DateOfBirth is required"),
})

export type InitialApplicationType = z.infer<typeof initialApplication>

// Step 1: Customer Information
export const customerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationalId: z.string().min(1, "National ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
})

// Step 2: Customer Income
export const customerIncomeSchema = z.object({
  employmentStatus: z.string().min(1, "Employment status is required"),
  employerName: z.string().min(1, "Employer name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  additionalIncome: z.string().optional(),
  incomeSource: z.string().optional(),
  yearsEmployed: z.string().min(1, "Years employed is required"),
})

// Step 3: Customer Relationship
export const customerRelationshipSchema = z.object({
  referenceName1: z.string().min(1, "Reference name is required"),
  referencePhone1: z.string().min(1, "Reference phone is required"),
  referenceRelation1: z.string().min(1, "Relationship is required"),
  referenceName2: z.string().optional(),
  referencePhone2: z.string().optional(),
  referenceRelation2: z.string().optional(),
  existingCustomer: z.string().min(1, "Please select an option"),
  accountNumber: z.string().optional(),
})

// Step 4: Customer Location
export const customerLocationSchema = z.object({
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  residenceType: z.string().min(1, "Residence type is required"),
  yearsAtAddress: z.string().min(1, "Years at address is required"),
})

// Step 5: Loan Information
export const loanInfoSchema = z.object({
  loanType: z.string().min(1, "Loan type is required"),
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanTerm: z.string().min(1, "Loan term is required"),
  interestRateType: z.string().min(1, "Interest rate type is required"),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  collateralType: z.string().optional(),
  collateralValue: z.string().optional(),
})

// Combined form data
export const loanFormSchema = z.object({
  customerInfo: customerInfoSchema,
  customerIncome: customerIncomeSchema,
  customerRelationship: customerRelationshipSchema,
  customerLocation: customerLocationSchema,
  loanInfo: loanInfoSchema,
})

export type CustomerInfo = z.infer<typeof customerInfoSchema>
export type CustomerIncome = z.infer<typeof customerIncomeSchema>
export type CustomerRelationship = z.infer<typeof customerRelationshipSchema>
export type CustomerLocation = z.infer<typeof customerLocationSchema>
export type LoanInfo = z.infer<typeof loanInfoSchema>
export type LoanFormData = z.infer<typeof loanFormSchema>

export const STEPS = [
  { id: 1, title: "Customer Information", description: "Personal details" },
  { id: 2, title: "Income Details", description: "Employment & income" },
  { id: 3, title: "Relationships", description: "References & contacts" },
  { id: 4, title: "Location", description: "Address information" },
  { id: 5, title: "Loan Details", description: "Loan specifications" },
  { id: 6, title: "Review", description: "Confirm & submit" },
] as const
