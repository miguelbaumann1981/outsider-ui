import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ArticlesApi } from '../interfaces/articles-api.interface';
import { Observable } from 'rxjs';
import { LayoutArticlesApi } from '../interfaces/layout-articles-api.interface';
import { environment } from '@envs/environment.development';
import { Release } from '../enums/release.enum';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  getArticles(release: Release): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles/${release}`);
  }

  getLayoutArticles(): Observable<LayoutArticlesApi[]> {
    return this.http.get<LayoutArticlesApi[]>(`${this.baseUrl}/api/layout-articles`);
  }
}
