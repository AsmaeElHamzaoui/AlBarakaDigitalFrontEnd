import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/role.enum';
import { DashboardAdminComponent } from './components/dashboard/dashboard-admin';
import { UserListComponent } from './components/user-management/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-management/user-details/user-details.compoenent';
import { UserFormComponent } from './components/user-management/user-form/user-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardAdminComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.ADMIN] }
  }
];
