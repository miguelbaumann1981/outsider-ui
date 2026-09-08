import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@envs/environment.development';
import { Article, ArticlesApi, LayoutArticlesApi } from '../interfaces';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { AnyCategory, ArticleCategory, ReleaseCode } from '../types';
import { ArticleCategoryMapper } from '../mappers';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private baseUrl: string = environment.API_URL;

  getArticles(code: ReleaseCode): Observable<ArticlesApi> {
    return this.http
      .get<ArticlesApi>(`${this.baseUrl}/api/articles/${code}`)
      .pipe(tap(() => this.localStorageService.setItem('release', code)));
  }

  getArticleBySlug(
    code: ReleaseCode,
    slug: string,
    category: ArticleCategory,
  ): Observable<AnyCategory> {
    const mapper = ArticleCategoryMapper[category];
    return this.http.get<Article>(`${this.baseUrl}/api/articles/${code}/${slug}`).pipe(
      map((article) => {
        return mapper(article);
      }),
    );
  }

  getLayoutArticles(): Observable<LayoutArticlesApi[]> {
    return this.http.get<LayoutArticlesApi[]>(`${this.baseUrl}/api/layout-articles`);
  }

  getAllArticles(): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles`);
  }
}
