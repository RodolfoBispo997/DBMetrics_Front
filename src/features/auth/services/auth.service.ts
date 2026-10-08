import { api } from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  CurrentUser,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/features/auth/types/auth";

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post<RegisterResponse>("/auth/register", data);

  return response.data;
}

export async function verifyEmail(data: VerifyEmailRequest) {
  const response = await api.post<VerifyEmailResponse>("/auth/verify-email", data);

  return response.data;
}

export async function resendVerification(data: ResendVerificationRequest) {
  const response = await api.post<ResendVerificationResponse>(
    "/auth/resend-verification",
    data,
  );

  return response.data;
}

export async function logout() {
  await api.post<void>("/auth/logout");
}

export async function getCurrentUser() {
  const response = await api.get<CurrentUser>("/auth/me");

  return response.data;
}
