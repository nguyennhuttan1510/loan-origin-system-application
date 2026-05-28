import { useEffect, useState } from "react"
import Category from "@/lib/apis/category"
import type { SelectOption } from "@/lib/field-schema/types"

const cache = new Map<string, Promise<SelectOption[]>>()

function fetchCategoryOptions(categoryId: string): Promise<SelectOption[]> {
  if (!cache.has(categoryId)) {
    const promise = Category.getCategoryOptions(categoryId)
      .then(res => res.data.data.map(item => ({ value: item.code, label: item.title })))
      .catch(err => {
        cache.delete(categoryId)
        throw err
      })
    cache.set(categoryId, promise)
  }
  return cache.get(categoryId)!
}

export function useCategoryOptions(categoryId?: string): {
  options: SelectOption[]
  isLoading: boolean
} {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(!!categoryId)

  useEffect(() => {
    if (!categoryId) return
    let mounted = true
    setIsLoading(true)
    fetchCategoryOptions(categoryId)
      .then(opts => { if (mounted) setOptions(opts) })
      .catch(() => { if (mounted) setOptions([]) })
      .finally(() => { if (mounted) setIsLoading(false) })
    return () => { mounted = false }
  }, [categoryId])

  return { options, isLoading }
}
