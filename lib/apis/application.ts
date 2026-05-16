import http from "@/lib/http";
import {ApplicationRequest} from "@/lib/apis/application-types";

const Application = {
  createApplication: (payload: ApplicationRequest) => http.post("/loan-application/create", payload)
}

export default Application;