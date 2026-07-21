import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '@envs/environment.development';
import { Release } from '../enums';
import { ArticlesApi, LayoutArticlesApi } from '../interfaces';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  getArticles(release: Release): Observable<ArticlesApi> {
    return this.http
      .get<ArticlesApi>(`${this.baseUrl}/api/articles/${release}`)
      .pipe(tap(() => localStorage.setItem('release', release)));
  }

  getLayoutArticles(): Observable<LayoutArticlesApi[]> {
    return this.http.get<LayoutArticlesApi[]>(`${this.baseUrl}/api/layout-articles`);
  }
}
