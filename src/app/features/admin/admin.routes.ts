import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

// import { IsPrivateZoneGuard } from '@/auth/guards/is-private-zone.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    // canMatch: [ IsPrivateZoneGuard ],
    // children: [
    //   {
    //     path: '**',
    //     redirectTo: 'orders',
    //   },
    // ],
  },
];

export default adminRoutes;
