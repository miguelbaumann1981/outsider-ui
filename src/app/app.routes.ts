import { Routes } from '@angular/router';
import { MaintenanceComponent } from './shared/components/maintenance/maintenance';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes'),
  },
];
