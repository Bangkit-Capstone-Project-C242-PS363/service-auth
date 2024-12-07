export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  isSubscribe: boolean;
  token: string;
}
