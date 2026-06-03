import {UserType} from "@/lib/constants/user-types";

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  nationalId?: string;
  username?: string;
  createdAt: Date;
  roles: UserType[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (registerRequest: RegisterClientRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}


export interface AuthResponse {
  accessToken: string;
}

/** Shape returned by GET /me */
export interface UserResponse {
  userId: string;
  username: string;
  userType: string;
  roles: string[];
}

export interface RegisterClientRequest {
  username: string;
  password: string;
  customerName: string;
  phoneNumber: string;
  national: string;
  nationalId: string;
  dateOfBirth: string;
  type: string
}

export interface RegisterResponse extends UserResponse {}
