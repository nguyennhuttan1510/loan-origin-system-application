import {UserType} from "@/lib/constants/user-types";

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  nationalId?: string;
  username?: string;
  createdAt: Date;
  role: UserType;
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

export interface UserResponse {
  id: string;
  username: string;
  phoneNumber: string;
  nationalId: string;
  type: UserType;
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
