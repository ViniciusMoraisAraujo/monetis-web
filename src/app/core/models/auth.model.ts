export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserClaims {
  id: string;
  email: string;
}
