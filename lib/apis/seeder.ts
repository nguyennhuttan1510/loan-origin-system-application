import http from "@/lib/http"
import type { HttpResponse } from "@/lib/http-types"
import type { LoanApplicationSeed } from "@/lib/apis/seeder-types"

const Seeder = {
  getAll: async (): Promise<HttpResponse<LoanApplicationSeed[]>> =>
    http.get("/seeder/application"),
}

export default Seeder
