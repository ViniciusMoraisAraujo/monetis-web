export interface CardResponse {
  id: string;
  name: string;
  userId: string;
}

export interface CreateCardRequest {
  name: string;
}

export interface UpdateCardRequest {
  name: string;
}
