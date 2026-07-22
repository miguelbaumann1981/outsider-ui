import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';
import { HomePage } from './pages/home-page/home-page';
import { AboutUsPage } from './pages/about-us-page/about-us-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { ReleasesPage } from './pages/releases-page/releases-page';
import { ArticleDetailPage } from './pages/article-detail-page/article-detail-page';

export const publicRoutes: Routes = [
  {
    path: '',
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
        path: 'article/:slug',
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

export default publicRoutes;
