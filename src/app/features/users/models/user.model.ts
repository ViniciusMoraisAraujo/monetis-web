export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}
