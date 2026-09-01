import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { IsPrivateZoneGuard } from '@/auth/guards';
import { AboutUsCrudPage } from './pages/about-us-crud-page/about-us-crud-page';
import { ArticlesCrudPage } from './pages/articles-crud-page/articles-crud-page';
import { HomeLayoutCrudPage } from './pages/home-layout-crud-page/home-layout-crud-page';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canMatch: [IsPrivateZoneGuard],
    children: [
      {
        path: 'about-us-crud',
        component: AboutUsCrudPage,
      },
      {
        path: 'articles-crud',
        component: ArticlesCrudPage,
      },
      {
        path: 'home-layout-crud',
        component: HomeLayoutCrudPage,
      },
      {
        path: '**',
        redirectTo: 'articles-crud',
      },
    ],
  },
];

export default adminRoutes;
