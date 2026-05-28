import { useEffect, useState } from "react"
import Category from "@/lib/apis/category"
import type { SelectOption } from "@/lib/field-schema/types"

// Module-level promise cache — survives re-renders, prevents duplicate fetches
const cache = new Map<string, Promise<SelectOption[]>>()

function fetchCategoryOptions(categoryId: string): Promise<SelectOption[]> {
  if (!cache.has(categoryId)) {
    const promise = Category.getCategoryOptions(categoryId).then(
      res => res.data.data.map(item => ({ value: item.code, label: item.title }))
    )
    cache.set(categoryId, promise)
  }
  return cache.get(categoryId)!
}

export function useCategoryOptions(categoryId?: string): {
  options: SelectOption[]
  isLoading: boolean
} {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!categoryId) return
    setIsLoading(true)
    fetchCategoryOptions(categoryId)
      .then(setOptions)
      .finally(() => setIsLoading(false))
  }, [categoryId])

  return { options, isLoading }
}
