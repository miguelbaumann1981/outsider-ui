import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@envs/environment.development';
import { Article, ArticlesApi, HomeLayoutApi } from '../interfaces';
import { AnyCategory, ArticleCategory, ReleaseCode } from '../types';
import { ArticleCategoryMapper } from '../mappers';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.API_URL;

  getArticles(code: ReleaseCode): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles/${code}`);
  }

  getArticleBySlug(
    code: ReleaseCode,
    slug: string,
    category: ArticleCategory,
  ): Observable<AnyCategory> {
    const mapper = ArticleCategoryMapper[category];
    return this.http
      .get<Article>(`${this.baseUrl}/api/articles/${code.toUpperCase()}/${slug}`)
      .pipe(
        map((article) => {
          return mapper(article);
        }),
      );
  }

  getAllArticles(): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles`);
  }

  getHomeLayout(): Observable<HomeLayoutApi[]> {
    return this.http.get<HomeLayoutApi[]>(`${this.baseUrl}/api/home-layout`);
  }
}
