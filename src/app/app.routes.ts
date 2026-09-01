import { Routes } from '@angular/router';

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
