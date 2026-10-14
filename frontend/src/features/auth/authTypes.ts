export type MemberRole = "USER" | "COMPANY" | "STORE" | "ADMIN";

export interface SignupAccountFields {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  userId: number;
  loginId: string;
  name: string;
  role: MemberRole;
}
