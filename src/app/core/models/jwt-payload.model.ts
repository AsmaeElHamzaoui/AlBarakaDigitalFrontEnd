import { Role } from './role.enum';

export interface JwtPayload {
  sub: string;        // email
  role: Role;
  iat?: number;       // issued at
  exp?: number;       // expiration
}