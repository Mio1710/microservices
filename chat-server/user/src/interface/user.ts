export interface UserRegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
}
