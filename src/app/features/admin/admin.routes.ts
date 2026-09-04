import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { IsPrivateZoneGuard } from '@/auth/guards';
import {
  AboutUsCrudPage,
  ArticlesCrudPage,
  HomeLayoutCrudPage,
  ReleaseCrudDetailPage,
  ReleasesCrudPage,
} from './pages';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canMatch: [IsPrivateZoneGuard],
    children: [
      {
        path: 'articles-crud',
        component: ArticlesCrudPage,
      },
      {
        path: 'about-us-crud',
        component: AboutUsCrudPage,
      },
      {
        path: 'home-layout-crud',
        component: HomeLayoutCrudPage,
      },
      {
        path: 'releases-crud',
        component: ReleasesCrudPage,
      },
      {
        path: 'releases-crud/:id',
        component: ReleaseCrudDetailPage,
      },
      {
        path: '**',
        redirectTo: 'releases-crud',
      },
    ],
  },
];

export default adminRoutes;
