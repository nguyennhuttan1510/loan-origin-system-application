import http from "@/lib/http";
import {RegisterStaffRequest} from "@/lib/apis/authentication-types";

const registerStaff = (payload: RegisterStaffRequest) => http.post("/me/create-user", payload);

const Authentication = {
  registerStaff
}

export default Authentication;