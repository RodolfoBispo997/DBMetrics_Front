import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/features/auth/types/auth";

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
}
