import { Routes } from '@angular/router';
import { MaintenancePage } from './pages/maintenance/maintenance-page';

export const maintenanceRoutes: Routes = [
  {
    path: 'maintenance',
    component: MaintenancePage,
  },
];

export default maintenanceRoutes;
