import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/releases-crud/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'release/:release',
    renderMode: RenderMode.Server,
  },
  {
    path: 'articles/:release/:category/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
