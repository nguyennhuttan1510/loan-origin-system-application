import http from "@/lib/http"

const SeederApi = {
  getAll: () => http.get("/seeder/application"),
}

export default SeederApi
