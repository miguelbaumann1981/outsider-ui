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
import { MaintenanceComponent } from '@/shared/components/maintenance/maintenance';
import { environment } from '@envs/environment.development';
import { PublicLayout } from '../public/layout/public-layout/public-layout';
import { AboutUsPage } from '../public/pages/about-us-page/about-us-page';
import { ArticleDetailPage } from '../public/pages/article-detail-page/article-detail-page';
import { ContactPage } from '../public/pages/contact-page/contact-page';
import { HomePage } from '../public/pages/home-page/home-page';
import { ReleasesPage } from '../public/pages/releases-page/releases-page';

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
  {
    path: 'prod',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'release/:release',
        component: HomePage,
      },
      {
        path: 'articles/:release/:category/:slug',
        component: ArticleDetailPage,
      },
      {
        path: 'releases',
        component: ReleasesPage,
      },
      {
        path: 'about-us',
        component: AboutUsPage,
      },
      {
        path: 'contact',
        component: ContactPage,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default adminRoutes;
