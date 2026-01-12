import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as Role;
  const userRole = authService.getUserRole();

  if (!userRole) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (userRole === requiredRole) {
    return true;
  }

  // Rediriger vers le dashboard approprié si mauvais rôle
  console.warn(`Accès refusé. Rôle requis: ${requiredRole}, Rôle utilisateur: ${userRole}`);
  authService.redirectByRole();
  return false;

  
};