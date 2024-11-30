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
