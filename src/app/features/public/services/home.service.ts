import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '@envs/environment.development';
import { Release } from '../enums';
import { Article, Article2, ArticlesApi, ArticlesApi2, LayoutArticlesApi } from '../interfaces';
import { LocalStorageService } from '@/core/services/local-storage.service';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private baseUrl: string = environment.url;

  getArticles(release: Release): Observable<ArticlesApi> {
    return this.http
      .get<ArticlesApi>(`${this.baseUrl}/api/articles/${release}`)
      .pipe(tap(() => this.localStorageService.setItem('release', release)));
  }

  getArticleBySlug(release: Release, slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/api/articles/${release}/${slug}`);
  }

  getArticles2(release: Release): Observable<ArticlesApi2> {
    return this.http
      .get<ArticlesApi2>(`${this.baseUrl}/api/articles/${release}`)
      .pipe(tap(() => this.localStorageService.setItem('release', release)));
  }

  getArticleBySlug2(release: Release, slug: string): Observable<Article2> {
    return this.http.get<Article2>(`${this.baseUrl}/api/articles/${release}/${slug}`);
  }

  getLayoutArticles(): Observable<LayoutArticlesApi[]> {
    return this.http.get<LayoutArticlesApi[]>(`${this.baseUrl}/api/layout-articles`);
  }

  getAllArticles(): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles`);
  }
}
