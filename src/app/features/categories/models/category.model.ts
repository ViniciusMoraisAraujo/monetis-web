export interface CategoryResponse {
  id: string;
  name: string;
  userId: string;
  icon: string;
}

export interface CreateCategoryRequest {
  name: string;
  icon: string;
}

export interface UpdateCategoryRequest {
  name: string;
  icon: string;
}
