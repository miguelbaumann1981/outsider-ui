import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { IsPrivateZoneGuard } from '@/auth/guards';
import { AboutUsCrudPage } from './pages/about-us-crud-page/about-us-crud-page';
import { ArticlesCrudPage } from './pages/articles-crud-page/articles-crud-page';
import { HomeLayoutCrudPage } from './pages/home-layout-crud-page/home-layout-crud-page';
import { ReleasesCrudPage } from './pages/releases-crud-page/releases-crud-page';

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
        path: '**',
        redirectTo: 'releases-crud',
      },
    ],
  },
];

export default adminRoutes;
