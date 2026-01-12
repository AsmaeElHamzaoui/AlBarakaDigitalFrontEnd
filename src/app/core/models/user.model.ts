import { Role } from './role.enum';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt: Date;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface OAuth2LoginResponse {
  accessToken: string;
}

export interface UserRequestDTO {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt: Date;
}