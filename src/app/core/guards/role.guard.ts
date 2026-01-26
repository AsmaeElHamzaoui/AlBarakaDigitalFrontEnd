import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: Role[] = route.data['roles'] as Role[];
  const userRole = authService.getUserRole();

  if (!userRole) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // Rediriger vers le dashboard approprié si mauvais rôle
  console.warn(`Accès refusé. Rôle requis: ${expectedRoles}, Rôle utilisateur: ${userRole}`);
  authService.redirectByRole();
  return false;
};
