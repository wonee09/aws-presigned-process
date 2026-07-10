import api from "./api";
import { SignupRequest, LoginRequest, AuthResponse } from "@/types/auth";

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/signup", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};
