"use client";

import {initialApplication, InitialApplicationType} from "@/lib/loan-form-types";
import {Card, CardContent} from "@/components/ui/card";
import {Categories, InitialApplication} from "@/components/loan-form/application-form";
import React, {useCallback, useEffect, useState} from "react";
import {ApplicationApi, CategoryApi} from "@/lib/apis";
import {ApplicationRequest} from "@/lib/apis/application-types";
import {
  CategoryItem,
  LoanProductResponse,
  ProductPropertiesResponse
} from "@/lib/apis/category-types";
import {formatISO} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/hooks/use-toast";
import {HttpResponse} from "@/lib/http-types";

const initialCategories: Categories = {
  products: [],
  productProperties: {} as ProductPropertiesResponse
}

const initialData: InitialApplicationType = {
  dateOfBirth: "",
  national: "",
  nationalId: "",
  phoneNumber: "",
  purpose: "",
  productId: "",
  customerName: "",
  requestAmount: "",
  requestedTenureMonths: "",
}

export interface StatusSubmit {
  success: boolean;
  message: string;
}

export default function ApplicationCreate() {
  const [formData, setFormData] = useState<InitialApplicationType>(initialData)
  const [status, setStatus] = useState<StatusSubmit>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Categories>(initialCategories)
  const [productSelected, setProductSelected] = useState<LoanProductResponse>()
  const {toast} = useToast()

  const onSetCategories = (category: Partial<Categories>) => {
    setCategories(prevState => ({...prevState, ...category}));
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: HttpResponse<CategoryItem[]> = await CategoryApi.getProducts();
        onSetCategories({"products": res.data.data});
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
  }, [])

  const validateCurrentStep = useCallback((): boolean => {
    const result = initialApplication.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }, [formData])

  const onSubmit = async () => {
    if (!validateCurrentStep()) return
    try {
      const payload: ApplicationRequest = {
        productId: Number(formData.productId),
        purpose: formData.purpose,
        requestAmount: formData.requestAmount,
        requestedTenureMonths: Number(formData.requestedTenureMonths),
        hasCollateral: false,
        hasGuarantor: false,
        dateOfBirth: formatISO(new Date(formData.dateOfBirth)),
        user: {
          phoneNumber: formData.phoneNumber,
          national: formData.national,
          nationalId: formData.nationalId,
          customerName: formData.customerName,
          dateOfBirth: formData.dateOfBirth,
          username: formData.phoneNumber,
          type: "CLIENT"
        }
      }
      const res = await ApplicationApi.createApplication(payload)
      if (res.status === 200) {
        setStatus(prevState => ({...prevState, success: true, message: "Application create successfully."}))
        toast({title: "Success", description: "Create loan application"})
      }
    } catch (e) {
      setStatus(prevState => ({...prevState, success: false, message: "Application create failed."}))
      console.error(e)
    }
  }

  const onChange = (partial: Partial<InitialApplicationType>) => {
    setFormData(prevState => ({...prevState, ...partial}))
  }

  const getTenureOfProduct = () => {
  }

  const getAmountOfProduct = () => {
  }

  const onSelectedProduct = async (value: CategoryItem["value"]) => {
    try {
      const res: HttpResponse<ProductPropertiesResponse> = await CategoryApi.getProductPropertiesById(value)
      const productRes: HttpResponse<LoanProductResponse> = await CategoryApi.getProductById(value)
      onSetCategories({"productProperties": res.data.data});
      setProductSelected(productRes.data.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="flex-1 md:ml-0">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">New Loan Application</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form below to create a new loan application.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center gap-8 py-8">
        <Card className="w-3/4 border-border shadow-sm">
          <CardContent className="p-6 md:p-8">
            <InitialApplication
              data={formData}
              status={status}
              errors={errors}
              categories={categories}
              productSelected={productSelected}
              onSelectedProduct={onSelectedProduct}
              onChange={onChange}
              onSubmit={onSubmit}
            />
          </CardContent>
        </Card>
      </div>
      <Toaster/>
    </main>

  )
}