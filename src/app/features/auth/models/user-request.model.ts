import { Role } from '../../../core/models/role.enum';

export interface UserRequestDTO {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
}