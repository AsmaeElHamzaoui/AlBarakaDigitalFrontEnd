import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { AUTH_ROUTES } from './features/auth/auth-routes';
import { CLIENT_ROUTES } from './features/client/client-routes';
import { AGENT_ROUTES } from './features/agent/agent-routes';
import { ADMIN_ROUTES } from './features/admin/admin-routes';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },

  {
    path: 'auth',
    children: AUTH_ROUTES
  },

  {
    path: 'client',
    canActivate: [AuthGuard],
    children: CLIENT_ROUTES
  },

  {
    path: 'agent',
    canActivate: [AuthGuard],
    children: AGENT_ROUTES
  },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: ADMIN_ROUTES
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
