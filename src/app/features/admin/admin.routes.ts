import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { IsPrivateZoneGuard } from '@/auth/guards';
import {
  AboutUsCrudDetailPage,
  AboutUsCrudPage,
  ArticlesCrudPage,
  HomeLayoutCrudDetailPage,
  HomeLayoutCrudPage,
  ReleaseCrudDetailPage,
  ReleasesCrudPage,
} from './pages';
import { ArticlesCrudDetailPage } from './pages/articles-crud-detail-page/articles-crud-detail-page';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    // canMatch: [IsPrivateZoneGuard],
    children: [
      {
        path: 'articles-crud',
        component: ArticlesCrudPage,
      },
      {
        path: 'articles-crud/:id',
        component: ArticlesCrudDetailPage,
      },
      {
        path: 'about-us-crud',
        component: AboutUsCrudPage,
      },
      {
        path: 'about-us-crud/:id',
        component: AboutUsCrudDetailPage,
      },
      {
        path: 'home-layout-crud',
        component: HomeLayoutCrudPage,
      },
      {
        path: 'home-layout-crud/:id',
        component: HomeLayoutCrudDetailPage,
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
