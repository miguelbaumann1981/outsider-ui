import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HomeService {
  private http = inject(HttpClient);
  baseUrl: string = 'http://localhost:3000';

  getArticles(): void {
    this.http.get<any>(`${this.baseUrl}/api/articles`).subscribe((data) => {
      console.log(data);
    });
  }
}
