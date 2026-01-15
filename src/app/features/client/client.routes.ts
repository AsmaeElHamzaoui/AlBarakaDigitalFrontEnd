import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { OperationListComponent } from './components/operations/operation-list/operation-list.component';
import { DepositComponent } from './components/operations/deposit/deposit.component';
import { WithdrawalComponent } from './components/operations/withdrawal/withdrawal.component';
import { TransferComponent } from './components/operations/transfer/transfer.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'account',
    component: AccountDetailsComponent
  },
  {
    path: 'operations',
    component: OperationListComponent
  },
  {
    path: 'operations/deposit',
    component: DepositComponent
  },
  {
    path: 'operations/withdrawal',
    component: WithdrawalComponent
  },
  {
    path: 'operations/transfer',
    component: TransferComponent
  }
];
