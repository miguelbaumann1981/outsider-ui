import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '@envs/environment.development';
import { Article, ArticlesApi, HomeLayoutApi } from '../interfaces';
import { AnyCategory, ArticleCategory, ReleaseCode } from '../types';
import { ArticleCategoryMapper } from '../mappers';
import { HomeLayoutCrud } from '@/features/admin/interfaces';

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

  getArticleById(id: string): Observable<Article> {
    return this.http
      .get<ArticlesApi>(`${this.baseUrl}/api/articles`)
      .pipe(map((data) => data.articles.find((item) => item.id === id) as Article));
  }

  getAllArticles(): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles`);
  }

  getHomeLayout(): Observable<HomeLayoutApi[]> {
    return this.http.get<HomeLayoutApi[]>(`${this.baseUrl}/api/home-layout`);
  }

  getHomeLayoutById(id: string): Observable<HomeLayoutApi> {
    return this.http
      .get<HomeLayoutApi[]>(`${this.baseUrl}/api/home-layout`)
      .pipe(map((data) => data.find((item) => item.id === id) as HomeLayoutApi));
  }

  createHomeLayout(body: HomeLayoutCrud): Observable<HomeLayoutApi> {
    return this.http.post<HomeLayoutApi>(`${this.baseUrl}/api/home-layout`, body).pipe(delay(1500));
  }

  updateHomeLayout(id: string, update: HomeLayoutCrud): Observable<HomeLayoutApi> {
    return this.http
      .put<HomeLayoutApi>(`${this.baseUrl}/api/home-layout/${id}`, update)
      .pipe(delay(1500));
  }
}
