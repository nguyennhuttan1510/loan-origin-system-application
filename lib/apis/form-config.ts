import http from "@/lib/http"
import { FormChannel, FormConfig } from "@/lib/form-config-types"
import { getDefaultConfig } from "@/lib/form-config-defaults"

const FormConfigApi = {
  /**
   * Fetches form config from BE: GET /loan-application/form-config?channel=STAFF&productId=1
   * Falls back to the static default when the endpoint is not yet available.
   */
  getFormConfig: async (channel: FormChannel, productId?: number): Promise<FormConfig> => {
    try {
      const params = new URLSearchParams({ channel })
      if (productId != null) params.set("productId", String(productId))
      const res = await http.get<FormConfig>(`/loan-application/form-config?${params}`)
      return res.data
    } catch {
      return getDefaultConfig(channel)
    }
  },
}

export default FormConfigApi
