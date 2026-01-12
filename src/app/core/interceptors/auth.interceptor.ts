import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  
  // Ne pas ajouter le token pour les endpoints publics
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  
  if (isPublicEndpoint) {
    return next(req);
  }

  // Vérifier si c'est un endpoint OAuth2
  const isOAuth2Endpoint = req.url.includes('/oauth2/');
  
  let token: string | null = null;
  
  if (isOAuth2Endpoint) {
    // Utiliser le token OAuth2 pour les endpoints /oauth2/
    token = tokenService.getOAuth2Token();
  } else {
    // Utiliser le token JWT classique pour les autres endpoints
    token = tokenService.getToken();
  }

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};