import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/role.enum';
import { DashboardAgentComponent } from './components/dashboard/dashboard-agent';
import { PendingOperationsListComponent } from './components/pending-operations/pending-operations-list.component';
import { OperationDetailsComponent } from './components/operation-details/operation-details';

export const AGENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardAgentComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.AGENT_BANCAIRE] }
  },
  {
    path: 'operations/pending',
    component: PendingOperationsListComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.AGENT_BANCAIRE] }
  },
  {
    path: 'operations/:id',
    component: OperationDetailsComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.AGENT_BANCAIRE] }
  }
];
