import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ArticlesApi } from '../interfaces/articles-api.interface';
import { Observable } from 'rxjs';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  baseUrl: string = 'http://localhost:3000';

  getArticles(): Observable<ArticlesApi> {
    return this.http.get<ArticlesApi>(`${this.baseUrl}/api/articles`);
  }
}
