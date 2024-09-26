import { AxiosError } from "axios";
import { testloApi } from "../api/testlo.api";

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  token: string;
}

export class AuthService {
  static login = async (email: string, password: string) => {
    try {
      const { data } = await testloApi.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      console.log(data);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
        throw new Error(error.response?.data);
      }

      throw new Error("Unable to login");
    }
  };

  static checkStatus = async (): Promise<LoginResponse> => {
    try {
      const { data } = await testloApi.get<LoginResponse>("/auth/check-status");
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Unauthorized");
    }
  };
}
