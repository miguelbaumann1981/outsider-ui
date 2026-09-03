import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { Observable } from 'rxjs';
import { AboutUsApi } from '../interfaces';

@Service()
export class AboutUsService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  getAboutUsInfo(): Observable<AboutUsApi[]> {
    return this.http.get<AboutUsApi[]>(`${this.baseUrl}/api/about-us`);
  }
}
