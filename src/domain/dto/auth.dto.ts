export interface RegisterUserDTO {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
